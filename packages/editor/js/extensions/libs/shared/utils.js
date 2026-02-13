// @flow

/**
 * External dependencies
 */
import { useSelect } from '@wordpress/data';
import { getBlockType } from '@wordpress/blocks';
import { useRef, useState, useEffect } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { getEditorDocumentElement } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { prepareBlockCssSelector } from '../../../style-engine/get-compatible-block-css-selector';
import { isInnerBlock } from '../../components/utils';

/**
 * Extracts display value from blockeraDisplay attribute (handles { value: "flex" } format).
 */
function getDisplayValue(blockeraDisplay: any): string {
	if (!blockeraDisplay) {
		return '';
	}
	if (
		typeof blockeraDisplay === 'object' &&
		blockeraDisplay.value !== undefined
	) {
		return String(blockeraDisplay.value);
	}
	return String(blockeraDisplay);
}

/**
 * Gets parent flex block info from block attributes (breakpoint-aware, no DOM).
 */
function getParentFlexBlockInfoFromAttributes(
	parentAttributes: ?Object,
	currentBreakpoint: string
): { isParentFlexBlock: boolean, parentFlexDirection: 'row' | 'column' | '' } {
	if (!parentAttributes) {
		return { isParentFlexBlock: false, parentFlexDirection: '' };
	}
	const breakpointAttrs =
		parentAttributes?.blockeraBlockStates?.value?.normal?.breakpoints?.[
			currentBreakpoint
		]?.attributes;
	const display =
		getDisplayValue(breakpointAttrs?.blockeraDisplay) ||
		getDisplayValue(parentAttributes.blockeraDisplay);
	const flexLayout =
		breakpointAttrs?.blockeraFlexLayout ??
		parentAttributes.blockeraFlexLayout;
	const direction =
		(typeof flexLayout === 'object' && flexLayout?.value?.direction) ||
		(typeof flexLayout === 'object' && flexLayout?.direction) ||
		'';
	const isParentFlexBlock = display === 'flex' || display === 'inline-flex';
	let parentFlexDirection = '';
	if (isParentFlexBlock) {
		parentFlexDirection = ['row', 'column'].includes(direction)
			? direction
			: 'row';
	}

	return {
		isParentFlexBlock,
		parentFlexDirection,
	};
}

/**
 * Gets the parent flex block information.
 *
 * @param {Object} block - The block object.
 * @param {string} block.clientId - The client ID of the block.
 * @param {string} block.blockName - The name of the block.
 * @param {string} block.currentBlock - The current block.
 * @param {string} block.currentState - The current state.
 * @param {string} block.currentInnerBlockState - The current inner block state.
 * @param {?HTMLElement} block.currentBlockElement - Optional. When provided, uses this element instead of querying.
 * @return {Object} The parent flex block information.
 * @property {boolean} isParentFlexBlock - True if the parent block is a flex block, false otherwise.
 * @property {string} parentFlexDirection - The direction of the parent flex block.
 */
export function getParentFlexBlockInfo(block: {
	clientId: string,
	blockName: string,
	currentBlock: string,
	currentState: string,
	currentInnerBlockState: string,
	currentBlockElement?: ?HTMLElement,
}): {
	isParentFlexBlock: boolean,
	parentFlexDirection: 'row' | 'column' | '',
} {
	let parentFlexBlock: boolean = false;
	let parentFlexBlockDirection: 'row' | 'column' | '' = '';

	const currentBlockElement: ?HTMLElement =
		block.currentBlockElement !== undefined
			? block.currentBlockElement
			: getEditorDocumentElement()?.querySelector(
					`#block-${block.clientId}`
				);

	function isPseudoElementState(state: string): boolean {
		return ['before', 'after', 'marker', 'placeholder'].includes(state);
	}

	if (currentBlockElement) {
		let parentElement;

		if (block.currentBlock === 'master') {
			// If the current state is a pseudo element state, use the current block element as parent element.
			if (isPseudoElementState(block.currentState)) {
				parentElement = currentBlockElement;
			} else {
				parentElement = currentBlockElement?.parentElement;
			}

			// If the parent element is a social link, use the parent element as parent element.
			// This is a workaround to get the parent element of the special blocks like social link.
			if (
				parentElement &&
				parentElement.classList.contains('wp-social-link')
			) {
				parentElement = parentElement.parentElement;
			}
		} else if (block.currentBlock !== 'master') {
			const currentBlockType = getBlockType(block.blockName);

			// Get the selector for the current inner block
			const currentInnerBlockSelector = prepareBlockCssSelector({
				query: `blockera/${block.currentBlock}`,
				selectors: currentBlockType.selectors,
				supports: currentBlockType.supports,
				blockName: block.blockName,
			});

			// Get the parent element of the current inner block.
			// It can be different than the master block element.
			if (currentInnerBlockSelector) {
				try {
					// If the current inner block state is a pseudo element state, use the current inner block element as parent element.
					if (isPseudoElementState(block.currentInnerBlockState)) {
						parentElement = currentBlockElement?.querySelector(
							currentInnerBlockSelector
						);
					} else {
						parentElement = currentBlockElement?.querySelector(
							currentInnerBlockSelector
						)?.parentElement;
					}
				} catch (error) {
					// Invalid selector, will fall back to master block element
					parentElement = null;
				}
			}

			// If the parent element is not found, use the master block as parent element.
			if (!parentElement) {
				parentElement = currentBlockElement;
			}
		}

		if (
			parentElement &&
			!parentElement.classList.contains('is-root-container')
		) {
			const parentStyle = window.getComputedStyle(parentElement, null);
			const displayValue = parentStyle.getPropertyValue('display');

			parentFlexBlock =
				displayValue === 'flex' || displayValue === 'inline-flex';

			if (parentFlexBlock) {
				const parentDirection =
					parentStyle.getPropertyValue('flex-direction');

				parentFlexBlockDirection = ['row', 'column'].includes(
					parentDirection
				)
					? parentDirection
					: 'row';
			}
		}
	}

	return {
		isParentFlexBlock: parentFlexBlock,
		parentFlexDirection: parentFlexBlockDirection,
	};
}

/**
 * Hook to get parent flex block info with correct recalculation when currentBreakpoint changes.
 * Uses attributes as primary source (breakpoint-accurate) and DOM as fallback.
 * Stores values in ref, recalculates when dependencies change.
 *
 * @param {Object} params - The block parameters.
 * @param {string} params.clientId - The client ID of the block.
 * @param {string} params.blockName - The name of the block.
 * @param {string} params.currentBlock - The current block.
 * @param {string} params.currentState - The current state.
 * @param {string} params.currentInnerBlockState - The current inner block state.
 * @param {string} params.currentBreakpoint - The current breakpoint (triggers recalculation when changed).
 * @return {Object} The parent flex block information.
 */
export function useParentFlexBlockInfo(params: {
	clientId: string,
	blockName: string,
	currentBlock: string,
	currentState: string,
	currentInnerBlockState: string,
	currentBreakpoint: string,
}): {
	isParentFlexBlock: boolean,
	parentFlexDirection: 'row' | 'column' | '',
} {
	const {
		clientId,
		blockName,
		currentBlock,
		currentState,
		currentInnerBlockState,
		currentBreakpoint,
	} = params;

	const infoRef = useRef({
		isParentFlexBlock: false,
		parentFlexDirection: '',
	});
	const [, setForceUpdate] = useState({});

	// Primary: get flex parent block attributes from store (breakpoint-accurate, no DOM timing)
	// For master block: parent for flex = block's parent in tree
	// For inner block: parent for flex = master block (DOM uses inner element's parent) OR block's parent
	// DOM logic: inner block uses inner element's parentElement = master block's content
	const flexParentAttributesFromStore = useSelect(
		(sel) => {
			try {
				const blockEditor = sel('core/block-editor');
				if (isInnerBlock(currentBlock)) {
					// Inner block: flex parent is the master block (contains the inner element)
					const block = blockEditor.getBlock(clientId);
					return block?.attributes ?? null;
				}
				// Master block: flex parent is the block's parent in tree
				const parentIds = blockEditor.getBlockParents(clientId);
				const parentId =
					parentIds.length > 0
						? parentIds[parentIds.length - 1]
						: null;
				if (!parentId) {
					return null;
				}
				const block = blockEditor.getBlock(parentId);
				return block?.attributes ?? null;
			} catch {
				return null;
			}
		},
		[clientId, currentBlock]
	);

	// Compute from attributes (primary) or DOM (fallback)
	const computeInfo = () => {
		const fromAttrs = getParentFlexBlockInfoFromAttributes(
			flexParentAttributesFromStore,
			currentBreakpoint
		);
		// Use attributes when we have flex parent (reliable for breakpoint)
		if (flexParentAttributesFromStore !== null) {
			return fromAttrs;
		}
		// Fallback: DOM-based when store doesn't have parent yet
		const currentBlockElement =
			getEditorDocumentElement()?.querySelector(`#block-${clientId}`) ??
			null;
		return getParentFlexBlockInfo({
			clientId,
			blockName,
			currentBlock,
			currentState,
			currentInnerBlockState,
			currentBlockElement,
		});
	};

	// Update ref during render (useSelect has run)
	infoRef.current = computeInfo();

	useEffect(() => {
		if (flexParentAttributesFromStore !== null) {
			// Attributes path: already correct from render
			return;
		}
		// DOM fallback: use double RAF to ensure DOM updated for breakpoint
		let rafId2;
		const rafId1 = requestAnimationFrame(() => {
			rafId2 = requestAnimationFrame(() => {
				const currentBlockElement =
					getEditorDocumentElement()?.querySelector(
						`#block-${clientId}`
					) ?? null;
				infoRef.current = getParentFlexBlockInfo({
					clientId,
					blockName,
					currentBlock,
					currentState,
					currentInnerBlockState,
					currentBlockElement,
				});
				setForceUpdate({});
			});
		});
		return () => {
			cancelAnimationFrame(rafId1);
			if (typeof rafId2 === 'number') {
				cancelAnimationFrame(rafId2);
			}
		};
	}, [
		clientId,
		blockName,
		currentBlock,
		currentState,
		currentInnerBlockState,
		currentBreakpoint,
		flexParentAttributesFromStore,
	]);

	return infoRef.current;
}
