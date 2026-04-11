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

export type ParentLayoutType = 'none' | 'flex' | 'grid';

export type ParentLayoutContext = {
	layout: ParentLayoutType,
	flexDirection: 'row' | 'column' | '',
};

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
 * Parent layout (flex vs grid) from block attributes — breakpoint-aware, no DOM.
 */
export function getParentLayoutContextFromAttributes(
	parentAttributes: ?Object,
	currentBreakpoint: string
): ParentLayoutContext {
	if (!parentAttributes) {
		return { layout: 'none', flexDirection: '' };
	}
	const breakpointAttrs =
		parentAttributes?.blockeraBlockStates?.value?.normal?.breakpoints?.[
			currentBreakpoint
		]?.attributes;
	const display =
		getDisplayValue(breakpointAttrs?.blockeraDisplay) ||
		getDisplayValue(parentAttributes.blockeraDisplay);

	if (display === 'flex' || display === 'inline-flex') {
		const flexLayout =
			breakpointAttrs?.blockeraFlexLayout ??
			parentAttributes.blockeraFlexLayout;
		const direction =
			(typeof flexLayout === 'object' && flexLayout?.value?.direction) ||
			(typeof flexLayout === 'object' && flexLayout?.direction) ||
			'';
		const flexDirection = ['row', 'column'].includes(direction)
			? direction
			: 'row';
		return { layout: 'flex', flexDirection };
	}

	if (display === 'grid' || display === 'inline-grid') {
		return { layout: 'grid', flexDirection: '' };
	}

	return { layout: 'none', flexDirection: '' };
}

function resolveParentElement(block: {
	clientId: string,
	blockName: string,
	currentBlock: string,
	currentState: string,
	currentInnerBlockState: string,
	currentBlockElement?: ?HTMLElement,
}): ?Element {
	const currentBlockElement: ?HTMLElement =
		block.currentBlockElement !== undefined
			? block.currentBlockElement
			: getEditorDocumentElement()?.querySelector(
					`#block-${block.clientId}`
				);

	function isPseudoElementState(state: string): boolean {
		return ['before', 'after', 'marker', 'placeholder'].includes(state);
	}

	if (!currentBlockElement) {
		return null;
	}

	let parentElement;

	if (block.currentBlock === 'master') {
		if (isPseudoElementState(block.currentState)) {
			parentElement = currentBlockElement;
		} else {
			parentElement = currentBlockElement?.parentElement;
		}

		if (
			parentElement &&
			parentElement.classList.contains('wp-social-link')
		) {
			parentElement = parentElement.parentElement;
		}
	} else if (block.currentBlock !== 'master') {
		const currentBlockType = getBlockType(block.blockName);

		const currentInnerBlockSelector = prepareBlockCssSelector({
			query: `blockera/${block.currentBlock}`,
			selectors: currentBlockType.selectors,
			supports: currentBlockType.supports,
			blockName: block.blockName,
		});

		if (currentInnerBlockSelector) {
			try {
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
				parentElement = null;
			}
		}

		if (!parentElement) {
			parentElement = currentBlockElement;
		}
	}

	if (
		!parentElement ||
		parentElement.classList.contains('is-root-container')
	) {
		return null;
	}

	return parentElement;
}

/**
 * Parent layout from computed styles on the same DOM parent element flex/grid detection used.
 */
export function getParentLayoutContext(block: {
	clientId: string,
	blockName: string,
	currentBlock: string,
	currentState: string,
	currentInnerBlockState: string,
	currentBlockElement?: ?HTMLElement,
}): ParentLayoutContext {
	const parentElement = resolveParentElement(block);

	if (!parentElement) {
		return { layout: 'none', flexDirection: '' };
	}

	const parentStyle = window.getComputedStyle(parentElement, null);
	const displayValue = parentStyle.getPropertyValue('display').trim();

	if (displayValue === 'flex' || displayValue === 'inline-flex') {
		const parentDirection = parentStyle
			.getPropertyValue('flex-direction')
			.trim();
		const flexDirection = ['row', 'column'].includes(parentDirection)
			? parentDirection
			: 'row';
		return { layout: 'flex', flexDirection };
	}

	if (displayValue === 'grid' || displayValue === 'inline-grid') {
		return { layout: 'grid', flexDirection: '' };
	}

	return { layout: 'none', flexDirection: '' };
}

/**
 * @deprecated Use getParentLayoutContext — retained for external callers.
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
	const ctx = getParentLayoutContext(block);
	return {
		isParentFlexBlock: ctx.layout === 'flex',
		parentFlexDirection: ctx.layout === 'flex' ? ctx.flexDirection : '',
	};
}

function selectLayoutParentAttributes(
	sel: Function,
	clientId: string,
	currentBlock: string
) {
	try {
		const blockEditor = sel('core/block-editor');
		if (isInnerBlock(currentBlock)) {
			const block = blockEditor.getBlock(clientId);
			return block?.attributes ?? null;
		}
		const parentIds = blockEditor.getBlockParents(clientId);
		const parentId =
			parentIds.length > 0 ? parentIds[parentIds.length - 1] : null;
		if (!parentId) {
			return null;
		}
		const block = blockEditor.getBlock(parentId);
		return block?.attributes ?? null;
	} catch {
		return null;
	}
}

/**
 * Hook: parent is flex or grid (breakpoint-aware attrs + DOM fallback).
 */
export function useParentLayoutContext(params: {
	clientId: string,
	blockName: string,
	currentBlock: string,
	currentState: string,
	currentInnerBlockState: string,
	currentBreakpoint: string,
}): ParentLayoutContext {
	const {
		clientId,
		blockName,
		currentBlock,
		currentState,
		currentInnerBlockState,
		currentBreakpoint,
	} = params;

	const infoRef = useRef<ParentLayoutContext>({
		layout: 'none',
		flexDirection: '',
	});
	const [, setForceUpdate] = useState({});

	const layoutParentAttributesFromStore = useSelect(
		(sel) => selectLayoutParentAttributes(sel, clientId, currentBlock),
		[clientId, currentBlock]
	);

	const computeInfo = (): ParentLayoutContext => {
		const fromAttrs = getParentLayoutContextFromAttributes(
			layoutParentAttributesFromStore,
			currentBreakpoint
		);
		if (layoutParentAttributesFromStore !== null) {
			return fromAttrs;
		}
		const currentBlockElement =
			getEditorDocumentElement()?.querySelector(`#block-${clientId}`) ??
			null;
		return getParentLayoutContext({
			clientId,
			blockName,
			currentBlock,
			currentState,
			currentInnerBlockState,
			currentBlockElement,
		});
	};

	infoRef.current = computeInfo();

	useEffect(() => {
		if (layoutParentAttributesFromStore !== null) {
			return;
		}
		let rafId2;
		const rafId1 = requestAnimationFrame(() => {
			rafId2 = requestAnimationFrame(() => {
				const currentBlockElement =
					getEditorDocumentElement()?.querySelector(
						`#block-${clientId}`
					) ?? null;
				infoRef.current = getParentLayoutContext({
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
		layoutParentAttributesFromStore,
	]);

	return infoRef.current;
}

/**
 * @deprecated Use useParentLayoutContext — retained for external callers.
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
	const ctx = useParentLayoutContext(params);
	return {
		isParentFlexBlock: ctx.layout === 'flex',
		parentFlexDirection: ctx.layout === 'flex' ? ctx.flexDirection : '',
	};
}
