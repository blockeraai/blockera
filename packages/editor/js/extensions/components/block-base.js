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
import {
	isEquals,
	cloneObject,
	mergeObject,
	getSmallHash,
} from '@blockera/utils';
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

const BLOCKERA_DELAY_EXPECTED_TIME =
	process.env.APP_MODE === 'development' ? 100 : 1000;

// Map to store registered class names by clientId.
// Structure: Map<clientId, Set<classNames>>
const REGISTERED_CLASSNAMES = new Map<string, Set<string>>();

/**
 * Register a class name to be used in the block.
 *
 * @param {string} clientId - The client ID of the block.
 * @param {string} className - The class name to register.
 */
export const registerClassName = (
	clientId: string,
	className: string
): void => {
	if (!REGISTERED_CLASSNAMES.has(clientId)) {
		REGISTERED_CLASSNAMES.set(clientId, new Set());
	}
	REGISTERED_CLASSNAMES.get(clientId)?.add(className);
};

/**
 * Check if a class name is already registered for a different clientId.
 *
 * @param {string} clientId - The client ID of the block.
 * @param {string} className - The class name to check.
 * @return {boolean} True if the class name is registered for a different clientId.
 */
export const isClassNameDuplicate = (
	clientId: string,
	className: string
): boolean => {
	for (const [
		registeredClientId,
		classNames,
	] of REGISTERED_CLASSNAMES.entries()) {
		if (registeredClientId !== clientId && classNames.has(className)) {
			return true;
		}
	}
	return false;
};

/**
 * Get all registered class names for a specific clientId.
 *
 * @param {string} clientId - The client ID of the block.
 * @return {Set<string>} Set of registered class names for the clientId.
 */
export const getRegisteredClassNames = (clientId: string): Set<string> => {
	return REGISTERED_CLASSNAMES.get(clientId) || new Set();
};

/**
 * Generate a unique class name for a block instance.
 * Handles collisions by detecting existing numbered classnames and appending
 * a counter based on the highest number found.
 *
 * @param {string} clientId - The client ID to generate the unique class name from.
 * @param {string} className - The default class name for block.
 *
 * @return {string} A unique class name that hasn't been registered yet.
 */
export const generateUniqueClassName = (
	clientId: string,
	className: string
): string => {
	let _className = '';
	const matchBaseClass = className?.match(regexPattern);
	if (matchBaseClass) {
		_className = matchBaseClass[0];
	}
	const baseHash = _className
		? _className.match(/blockera-block-(\w+)/)?.[1] ||
			getSmallHash(clientId)
		: getSmallHash(clientId);
	const baseClassName = _className
		? _className
		: `blockera-block-${baseHash}`;

	// Check if base classname is available (no counter needed).
	if (!isClassNameDuplicate(clientId, baseClassName)) {
		registerClassName(clientId, baseClassName);
		return baseClassName;
	}

	// Base classname exists, find the highest counter number used.
	// Pattern: blockera-block-{baseHash}-{number}
	const pattern = new RegExp(
		`^blockera-block-${baseHash.replace(
			/[.*+?^${}()|[\]\\]/g,
			'\\$&'
		)}-(\\d+)$`
	);
	let maxCounter = 0;

	// Scan all registered classnames to find the highest counter for this baseHash.
	REGISTERED_CLASSNAMES.forEach((registeredClassNames) => {
		registeredClassNames.forEach((registeredClassName) => {
			// $FlowFixMe
			const match = registeredClassName.match(pattern);
			if (match) {
				const counter = parseInt(match[1], 10);
				if (counter > maxCounter) {
					maxCounter = counter;
				}
			}
		});
	});

	// Generate unique classname with counter starting from maxCounter + 1.
	let counter = maxCounter + 1;
	let uniqueClassName = `blockera-block-${baseHash}-${counter}`;

	// Double-check for collisions (shouldn't happen, but safety check).
	while (REGISTERED_CLASSNAMES.has(uniqueClassName)) {
		counter++;
		uniqueClassName = `blockera-block-${baseHash}-${counter}`;
	}

	// Register the class name to prevent future collisions.
	registerClassName(clientId, uniqueClassName);

	return uniqueClassName;
};

// blockera block classname pattern.
const regexPattern = /blockera-block-[\w-]+/i;

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
		editorSelectedBlockEvent,
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

		const { getDeviceType, getEditorSelectedBlockEvent } =
			select('blockera/editor');

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
			editorSelectedBlockEvent: getEditorSelectedBlockEvent(),
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
		return generateUniqueClassName(clientId, blockAttributes?.className);
	}, [clientId, blockAttributes?.className]);

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
				REGISTERED_CLASSNAMES.delete(uniqueClassName);
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
				if (regexPattern.test(part)) {
					if (REGISTERED_CLASSNAMES.has(part)) {
						// Only unregister if it's not the unique classname for this block.
						REGISTERED_CLASSNAMES.delete(part);
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
		} else if (!classNameStr.match(regexPattern)?.[0]) {
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

	const [attributes, setState] = useState(compatibleAttributes);
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
		const match = regexPattern.exec(value.className);

		// We should update classname with unique generate classname while customizing style variation.
		if (
			shouldUpdateClassName &&
			/^is-style-.*/g.test(value?.className) &&
			!/\s/g.test(value?.className || '')
		) {
			value.className = classNames(value.className, {
				'blockera-block': true,
				[uniqueClassName]: true,
			});
			registerClassName(clientId, uniqueClassName);
		} else if (
			shouldUpdateClassName &&
			match &&
			isClassNameDuplicate(clientId, match[0])
		) {
			const prevClassName = value.className
				.replace(regexPattern, '')
				.replace(/\bblockera-block\b/gi, '');
			value.className = classNames(prevClassName.trim(), {
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

		setState(value);
	};

	// Debounce updates to parent state to avoid unnecessary re-renders.
	useEffect(() => {
		// Skip the effect if the block is not a blockera block and not has metadata.
		if (
			!attributes?.blockeraPropsId &&
			!attributes.hasOwnProperty('metadata') &&
			!['save-customizations', 'detach-style'].includes(
				editorSelectedBlockEvent
			)
		) {
			return;
		}

		if (
			'function' === typeof handleOnChangeStyleInLocalState &&
			!isEquals(compatibleAttributes, attributes) &&
			false === insideBlockInspector
		) {
			// It just will be called if outside of the block inspector. (See: canvas-editor/components/block-global-styles-panel-screen/context.js)
			handleOnChangeStyleInLocalState(attributes);
		}

		// If inside the block inspector, update the parent state immediately.
		if (insideBlockInspector) {
			// Compare the block attributes with the attributes and the attributes ref.
			// If they are not equal, set the attributes to the block attributes.
			if (!isEquals(compatibleAttributes, attributes)) {
				setBlockAttributes(attributes);

				// Updating attributes reference...
				compatibleAttributesRef.current = attributes;
			}

			return;
		}

		const timeoutId = setTimeout(() => {
			// Compare the block attributes with the attributes and the attributes ref.
			// If they are not equal, set the attributes to the block attributes.
			if (!isEquals(compatibleAttributes, attributes)) {
				setBlockAttributes(attributes);

				// Updating attributes reference...
				compatibleAttributesRef.current = attributes;
			}
		}, BLOCKERA_DELAY_EXPECTED_TIME); // Update the parent state after BLOCKERA_DELAY_EXPECTED_TIME to avoid unnecessary re-renders.

		return () => clearTimeout(timeoutId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [attributes]);

	useEffect(() => {
		// If the current block is an inner block, don't update the attributes.
		// Because the inner block attributes are updated by the parent block.
		if (isInnerBlock(currentBlock)) {
			return;
		}

		// Compare the compatible attributes with the attributes and the attributes ref.
		// If they are not equal, set the attributes to the compatible attributes.
		if (
			(!isEquals(attributes, compatibleAttributes) &&
				!isEquals(
					compatibleAttributesRef.current,
					compatibleAttributes
				) &&
				!isEquals(attributes, compatibleAttributesRef.current)) ||
			!compatibleAttributesRef.current
		) {
			setAttributes(compatibleAttributes);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [compatibleAttributes]);

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

	const blockStyleVariationsProps = useBlockStyleVariations({
		clientId,
		blockName: name,
		storedAttributes: attributes,
		defaultAttributes: availableAttributes,
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
		getAttributes: () => attributes,
		innerBlocks: additional?.blockeraInnerBlocks,
		setChangesets: blockStyleVariationsProps.setChangesets,
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
								blockStyleVariationsProps,
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
							blockStyleVariationsProps,
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
