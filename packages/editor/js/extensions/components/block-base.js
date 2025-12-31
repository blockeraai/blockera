// @flow

/**
 * External dependencies
 */
import { ErrorBoundary } from 'react-error-boundary';
import { SlotFillProvider, Fill } from '@wordpress/components';
import type { Element, ComponentType, MixedElement } from 'react';
import { select, useSelect, dispatch } from '@wordpress/data';
import { InspectorControls } from '@wordpress/block-editor';
import {
	useRef,
	useMemo,
	useState,
	useEffect,
	useCallback,
	// StrictMode,
} from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { useBlockFeatures } from '@blockera/features-core';
import { cloneObject, mergeObject, isEquals } from '@blockera/utils';
import { generalBlockFeatures } from '@blockera/blocks-core/js/libs/general-block-features';

/**
 * Internal dependencies
 */
import { BlockStyle, StylesWrapper } from '../../style-engine';
import { BlockEditContextProvider } from './';
import {
	// useIconEffect,
	useAttributes,
	useInnerBlocksInfo,
	useCalculateCurrentAttributes,
} from '../../hooks';
import { SideEffect } from '../libs/base';
// import { BlockPortals } from './block-portals';
import { BlockPartials } from './block-partials';
import { isInnerBlock } from './utils';
import { isBaseBreakpoint } from '../../canvas-editor';
import { sanitizeBlockAttributes } from '../hooks/utils';
import { BlockFillPartials } from './block-fill-partials';
import type { UpdateBlockEditorSettings } from '../libs/types';
import { ErrorBoundaryFallback } from '../hooks/block-settings';
import { useCleanupStyles } from '../../hooks/use-cleanup-styles';
import { isVirtualBlock } from '../libs/block-card/inner-blocks/utils';
import {
	unstableBootstrapBlockStatesDefinitions,
	unstableBootstrapInnerBlockStatesDefinitions,
} from '../libs/block-card/block-states/bootstrap';
import {
	generalBlockStates,
	generalInnerBlockStates,
} from '../libs/block-card/block-states/states';
import { getCompatibleAttributes } from './get-compatible-attributes';
import { getBlockCSSSelector } from '../../style-engine/get-block-css-selector';
import { useGlobalStylesPanelContext } from '../../canvas-editor/components/block-global-styles-panel-screen/context';

export const BlockBase: ComponentType<any> = (
	_props: Object
): Element<any> | null => {
	const { setCurrentBlockStyleVariation, handleOnChangeStyleInLocalState } =
		useGlobalStylesPanelContext();
	const {
		additional,
		children,
		name,
		clientId,
		attributes: blockAttributes,
		setAttributes: setBlockAttributes,
		defaultAttributes,
		originDefaultAttributes,
		insideBlockInspector = true,
		...props
	} = _props;

	const [notice, setNotice] = useState(null);
	const [isReportingErrorCompleted, setIsReportingErrorCompleted] =
		useState(false);
	const [currentTab, setCurrentTab] = useState(
		additional?.activeTab || 'style'
	);

	const {
		currentBlock,
		currentState,
		currentBreakpoint,
		getBlockExtensionBy,
		currentInnerBlockState,
		getDeviceType,
		supports,
		selectors,
		blockVariations,
		availableAttributes,
		activeBlockVariation,
		getActiveBlockVariation,
	} = useSelect((select) => {
		const {
			getBlockExtensionBy,
			getActiveInnerState,
			getActiveMasterState,
			getExtensionCurrentBlock,
			getExtensionCurrentBlockStateBreakpoint,
		} = select('blockera/extensions');

		const currentBlock = getExtensionCurrentBlock();

		////

		const { getActiveBlockVariation: _getActiveBlockVariation } = select(
			'blockera/extensions'
		);
		const { getBlockType, getActiveBlockVariation, getBlockVariations } =
			select('core/blocks');
		const { getBlockAttributes } = select('core/block-editor');
		const {
			supports,
			selectors,
			attributes: availableAttributes,
		} = getBlockType(name);

		const { getDeviceType } = select('blockera/editor');

		return {
			getDeviceType,
			currentBlock,
			getBlockExtensionBy,
			currentState: getActiveMasterState(clientId, name),
			currentBreakpoint: getExtensionCurrentBlockStateBreakpoint(),
			currentInnerBlockState: getActiveInnerState(clientId, currentBlock),
			supports,
			selectors,
			availableAttributes,
			getActiveBlockVariation,
			activeBlockVariation: getActiveBlockVariation(
				name,
				getBlockAttributes(clientId) || {}
			),
			blockVariations: name && getBlockVariations(name, 'transform'),
			activeVariation: _getActiveBlockVariation(),
		};
	});

	const [isActive, setActive] = useState(true);

	const {
		changeExtensionCurrentBlock: setCurrentBlock,
		changeExtensionCurrentBlockState: setCurrentState,
		changeExtensionInnerBlockState: setInnerBlockState,
	} = dispatch('blockera/extensions') || {};

	const masterIsNormalState = useCallback(
		(): boolean =>
			'normal' === currentState && isBaseBreakpoint(getDeviceType()),
		[currentState, getDeviceType]
	);

	const isNormalState = useCallback((): boolean => {
		if (isInnerBlock(currentBlock)) {
			return (
				'normal' === currentInnerBlockState &&
				isBaseBreakpoint(getDeviceType())
			);
		}

		return masterIsNormalState();
	}, [
		currentBlock,
		currentInnerBlockState,
		getDeviceType,
		masterIsNormalState,
	]);

	const args = useMemo(
		() => ({
			blockId: name,
			blockClientId: clientId,
			isMasterNormalState: masterIsNormalState(),
			isNormalState: isNormalState(),
			isMasterBlock: !isInnerBlock(currentBlock),
			isBaseBreakpoint: isBaseBreakpoint(currentBreakpoint),
			currentBreakpoint,
			currentBlock,
			currentState: isInnerBlock(currentBlock)
				? currentInnerBlockState
				: currentState,
			blockVariations,
			activeBlockVariation,
			getActiveBlockVariation,
			blockAttributes: originDefaultAttributes,
			innerBlocks: additional?.blockeraInnerBlocks,
		}),
		[
			name,
			clientId,
			currentBlock,
			currentState,
			isNormalState,
			blockVariations,
			currentBreakpoint,
			masterIsNormalState,
			activeBlockVariation,
			currentInnerBlockState,
			getActiveBlockVariation,
			originDefaultAttributes,
			additional?.blockeraInnerBlocks,
		]
	);

	const compatibleAttributes = useMemo(
		() =>
			getCompatibleAttributes({
				args,
				isActive,
				availableAttributes,
				attributes: cloneObject(blockAttributes),
				defaultAttributes: originDefaultAttributes,
			}),
		[
			args,
			isActive,
			availableAttributes,
			blockAttributes,
			originDefaultAttributes,
		]
	);

	const attributesRef = useRef(compatibleAttributes);
	const [attributes, setState] = useState(compatibleAttributes);

	/**
	 * Set the attributes state and the attributes ref.
	 *
	 * @param {Object} value the compatible attributes arrived from the handleOnChangeAttributes function.
	 */
	const setAttributes = (value: any) => {
		attributesRef.current = value;
		setState(value);
	};

	// Update the parent state after 1 second to avoid unnecessary re-renders.
	useEffect(() => {
		if (
			'function' === typeof handleOnChangeStyleInLocalState &&
			!isEquals(blockAttributes, attributes) &&
			isEquals(attributes, attributesRef.current) &&
			false === insideBlockInspector
		) {
			// It just will be called if outside of the block inspector. (See: canvas-editor/components/block-global-styles-panel-screen/context.js)
			handleOnChangeStyleInLocalState(attributes);
		}

		const timeoutId = setTimeout(() => {
			// Compare the block attributes with the attributes and the attributes ref.
			// If they are not equal, set the attributes to the block attributes.
			if (
				!isEquals(blockAttributes, attributes) &&
				isEquals(attributes, attributesRef.current)
			) {
				setBlockAttributes(attributes);
			}
		}, 1000); // Update the parent state after 1 second to avoid unnecessary re-renders.

		return () => clearTimeout(timeoutId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [attributes, attributesRef]);

	useEffect(() => {
		// Compare the compatible attributes with the attributes and the attributes ref.
		// If they are not equal, set the attributes to the compatible attributes.
		if (
			!isEquals(compatibleAttributes, attributes) &&
			!isEquals(compatibleAttributes, attributesRef.current)
		) {
			setAttributes(compatibleAttributes);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [compatibleAttributes]);

	const { className } = attributes;

	const sanitizedAttributes = useMemo(
		() => sanitizeBlockAttributes(cloneObject(attributes)),
		[attributes]
	);

	const { currentInnerBlock, blockeraInnerBlocks } = useInnerBlocksInfo({
		additional,
		currentBlock,
		currentState,
		currentBreakpoint,
		defaultAttributes,
		currentInnerBlockState,
		attributes: sanitizedAttributes,
	});

	const { edit: BlockEditComponent } = additional;

	const getAttributes = (key: string = ''): any => {
		if (key && sanitizedAttributes[key]) {
			return sanitizedAttributes[key];
		}

		return sanitizedAttributes;
	};

	const { handleOnChangeAttributes } = useAttributes(setAttributes, {
		clientId,
		className,
		blockId: name,
		isNormalState,
		currentBlock,
		currentState,
		blockVariations,
		defaultAttributes,
		currentBreakpoint,
		availableAttributes,
		masterIsNormalState,
		blockeraInnerBlocks,
		insideBlockInspector,
		activeBlockVariation,
		currentInnerBlockState,
		getActiveBlockVariation,
		getAttributes: () => attributes,
		innerBlocks: additional?.blockeraInnerBlocks,
	});

	const updateBlockEditorSettings: UpdateBlockEditorSettings = useCallback(
		(key: string, value: any): void => {
			switch (key) {
				case 'current-block':
					setCurrentBlock(value);
					break;
				case 'current-state':
					if (isInnerBlock(currentBlock)) {
						return setInnerBlockState(value);
					}

					setCurrentState(value);
					break;
				case 'current-block-style-variation':
					setCurrentBlockStyleVariation(value);
					break;
			}
		},
		[
			currentBlock,
			setCurrentBlock,
			setCurrentState,
			setInnerBlockState,
			setCurrentBlockStyleVariation,
		]
	);

	const currentAttributes = useCalculateCurrentAttributes({
		currentBlock,
		currentState,
		currentBreakpoint,
		currentInnerBlock,
		blockeraInnerBlocks,
		attributes: sanitizedAttributes,
		blockAttributes: defaultAttributes,
	});

	// Boot loading the block features.
	const { BlockFeaturesInlineStyles, ContextualToolbarComponents } =
		useBlockFeatures({
			name,
			clientId,
			attributes: currentAttributes,
			blockFeatures: mergeObject(
				generalBlockFeatures,
				additional?.blockFeatures
			),
			getBlockCSSSelector,
		});

	const inlineStyles = useCleanupStyles({ clientId }, [name, attributes]);

	const availableStates =
		additional?.availableBlockStates || generalBlockStates;
	const availableInnerStates = useMemo(() => {
		let blockStates =
			((additional?.blockeraInnerBlocks || {})[currentBlock] || {})
				?.availableBlockStates || generalInnerBlockStates;

		if (isInnerBlock(currentBlock)) {
			if (!isVirtualBlock(currentBlock)) {
				const { availableBlockStates } =
					getBlockExtensionBy('targetBlock', currentBlock) || {};

				if (Object.keys(availableBlockStates || {}).length) {
					blockStates = availableBlockStates;
				}
			}
		}

		return blockStates;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentBlock, additional]);

	useEffect(() => {
		if (isInnerBlock(currentBlock)) {
			unstableBootstrapInnerBlockStatesDefinitions(availableInnerStates);
		} else {
			unstableBootstrapBlockStatesDefinitions(availableStates);
		}
	}, [currentBlock, availableStates, availableInnerStates]);

	const blockStyleProps = {
		clientId,
		supports,
		selectors,
		additional,
		inlineStyles,
		attributes: sanitizedAttributes,
		blockName: name,
		currentAttributes,
		defaultAttributes,
		customCss: attributes?.blockeraCustomCSS?.value
			?.replace(/(\.|#)block/gi, `#block-${clientId}`)
			?.replace(/&/gi, `#block-${clientId}`),
		activeDeviceType: getDeviceType(),
	};

	return (
		<BlockEditContextProvider
			{...{
				block: {
					blockName: name,
					clientId,
					handleOnChangeAttributes,
					attributes: currentAttributes,
					storeName: 'blockera/controls',
				},
				currentTab,
				currentBlock,
				currentState,
				setCurrentTab,
				isNormalState,
				setAttributes,
				getAttributes,
				currentBreakpoint,
				defaultAttributes,
				currentInnerBlock,
				masterIsNormalState,
				blockeraInnerBlocks,
				currentInnerBlockState,
				handleOnChangeAttributes,
				updateBlockEditorSettings,
				BlockComponent: () => children,
				attributes: sanitizedAttributes,
				activeDeviceType: getDeviceType(),
				getBlockType: () => select('core/blocks').getBlockType(name),
			}}
		>
			{/*<StrictMode>*/}
			{insideBlockInspector && (
				<InspectorControls>
					<SideEffect
						{...{
							activeBlockVariation:
								activeBlockVariation?.name || '',
							blockName: name,
							currentBlock,
							currentTab,
							currentState: isInnerBlock(currentBlock)
								? currentInnerBlockState
								: currentState,
							isActive,
						}}
					/>
					<SlotFillProvider>
						<BlockPartials clientId={clientId} />
						<BlockFillPartials
							{...{
								notice,
								clientId,
								isActive,
								setActive,
								currentState,
								currentBlock,
								availableStates,
								currentInnerBlock,
								currentBreakpoint,
								BlockEditComponent,
								blockeraInnerBlocks,
								availableInnerStates,
								insideBlockInspector,
								currentInnerBlockState,
								updateBlockEditorSettings,
								blockProps: {
									// Sending props like exactly "edit" function props of WordPress Block.
									// Because needs total block props in outside overriding component like "blockera" in overriding process.
									name,
									activeBlockVariation:
										activeBlockVariation?.name || '',
									clientId,
									supports,
									className,
									attributes: sanitizedAttributes,
									setAttributes,
									defaultAttributes,
									currentAttributes,
									currentTab,
									currentBlock,
									currentState,
									setCurrentTab,
									currentBreakpoint,
									blockeraInnerBlocks,
									currentInnerBlockState,
									handleOnChangeAttributes,
									additional,
									currentStateAttributes: currentAttributes,
									...props,
								},
							}}
						/>
					</SlotFillProvider>
				</InspectorControls>
			)}

			{!insideBlockInspector && (
				<SlotFillProvider>
					<BlockPartials clientId={clientId} />
					<BlockFillPartials
						{...{
							notice,
							clientId,
							isActive,
							setActive,
							currentState,
							currentBlock,
							availableStates,
							currentInnerBlock,
							currentBreakpoint,
							BlockEditComponent,
							blockeraInnerBlocks,
							availableInnerStates,
							insideBlockInspector,
							currentInnerBlockState,
							updateBlockEditorSettings,
							blockProps: {
								// Sending props like exactly "edit" function props of WordPress Block.
								// Because needs total block props in outside overriding component like "blockera" in overriding process.
								name,
								activeBlockVariation:
									activeBlockVariation?.name || '',
								clientId,
								supports,
								className,
								attributes: sanitizedAttributes,
								setAttributes,
								defaultAttributes,
								currentAttributes,
								currentTab,
								currentBlock,
								currentState,
								setCurrentTab,
								currentBreakpoint,
								blockeraInnerBlocks,
								currentInnerBlockState,
								handleOnChangeAttributes,
								additional,
								currentStateAttributes: currentAttributes,
								...props,
							},
						}}
					/>
				</SlotFillProvider>
			)}

			{insideBlockInspector && (
				<>
					<ErrorBoundary
						fallbackRender={({ error }): MixedElement => (
							<ErrorBoundaryFallback
								{...{
									error,
									notice,
									clientId,
									setNotice,
									from: 'style-wrapper',
									props: blockStyleProps,
									isReportingErrorCompleted,
									setIsReportingErrorCompleted,
									fallbackComponent: BlockStyle,
								}}
							/>
						)}
					>
						<StylesWrapper clientId={clientId}>
							<Fill name={'blockera-styles-wrapper-' + clientId}>
								<BlockStyle {...blockStyleProps} />
							</Fill>
						</StylesWrapper>
					</ErrorBoundary>
					{/*</StrictMode>*/}

					<ContextualToolbarComponents />

					<BlockFeaturesInlineStyles
						clientId={clientId}
						className={className}
						currentAttributes={currentAttributes}
					/>

					{children}
				</>
			)}
		</BlockEditContextProvider>
	);
};
