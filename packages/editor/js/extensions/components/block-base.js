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
import { isVirtualBlock } from '../libs/block-card/inner-blocks/helpers';
import {
	unstableBootstrapBlockStatesDefinitions,
	unstableBootstrapInnerBlockStatesDefinitions,
} from '../libs/block-card/block-states/bootstrap';
import {
	generalBlockStates,
	generalInnerBlockStates,
} from '../libs/block-card/block-states/states';
import { getBlockCSSSelector } from '../../style-engine/get-block-css-selector';
import { useBlockCompatibilities } from '../../hooks/use-block-compatibilities';
import { useGlobalStylesPanelContext } from '../../canvas-editor/components/block-global-styles-panel-screen/context';

export const BlockBase: ComponentType<any> = (
	_props: Object
): Element<any> | null => {
	const { setCurrentBlockStyleVariation } = useGlobalStylesPanelContext() || {
		setCurrentBlockStyleVariation: () => {},
	};
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

	const args = {
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
	};

	const initializedAttributes = useBlockCompatibilities({
		args,
		isActive,
		availableAttributes,
		attributes: blockAttributes,
		defaultAttributes: originDefaultAttributes,
	});

	const [attributes, setAttributes] = useState(initializedAttributes);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (!isEquals(attributes, initializedAttributes)) {
				setBlockAttributes(attributes);
			}
		}, 100);

		return () => clearTimeout(timeoutId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [attributes]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (
				!isEquals(initializedAttributes, attributes) &&
				insideBlockInspector
			) {
				setAttributes(initializedAttributes);
			}
		}, 100);

		return () => clearTimeout(timeoutId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initializedAttributes, insideBlockInspector]);

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
		...(insideBlockInspector
			? { getAttributes }
			: { getAttributes: () => attributes }),
		currentBlock,
		currentState,
		blockVariations,
		defaultAttributes,
		currentBreakpoint,
		availableAttributes,
		masterIsNormalState,
		blockeraInnerBlocks,
		activeBlockVariation,
		currentInnerBlockState,
		getActiveBlockVariation,
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
		customCss: attributes?.blockeraCustomCSS?.value?.replace(
			/(\.|#)block/gi,
			`#block-${clientId}`
		),
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
						<BlockPartials
							blockId={name}
							clientId={clientId}
							isActive={isActive}
							setActive={setActive}
						/>
						<BlockFillPartials
							{...{
								notice,
								clientId,
								isActive,
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
					<BlockPartials
						blockId={name}
						clientId={clientId}
						isActive={isActive}
						setActive={setActive}
					/>
					<BlockFillPartials
						{...{
							notice,
							clientId,
							isActive,
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
