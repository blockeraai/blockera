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
	createContext,
	useContext,
	useRef,
	useMemo,
	useState,
	useEffect,
	useCallback,
	memo,
	// StrictMode,
} from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	BaseControlContext,
	BlockInjectedSlotContext,
	PresetCanvasPreviewContext,
	PreviewInjectableStylesContext,
} from '@blockera/controls';
import { useBlockFeatures } from '@blockera/features-core';
import { isEquals, cloneObject, mergeObject } from '@blockera/utils';
import { classNames } from '@blockera/classnames';
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
	useBlockStyleVariations,
	useCalculateCurrentAttributes,
} from '../../hooks';
import { isInnerBlock } from './utils';
import { isBaseBreakpoint } from '../..';
import { SideEffect } from '../libs/base';
import { BlockPartials } from './block-partials';
import { sanitizeBlockAttributes } from '../hooks/utils';
import { BlockFillPartials } from './block-fill-partials';
import type { UpdateBlockEditorSettings } from '../libs/types';
import { ErrorBoundaryFallback } from '../hooks/block-settings';
import { getAttributesWithIds } from '../../hooks/use-attributes';
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
import { useGlobalStylesPanelContext } from '../../editor/global-styles/panel/context';
import {
	EditorFeatureWrapper,
	EditorAdvancedLabelControl,
} from '../../components';
import {
	registerClassName,
	isClassNameDuplicate,
	generateUniqueClassName,
	unregisterClassName,
	hasRegisteredClassName,
	removeRegisteredClassName,
	getBlocksClassNamesFromStore,
	BLOCKERA_BLOCK_REGEX,
} from './registered-classnames';

const BLOCKERA_DELAY_EXPECTED_TIME = 1000;

const GlobalStylesPanelBaseControlConfigContext: Object = createContext({
	name: '',
	clientId: '',
	getAttributes: () => ({}),
});

const GlobalStylesFeatureWrapper = memo((props: Object): MixedElement => {
	const { name, clientId } = useContext(
		GlobalStylesPanelBaseControlConfigContext
	);
	return <EditorFeatureWrapper {...props} name={name} clientId={clientId} />;
});

const GlobalStylesAdvancedLabelControl = memo((props: Object): MixedElement => {
	const { getAttributesRef, clientId } = useContext(
		GlobalStylesPanelBaseControlConfigContext
	);
	return (
		<EditorAdvancedLabelControl
			{...props}
			inGlobalStylesPanel={true}
			getAttributesRef={getAttributesRef}
			clientId={clientId}
		/>
	);
});

const GLOBAL_STYLES_BASE_CONTROL_COMPONENTS = {
	FeatureWrapper: GlobalStylesFeatureWrapper,
	AdvancedLabelControl: GlobalStylesAdvancedLabelControl,
};

export const BlockBase: ComponentType<any> = (
	_props: Object
): Element<any> | null => {
	const {
		currentBlockStyleVariation,
		setCurrentBlockStyleVariation,
		handleOnChangeStyleInLocalState,
	} = useGlobalStylesPanelContext();
	const {
		name,
		clientId,
		children,
		isSelected,
		additional,
		defaultAttributes,
		originDefaultAttributes,
		attributes: blockAttributes,
		insideBlockInspector = true,
		setAttributes: setBlockAttributes,
		...props
	} = _props;

	const [notice, setNotice] = useState(null);
	const [extraPreviewCss, setExtraPreviewCss] = useState('');
	const [presetPreviewAttributePatch, setPresetPreviewAttributePatch] =
		useState(null);
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
		editorSelectedBlockEvent,
		supports,
		selectors,
		blockVariations,
		availableAttributes,
		activeBlockVariation,
		getActiveBlockVariation,
	} = useSelect(
		(select) => {
			const {
				getBlockExtensionBy,
				getActiveInnerState,
				getActiveMasterState,
				getExtensionCurrentBlock,
				getExtensionCurrentBlockStateBreakpoint,
			} = select('blockera/extensions');

			const currentBlock = getExtensionCurrentBlock();

			////

			const { getActiveBlockVariation: _getActiveBlockVariation } =
				select('blockera/extensions');
			const {
				getBlockType,
				getActiveBlockVariation,
				getBlockVariations,
			} = select('core/blocks');
			const { getBlockAttributes } = select('core/block-editor');
			const {
				supports,
				selectors,
				attributes: availableAttributes,
			} = getBlockType(name);

			const { getDeviceType, getEditorSelectedBlockEvent } =
				select('blockera/editor');

			return {
				getDeviceType,
				currentBlock,
				getBlockExtensionBy,
				currentState: getActiveMasterState(clientId, name),
				currentBreakpoint: getExtensionCurrentBlockStateBreakpoint(),
				currentInnerBlockState: getActiveInnerState(
					clientId,
					currentBlock
				),
				supports,
				selectors,
				availableAttributes,
				getActiveBlockVariation,
				editorSelectedBlockEvent: getEditorSelectedBlockEvent(),
				activeBlockVariation: getActiveBlockVariation(
					name,
					getBlockAttributes(clientId) || {}
				),
				blockVariations: name && getBlockVariations(name, 'transform'),
				activeVariation: _getActiveBlockVariation(),
			};
		},
		[clientId, name]
	);

	// Stable getter for blockera class names from all blocks' attributes (for duplicate detection).
	// Uses select() on demand instead of useSelect to avoid subscribing to block-editor store
	// and triggering re-renders on every block change.
	const getBlocksClassNames = useCallback(() => {
		const blockEditor = select('core/block-editor');
		return getBlocksClassNamesFromStore(
			() => blockEditor.getBlocks(),
			(id) => blockEditor.getBlockAttributes(id) || {}
		);
	}, []);

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
			insideBlockInspector,
			editorSelectedBlockEvent,
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
			insideBlockInspector,
			currentInnerBlockState,
			getActiveBlockVariation,
			originDefaultAttributes,
			editorSelectedBlockEvent,
			additional?.blockeraInnerBlocks,
		]
	);

	// Store the unique classname for this block instance.
	// Generate it once on mount using useMemo (runs during render, memoized by clientId).
	const uniqueClassName = useMemo(() => {
		const blocksClassNames = getBlocksClassNames();
		return generateUniqueClassName(
			clientId,
			blockAttributes?.className,
			blocksClassNames
		);
	}, [clientId, blockAttributes?.className, getBlocksClassNames]);

	// Track if this is the first calculation to ensure unique classname on mount
	const isFirstCalculationRef = useRef(true);
	const previousClientIdRef = useRef(clientId);
	const compatibleAttributesRef = useRef(null);

	// Reset first calculation flag when clientId changes (e.g., block copied)
	if (previousClientIdRef.current !== clientId) {
		isFirstCalculationRef.current = true;
		previousClientIdRef.current = clientId;
	}

	// Cleanup: unregister the classname when component unmounts.
	useEffect(() => {
		return () => {
			if (uniqueClassName) {
				unregisterClassName(clientId, uniqueClassName);
			}
		};
	}, [clientId, uniqueClassName]);

	const compatibleAttributes = useMemo(() => {
		// Run compatibility filters...
		const compatibleAttributes = getCompatibleAttributes({
			args,
			isActive,
			availableAttributes,
			attributes: cloneObject(blockAttributes),
			defaultAttributes: originDefaultAttributes,
		});

		const classNameStr = compatibleAttributes?.className || '';
		const isFirstCalculation = isFirstCalculationRef.current;

		// On first calculation (mount), ensure unique classname is properly set
		if (isFirstCalculation) {
			// Update the first calculation flag to false before the calculation.
			isFirstCalculationRef.current = false;

			// Extract existing blockera-block classnames from className
			const classNameParts = classNameStr.split(/\s+/).filter(Boolean);
			let generatedClassname = '';

			classNameParts.forEach((part) => {
				if (BLOCKERA_BLOCK_REGEX.test(part)) {
					if (hasRegisteredClassName(part)) {
						// Only unregister if it's not the unique classname for this block.
						removeRegisteredClassName(part);
						generatedClassname += !generatedClassname
							? uniqueClassName
							: ` ${uniqueClassName}`;
					} else {
						// Add the classname to the new classname if it's not registered.
						generatedClassname += !generatedClassname
							? part
							: ` ${part}`;
					}
				} else {
					// Add the classname to the new classname if it's not a blockera-block classname.
					generatedClassname += !generatedClassname
						? part
						: ` ${part}`;
				}
			});

			// If block default classname is empty.
			if (!generatedClassname) {
				return {
					...compatibleAttributes,
					className: classNames('blockera-block', {
						[uniqueClassName]: true,
					}),
				};
			}

			return {
				...compatibleAttributes,
				// Build the new className with unique classname and other classes
				className:
					-1 === generatedClassname.indexOf('blockera-block ')
						? `blockera-block ${generatedClassname}`
						: generatedClassname,
			};
		} else if (!classNameStr.match(BLOCKERA_BLOCK_REGEX)?.[0]) {
			return {
				...compatibleAttributes,
				className: classNameStr
					? `${classNameStr} blockera-block ${uniqueClassName}`
					: `blockera-block ${uniqueClassName}`,
			};
		}

		return compatibleAttributes;
	}, [
		args,
		isActive,
		blockAttributes,
		uniqueClassName,
		availableAttributes,
		originDefaultAttributes,
	]);

	// Single source of truth: compatibleAttributes (derived from blockAttributes).
	// pendingAttributes is only set during user edits; cleared when derived value updates.
	const [pendingAttributes, setPendingAttributes] =
		useState(compatibleAttributes);
	const attributes = pendingAttributes ?? compatibleAttributes;
	const { className } = attributes;

	/**
	 * Set the attributes state and the attributes ref.
	 *
	 * @param {Object} value the compatible attributes arrived from the handleOnChangeAttributes function.
	 * @param {boolean} shouldUpdateClassName whether to update the classname. useful when save all customizing style variation.
	 *
	 * @return {void}
	 */
	const setAttributes = (
		value: any,
		{
			ref,
			shouldUpdateClassName = true,
		}: {
			ref?: Object,
			shouldUpdateClassName?: boolean,
		} = {
			shouldUpdateClassName: true,
		}
	) => {
		const valueToStore = cloneObject(value);
		const classNameStr = valueToStore.className ?? '';
		const match = BLOCKERA_BLOCK_REGEX.exec(classNameStr);

		// We should update classname with unique generate classname while customizing style variation.
		if (
			shouldUpdateClassName &&
			/^is-style-.*/g.test(classNameStr) &&
			!/\s/g.test(classNameStr)
		) {
			valueToStore.className = classNames(classNameStr, {
				'blockera-block': true,
				[uniqueClassName]: true,
			});
			registerClassName(clientId, uniqueClassName);
		} else if (
			shouldUpdateClassName &&
			match &&
			isClassNameDuplicate(clientId, match[0], getBlocksClassNames())
		) {
			const prevClassName = classNameStr
				.replace(BLOCKERA_BLOCK_REGEX, '')
				.replace(/\bblockera-block\b/gi, '');
			valueToStore.className = classNames(prevClassName.trim(), {
				'blockera-block': true,
				[uniqueClassName]: true,
			});

			registerClassName(clientId, uniqueClassName);
		} else if (match && shouldUpdateClassName) {
			registerClassName(clientId, match[0]);
		}

		if (
			!['save-customizations', 'detach-style'].includes(
				ref?.current?.action
			)
		) {
			// Reset the editor selected block event to undefined.
			dispatch('blockera/editor').setEditorSelectedBlockEvent(undefined);
		}

		// Sync with the new value for attributes state.
		compatibleAttributesRef.current = valueToStore;

		setPendingAttributes(valueToStore);
	};

	// Debounce updates to parent state to avoid unnecessary re-renders.
	useEffect(() => {
		// Skip the effect if the block is not a blockera block and not has metadata.
		if (
			!attributes?.blockeraPropsId &&
			!attributes.hasOwnProperty('metadata') &&
			!['save-customizations', 'detach-style', 'disable-style'].includes(
				editorSelectedBlockEvent
			)
		) {
			return;
		}

		// TODO: In the future, review all custom hooks and child components used in this block
		// to determine which ones might alter the original `attributes` object reference directly.
		// This helps ensure that updates to `attributes` remain predictable, and mutation side-effects
		// are properly managed or avoided (consider use of cloneObject as needed).
		const clonedAttributes = cloneObject(attributes);

		if (
			'function' === typeof handleOnChangeStyleInLocalState &&
			!isEquals(compatibleAttributes, attributes) &&
			false === insideBlockInspector
		) {
			// It just will be called if outside of the block inspector. (See: canvas-editor/components/block-global-styles-panel-screen/context.js)
			handleOnChangeStyleInLocalState(clonedAttributes);
		}

		// If inside the block inspector, update the parent state immediately.
		if (insideBlockInspector) {
			// Compare the block attributes with the attributes and the attributes ref.
			// If they are not equal, set the attributes to the block attributes.
			if (!isEquals(compatibleAttributes, attributes)) {
				setBlockAttributes(clonedAttributes);
			}

			return;
		}

		const timeoutId = setTimeout(() => {
			// Compare the block attributes with the attributes and the attributes ref.
			// If they are not equal, set the attributes to the block attributes.
			if (!isEquals(compatibleAttributes, attributes)) {
				setBlockAttributes(clonedAttributes);
			}
		}, BLOCKERA_DELAY_EXPECTED_TIME); // Update the parent state after BLOCKERA_DELAY_EXPECTED_TIME to avoid unnecessary re-renders.

		return () => clearTimeout(timeoutId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [attributes]);

	// When derived value (compatibleAttributes) changes, clear pending overlay.
	// This adopts the single source of truth and prevents bidirectional sync.
	useEffect(() => {
		if (isInnerBlock(currentBlock)) {
			return;
		}
		if (
			false === insideBlockInspector &&
			!currentBlockStyleVariation?.name
		) {
			return;
		}
		if (
			pendingAttributes !== null &&
			isEquals(pendingAttributes, compatibleAttributes)
		) {
			setPendingAttributes(null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [compatibleAttributes]);

	// When the current block style variation changes,
	// clear the pending attributes just when outside of the block inspector.
	useEffect(() => {
		if (
			null !== pendingAttributes &&
			false === insideBlockInspector &&
			currentBlockStyleVariation?.hasOwnProperty('name')
		) {
			setPendingAttributes(null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentBlockStyleVariation]);

	const sanitizedAttributes = useMemo(
		// TODO: In the future, review all custom hooks and child components used in this block
		// to determine which ones might alter the original `attributes` object reference directly.
		// This helps ensure that updates to `attributes` remain predictable, and mutation side-effects
		// are properly managed or avoided (consider use of cloneObject as needed).
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

	const blockStyleVariationsProps = useBlockStyleVariations({
		clientId,
		blockName: name,
		// TODO: In the future, review all custom hooks and child components used in this block
		// to determine which ones might alter the original `attributes` object reference directly.
		// This helps ensure that updates to `attributes` remain predictable, and mutation side-effects
		// are properly managed or avoided (consider use of cloneObject as needed).
		storedAttributes: cloneObject(attributes),
		defaultAttributes: availableAttributes,
		inGlobalStylesPanel: !insideBlockInspector,
	});

	const { handleOnChangeAttributes } = useAttributes(setAttributes, {
		clientId,
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
		// TODO: In the future, review all custom hooks and child components used in this block
		// to determine which ones might alter the original `attributes` object reference directly.
		// This helps ensure that updates to `attributes` remain predictable, and mutation side-effects
		// are properly managed or avoided (consider use of cloneObject as needed).
		getAttributes: () => cloneObject(attributes),
		innerBlocks: additional?.blockeraInnerBlocks,
		setChangesets: isSelected
			? blockStyleVariationsProps.setChangesets
			: () => {},
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

	const previewInjectableStylesValue = useMemo(
		() =>
			insideBlockInspector
				? {
						extraPreviewCss,
						setExtraPreviewCss,
					}
				: null,
		[insideBlockInspector, extraPreviewCss]
	);

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

	const activeDeviceType = getDeviceType();

	const primePresetHover = useCallback(() => {
		const hasBlockeraPropsId = Boolean(blockAttributes?.blockeraPropsId);
		const classNameEmpty =
			!blockAttributes?.className ||
			String(blockAttributes.className).trim() === '';

		if (hasBlockeraPropsId && !classNameEmpty) {
			return;
		}

		const partial: Object = {};

		if (!hasBlockeraPropsId) {
			const withId = getAttributesWithIds(
				cloneObject(blockAttributes),
				'blockeraPropsId',
				false
			);
			if (withId.blockeraPropsId) {
				partial.blockeraPropsId = withId.blockeraPropsId;
			}
		}

		if (classNameEmpty && uniqueClassName) {
			partial.className = classNames('blockera-block', {
				[uniqueClassName]: true,
			});
			registerClassName(clientId, uniqueClassName);
		}

		if (Object.keys(partial).length) {
			setBlockAttributes(partial);
		}
	}, [blockAttributes, setBlockAttributes, uniqueClassName, clientId]);

	const presetCanvasPreviewValue = useMemo(
		() => ({
			setPreviewAttributePatch: setPresetPreviewAttributePatch,
			primePresetHover,
		}),
		[primePresetHover]
	);

	const blockStyleProps = useMemo(() => {
		const hasPresetPreviewPatch =
			presetPreviewAttributePatch &&
			Object.keys(presetPreviewAttributePatch).length > 0;

		const mergedAttributes = hasPresetPreviewPatch
			? mergeObject(
					cloneObject(sanitizedAttributes),
					presetPreviewAttributePatch
				)
			: sanitizedAttributes;
		const mergedCurrentAttributes = hasPresetPreviewPatch
			? mergeObject(
					cloneObject(currentAttributes),
					presetPreviewAttributePatch
				)
			: currentAttributes;

		return {
			clientId,
			supports,
			selectors,
			additional,
			inlineStyles,
			attributes: mergedAttributes,
			blockName: name,
			currentAttributes: mergedCurrentAttributes,
			defaultAttributes,
			customCss: attributes?.blockeraCustomCSS?.value
				?.replace(/(\.|#)block/gi, `#block-${clientId}`)
				?.replace(/&/gi, `#block-${clientId}`),
			activeDeviceType,
		};
	}, [
		presetPreviewAttributePatch,
		sanitizedAttributes,
		currentAttributes,
		clientId,
		supports,
		selectors,
		additional,
		inlineStyles,
		name,
		defaultAttributes,
		attributes?.blockeraCustomCSS?.value,
		activeDeviceType,
	]);

	return (
		<BlockEditContextProvider
			{...{
				args,
				isActive,
				block: {
					blockName: name,
					clientId,
					handleOnChangeAttributes,
					attributes: currentAttributes,
					storeName: 'blockera/controls',
				},
				currentTab,
				additional,
				currentBlock,
				currentState,
				setCurrentTab,
				isNormalState,
				setAttributes,
				getAttributes,
				blockVariations,
				currentBreakpoint,
				defaultAttributes,
				currentInnerBlock,
				availableAttributes,
				masterIsNormalState,
				blockeraInnerBlocks,
				activeBlockVariation,
				currentInnerBlockState,
				getActiveBlockVariation,
				handleOnChangeAttributes,
				updateBlockEditorSettings,
				BlockComponent: () => children,
				attributes: sanitizedAttributes,
				activeDeviceType: getDeviceType(),
				getBlockType: () => select('core/blocks').getBlockType(name),
			}}
		>
			<BlockInjectedSlotContext.Provider value={clientId}>
				<PresetCanvasPreviewContext.Provider
					value={presetCanvasPreviewValue}
				>
					<PreviewInjectableStylesContext.Provider
						value={previewInjectableStylesValue}
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
											blockStyleVariationsProps:
												isSelected
													? blockStyleVariationsProps
													: {},
											updateBlockEditorSettings,
											blockProps: {
												// Sending props like exactly "edit" function props of WordPress Block.
												// Because needs total block props in outside overriding component like "blockera" in overriding process.
												name,
												activeBlockVariation:
													activeBlockVariation?.name ||
													'',
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
												currentStateAttributes:
													currentAttributes,
												...props,
											},
										}}
									/>
								</SlotFillProvider>
							</InspectorControls>
						)}

						{!insideBlockInspector && (
							<GlobalStylesPanelBaseControlConfigContext.Provider
								value={{
									name,
									clientId,
									getAttributesRef: getAttributes,
								}}
							>
								<BaseControlContext.Provider
									value={{
										components:
											GLOBAL_STYLES_BASE_CONTROL_COMPONENTS,
									}}
								>
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
												blockStyleVariationsProps,
												blockProps: {
													// Sending props like exactly "edit" function props of WordPress Block.
													// Because needs total block props in outside overriding component like "blockera" in overriding process.
													name,
													activeBlockVariation:
														activeBlockVariation?.name ||
														'',
													clientId,
													supports,
													className,
													attributes:
														sanitizedAttributes,
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
													currentStateAttributes:
														currentAttributes,
													...props,
												},
											}}
										/>
									</SlotFillProvider>
								</BaseControlContext.Provider>
							</GlobalStylesPanelBaseControlConfigContext.Provider>
						)}

						{insideBlockInspector && (
							<>
								<ErrorBoundary
									fallbackRender={({
										error,
									}): MixedElement => (
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
										<Fill
											name={
												'blockera-styles-wrapper-' +
												clientId
											}
										>
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
					</PreviewInjectableStylesContext.Provider>
				</PresetCanvasPreviewContext.Provider>
			</BlockInjectedSlotContext.Provider>
		</BlockEditContextProvider>
	);
};
