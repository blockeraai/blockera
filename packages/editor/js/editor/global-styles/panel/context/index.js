// @flow

/**
 * External dependencies
 */
import {
	useMemo,
	useState,
	useEffect,
	useContext,
	useCallback,
	useRef,
	createContext,
} from '@wordpress/element';
import type { MixedElement } from 'react';
import { select, dispatch } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { SlotFillProvider, Slot } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { useGlobalStylesContext } from '@blockera/global-styles-ui';
import { isEmpty, isEquals, mergeObject, setImmutably } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { useGlobalStyle } from './hooks';
import { BlockPortals } from '../../../../extensions/components';
import { STORE_NAME } from '../../../../extensions/store/constants';
import { STORE_NAME as EDITOR_STORE_NAME } from '../../../../store/constants';
import { sanitizeDefaultAttributes } from '../../../../extensions/hooks/utils';
import { ignoreBlockeraAttributeKeysRegExp } from '../../../../extensions/libs';
import { registerBlockExtensionsSupports } from '../../../../extensions/libs/base';
import { prepareBlockeraDefaultAttributesValues } from '../../../../extensions/components/utils';
import { STORE_NAME as EXTENSIONS_STORE_NAME } from '../../../../extensions/libs/base/store/constants';
import {
	VARIATION_SURFACE_SIZE,
	VARIATION_SURFACE_STYLE,
} from '../variation-surfaces';
import {
	mergeBlockVariationsTrees,
	attachSizeVariationPersistenceKeys,
	isVariationScopedStyleEdit,
} from '../size-variations';
import {
	getBlockVariationSupport,
	blockUsesSharedRootStyleVariation,
} from '../block-variation-support';
import { getExtensionsUiContext } from '../../../../extensions/components/extensions-ui-context';
import { useResetBlockStateToNormal } from '../../../../extensions/libs/block-card/block-states/hooks';
import { useStableBlockeraUnsavedData } from '../stable-blockera-unsaved-data';
import { createGlobalStylesPanelActiveColorStore } from '../global-styles-panel-active-color-store';
import { GlobalStylesPanelActiveColorShell } from '../global-styles-panel-active-color-shell';

// Helper functions
export const getBlockAttributes = (name: string): Object => {
	const {
		getBlockExtensionBy,
		getBlockTypeAttributes,
		getSharedBlockAttributes,
	} = select(STORE_NAME) || {};
	const { getExtensions } = select(EXTENSIONS_STORE_NAME);

	const blockeraOverrideBlockTypeAttributes = getBlockTypeAttributes(name);
	return {
		blockExtensions: getExtensions(name),
		blockExtension: getBlockExtensionBy('targetBlock', name),
		blockeraOverrideBlockAttributes: isEmpty(
			blockeraOverrideBlockTypeAttributes
		)
			? getSharedBlockAttributes()
			: blockeraOverrideBlockTypeAttributes,
	};
};

const registerDefaultBlockExtensionsSupports = (
	blockName: string,
	blockExtension?: Object
): Object => {
	if ('function' === typeof blockExtension?.registerExtensions) {
		blockExtension.registerExtensions(blockName);
	} else {
		registerBlockExtensionsSupports(blockName);
	}

	return select(EXTENSIONS_STORE_NAME).getExtensions(blockName);
};

const cleanupStylesHelper = (styles: Object, defaultStyles: Object): Object => {
	const cleanStyles: { [key: string]: Object } = {};

	for (const key in styles) {
		if (
			[
				'className',
				'blockeraPropsId',
				'blockeraCompatId',
				'blockeraCurrentDevice',
			].includes(key)
		) {
			continue;
		}

		if (!ignoreBlockeraAttributeKeysRegExp().test(key)) {
			if (styles[key] === undefined) {
				continue;
			}

			// Exclude the Block original core attributes is object and contains all values are undefined.
			if (
				'object' === typeof styles[key] &&
				!Object.values(styles[key] || {}).some(
					(value) => value !== undefined
				)
			) {
				continue;
			}

			cleanStyles[key] = styles[key];

			continue;
		}

		// Process all keys if has not default property.
		if (!defaultStyles?.[key]?.hasOwnProperty('default')) {
			if (!styles[key]?.hasOwnProperty('value')) {
				cleanStyles[key] = {
					value: styles[key],
				};
			} else {
				cleanStyles[key] = styles[key];
			}

			continue;
		}

		// Process all keys which has default property.
		if (
			!styles[key]?.hasOwnProperty('value') &&
			!defaultStyles[key]?.default?.hasOwnProperty('value') &&
			!isEquals(defaultStyles[key]?.default, styles[key])
		) {
			cleanStyles[key] = {
				value: styles[key],
			};
		} else if (
			!styles[key]?.hasOwnProperty('value') &&
			defaultStyles[key]?.default?.hasOwnProperty('value') &&
			!isEquals(defaultStyles[key]?.default?.value, styles[key])
		) {
			cleanStyles[key] = {
				value: styles[key],
			};
		} else if (
			styles[key]?.hasOwnProperty('value') &&
			!defaultStyles[key]?.default?.hasOwnProperty('value') &&
			!isEquals(defaultStyles[key]?.default, styles[key]?.value)
		) {
			cleanStyles[key] = styles[key];
		} else if (
			styles[key]?.hasOwnProperty('value') &&
			defaultStyles[key]?.default?.hasOwnProperty('value') &&
			!isEquals(defaultStyles[key]?.default?.value, styles[key]?.value)
		) {
			cleanStyles[key] = styles[key];
		}
	}

	return cleanStyles;
};

/**
 * Block types that share a style variation (see styleVariationBlocks in the editor store).
 * Always includes the block currently being edited in the global styles panel.
 *
 * @param {Function} getStyleVariationBlocks store selector bound to variation name.
 * @param {string} variationName
 * @param {string} currentBlockName
 * @return {Array<string>} Distinct block names that use this variation, including the current block.
 */
const getBlockTypesForStyleVariation = (
	getStyleVariationBlocks: (string) => mixed,
	variationName: string,
	currentBlockName: string
): Array<string> => {
	const registered = getStyleVariationBlocks(variationName);
	const list: Array<string> = [];
	if (Array.isArray(registered)) {
		for (const item of registered) {
			if (typeof item === 'string') {
				list.push(item);
			}
		}
	}
	return [...new Set([...list, currentBlockName])];
};

/**
 * Normalizing style for any variations of block.
 *
 * @param {Object} newStyle the new style to normalizing.
 * @param {Object} defaultStyles the default styles properties to using inside cleanup process.
 *
 * @return {Object} normalized style as a object.
 */
export const getNormalizedStyle = (
	newStyle: Object,
	defaultStyles: Object
): Object => {
	// Some callsites can pass `null`/`undefined` (e.g. intermediate onChange payloads).
	// Treat non-objects as "no style changes" to avoid runtime crashes.
	if (!newStyle || 'object' !== typeof newStyle) {
		return {};
	}

	if (!Object.keys(newStyle).length) {
		return newStyle;
	}

	const compatibleStyles = newStyle?.style || {};

	delete newStyle?.style;

	return cleanupStylesHelper(
		mergeObject(compatibleStyles, newStyle),
		defaultStyles
	);
};

export const GlobalStylesPanelContext: Object = createContext({
	currentBlockStyleVariation: {
		name: '',
		label: '',
	},
	setCurrentBlockStyleVariation: () => {},
	getStyleVariationBlocks: () => [],
	setStyleVariationBlocks: () => {},
	setStyles: () => {},
	styles: {},
	variationSurface: VARIATION_SURFACE_STYLE,
	extensionsUiContext: undefined,
	usesSharedRootStyleVariation: false,
	baseConfig: {},
	userConfig: {},
	statesManagerHandleOnChangeRef: {
		current: null,
	},
});

export const GlobalStylesPanelActiveColorStoreContext: Object =
	createContext(null);

export const GlobalStylesPanelContextConsumer = ({
	children,
}: Object): MixedElement => {
	return (
		<GlobalStylesPanelContext.Consumer>
			{children}
		</GlobalStylesPanelContext.Consumer>
	);
};

export const GlobalStylesPanelContextProvider = ({
	children,
	value,
}: Object): MixedElement => {
	const {
		className,
		selectedBlockClientId,
		blockType: { name, attributes },
		statesManagerHandleOnChangeRef,
		variationSurface = VARIATION_SURFACE_STYLE,
	} = value;

	const extensionsUiContext = getExtensionsUiContext(false, variationSurface);
	const resetBlockStateToNormal = useResetBlockStateToNormal({
		clientId: selectedBlockClientId || '',
		blockName: name,
		statesManagerHandleOnChangeRef,
		extensionsUiContext,
	});

	const { blockExtension, blockeraOverrideBlockAttributes } = useMemo(
		() => getBlockAttributes(name),
		[name]
	);

	const usesSharedRootStyleVariation = useMemo(
		() =>
			blockUsesSharedRootStyleVariation(
				getBlockVariationSupport(blockExtension)
			),
		[blockExtension]
	);

	const originDefaultAttributes = useMemo(() => {
		return mergeObject(blockeraOverrideBlockAttributes, attributes);
	}, [attributes, blockeraOverrideBlockAttributes]);

	const defaultStyles = useMemo(() => {
		return sanitizeDefaultAttributes(originDefaultAttributes, {
			defaultWithoutValue: true,
		});
	}, [originDefaultAttributes]);

	const { getSelectedBlockStyleVariation, getSelectedBlockSizeVariation } =
		select(EDITOR_STORE_NAME);
	const { getStyleVariationBlocks } = select(EDITOR_STORE_NAME);
	const {
		setBlockStyles,
		setSelectedBlockStyleVariation,
		setSelectedBlockSizeVariation,
	} = dispatch(EDITOR_STORE_NAME);

	const [currentBlockStyleVariation, setCurrentBlockStyleVariationState] =
		useState(() =>
			variationSurface === VARIATION_SURFACE_SIZE
				? getSelectedBlockSizeVariation()
				: getSelectedBlockStyleVariation()
		);

	const setCurrentBlockStyleVariation = useCallback(
		(variation: Object | void) => {
			setCurrentBlockStyleVariationState(variation);

			if (variationSurface === VARIATION_SURFACE_SIZE) {
				setSelectedBlockSizeVariation(variation);
				return;
			}

			setSelectedBlockStyleVariation(variation);
		},
		[
			variationSurface,
			setSelectedBlockStyleVariation,
			setSelectedBlockSizeVariation,
		]
	);

	useEffect(() => {
		if (blockExtension?.supportsExtensions) {
			const baseBlockExtensions = registerDefaultBlockExtensionsSupports(
				name,
				blockExtension
			);

			if (variationSurface === VARIATION_SURFACE_SIZE) {
				registerBlockExtensionsSupports(
					name,
					blockExtension.supportsExtensions(
						name,
						baseBlockExtensions,
						VARIATION_SURFACE_SIZE
					)
				);
			} else {
				registerBlockExtensionsSupports(
					name,
					blockExtension.supportsExtensions(
						name,
						baseBlockExtensions,
						VARIATION_SURFACE_STYLE
					)
				);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentBlockStyleVariation]);

	const fallbackClientId = name.replace('/', '-');
	const clientId = currentBlockStyleVariation?.name
		? `${currentBlockStyleVariation?.name}-${fallbackClientId}`
		: fallbackClientId;

	const defaultStylesValue = useMemo(
		() =>
			prepareBlockeraDefaultAttributesValues(defaultStyles, {
				context: 'global-styles-panel',
			}),
		[defaultStyles]
	);

	let prefixParts: Array<string> = [];
	if (
		isVariationScopedStyleEdit(
			currentBlockStyleVariation,
			usesSharedRootStyleVariation
		)
	) {
		prefixParts = ['variations', currentBlockStyleVariation.name].concat(
			prefixParts
		);
	}
	const prefix = prefixParts.join('.');
	const [style, rootStyle, setStyle, userConfig, baseConfig] = useGlobalStyle(
		prefix,
		name,
		'all',
		{
			shouldDecodeEncode: false,
			defaultStylesValue,
		}
	);

	const { setUserConfig } = useGlobalStylesContext();

	const getStyle = useCallback(
		() => ({
			...defaultStylesValue,
			...(rootStyle || {}),
		}),
		[rootStyle, defaultStylesValue]
	);

	const childrenComponent = useMemo(
		() => (
			<SlotFillProvider>
				<Slot name={'blockera-block-before'} />

				<BlockPortals
					blockId={`#block-${clientId}`}
					mainSlot={'blockera-block-slot'}
					slots={
						// slot selectors is feature on configuration block to create custom slots for anywhere.
						// we can add slotSelectors property on block configuration to handle custom preview of block.
						{}
					}
				/>

				<Slot name={'blockera-block-after'} />
			</SlotFillProvider>
		),
		[clientId]
	);

	const handleOnChangeStyle = useCallback(
		(newStyle: Object) => {
			const normalized = getNormalizedStyle(newStyle, defaultStyles);
			const mergedVariationsSnapshot = mergeBlockVariationsTrees(
				baseConfig || {},
				userConfig || {},
				name
			);

			let payload = normalized;

			if (
				variationSurface === VARIATION_SURFACE_SIZE &&
				isVariationScopedStyleEdit(
					currentBlockStyleVariation,
					usesSharedRootStyleVariation
				) &&
				currentBlockStyleVariation?.name
			) {
				payload = attachSizeVariationPersistenceKeys(
					normalized,
					currentBlockStyleVariation.name,
					mergedVariationsSnapshot
				);
			}

			const isVariationScopedEdit = isVariationScopedStyleEdit(
				currentBlockStyleVariation,
				usesSharedRootStyleVariation
			);

			if (isVariationScopedEdit && currentBlockStyleVariation?.name) {
				const variationName = currentBlockStyleVariation.name;
				const targetBlocks = getBlockTypesForStyleVariation(
					getStyleVariationBlocks,
					variationName,
					name
				);

				if (targetBlocks.length > 1) {
					setUserConfig((currentConfig: Object) => {
						return targetBlocks.reduce(
							(acc: Object, blockName: string) =>
								setImmutably(
									acc,
									`styles.blocks.${blockName}.variations.${variationName}`.split(
										'.'
									),
									payload
								),
							currentConfig
						);
					});
					return;
				}
			}

			setStyle(payload);
		},
		[
			setStyle,
			setUserConfig,
			defaultStyles,
			currentBlockStyleVariation,
			getStyleVariationBlocks,
			name,
			variationSurface,
			baseConfig,
			userConfig,
			usesSharedRootStyleVariation,
		]
	);

	const handleOnChangeStyleInLocalState = useCallback(
		(newStyle: Object): void => {
			const normalized = getNormalizedStyle(newStyle, defaultStyles);
			const mergedVariationsSnapshot = mergeBlockVariationsTrees(
				baseConfig || {},
				userConfig || {},
				name
			);

			let payload = normalized;

			if (
				variationSurface === VARIATION_SURFACE_SIZE &&
				isVariationScopedStyleEdit(
					currentBlockStyleVariation,
					usesSharedRootStyleVariation
				) &&
				currentBlockStyleVariation?.name
			) {
				payload = attachSizeVariationPersistenceKeys(
					normalized,
					currentBlockStyleVariation.name,
					mergedVariationsSnapshot
				);
			}

			const styleVariationArg = currentBlockStyleVariation?.isDefault
				? 'default'
				: currentBlockStyleVariation?.name || 'default';
			const variationArg = styleVariationArg;

			const shouldFanOutAcrossBlocks = isVariationScopedStyleEdit(
				currentBlockStyleVariation,
				usesSharedRootStyleVariation
			);

			if (shouldFanOutAcrossBlocks) {
				const targetBlocks = getBlockTypesForStyleVariation(
					getStyleVariationBlocks,
					variationArg,
					name
				);

				for (const blockName of targetBlocks) {
					setBlockStyles(blockName, variationArg, payload);
				}

				return;
			}

			setBlockStyles(name, variationArg, payload);
		},
		[
			name,
			setBlockStyles,
			currentBlockStyleVariation,
			defaultStyles,
			getStyleVariationBlocks,
			variationSurface,
			baseConfig,
			userConfig,
			usesSharedRootStyleVariation,
		]
	);

	const memoizedBlockBaseProps = useMemo(
		() => ({
			name,
			clientId,
			setAttributes: handleOnChangeStyle,
			defaultAttributes: defaultStyles,
			additional: blockExtension,
			insideBlockInspector: false,
			className,
			attributes: style,
			originDefaultAttributes,
		}),
		[
			name,
			style,
			clientId,
			className,
			defaultStyles,
			blockExtension,
			handleOnChangeStyle,
			originDefaultAttributes,
		]
	);

	const blockeraUnsavedDataForActiveColor = useStableBlockeraUnsavedData(
		style?.blockeraUnsavedData
	);

	const activeColorStoreRef = useRef(null);
	if (!activeColorStoreRef.current) {
		activeColorStoreRef.current = createGlobalStylesPanelActiveColorStore();
	}

	const contextValue = useMemo(
		() => ({
			style,
			getStyle,
			setStyle,
			baseConfig,
			userConfig,
			defaultStyles,
			fallbackClientId,
			variationSurface,
			extensionsUiContext,
			usesSharedRootStyleVariation,
			childrenComponent,
			getNormalizedStyle,
			selectedBlockClientId,
			memoizedBlockBaseProps,
			getStyleVariationBlocks,
			resetBlockStateToNormal,
			currentBlockStyleVariation,
			setCurrentBlockStyleVariation,
			handleOnChangeStyleInLocalState,
			statesManagerHandleOnChangeRef: statesManagerHandleOnChangeRef || {
				current: null,
			},
		}),
		[
			style,
			getStyle,
			setStyle,
			baseConfig,
			userConfig,
			defaultStyles,
			fallbackClientId,
			variationSurface,
			extensionsUiContext,
			usesSharedRootStyleVariation,
			childrenComponent,
			selectedBlockClientId,
			memoizedBlockBaseProps,
			getStyleVariationBlocks,
			resetBlockStateToNormal,
			currentBlockStyleVariation,
			setCurrentBlockStyleVariation,
			statesManagerHandleOnChangeRef,
			handleOnChangeStyleInLocalState,
		]
	);

	return (
		<GlobalStylesPanelActiveColorStoreContext.Provider
			value={activeColorStoreRef.current}
		>
			<GlobalStylesPanelActiveColorShell
				store={activeColorStoreRef.current}
				blockName={name}
				fallbackClientId={fallbackClientId}
				variationSurface={variationSurface}
				blockeraUnsavedData={blockeraUnsavedDataForActiveColor}
			>
				<GlobalStylesPanelContext.Provider value={contextValue}>
					{children}
				</GlobalStylesPanelContext.Provider>
			</GlobalStylesPanelActiveColorShell>
		</GlobalStylesPanelActiveColorStoreContext.Provider>
	);
};

type UseGlobalStylesPanelContextReturnType = {
	currentBlockStyleVariation: {
		name: string,
		label: string,
	},
	userConfig: Object,
	baseConfig: Object,
	variationSurface: 'size' | 'style',
	extensionsUiContext?: string,
	usesSharedRootStyleVariation: boolean,
	children: MixedElement,
	memoizedBlockBaseProps: Object,
	getStyle: () => Object,
	fallbackClientId: string,
	currentBlockStyleVariation: {
		name: string,
		label: string,
		isDefault?: boolean,
	},
	resetBlockStateToNormal: () => void,
	getStyleVariationBlocks: (style: string) => Object,
	setStyleVariationBlocks: (style: string, blocks: Array<string>) => void,
	deleteStyleVariationBlocks: (
		style: string,
		single: boolean,
		blockName?: string
	) => void,
	setCurrentBlockStyleVariation: (Object) => void,
	setStyle: (Object) => void,
	style: Object,
	blockName: string,
	selectedBlockClientId: string,
	updateEditorSettings: (Object) => void,
	getEditorSettings: () => Object,
	defaultStyles: Object,
	handleOnChangeStyleInLocalState: (newStyle: Object) => void,
	getNormalizedStyle: (newStyle: Object, defaultStyles: Object) => Object,
	statesManagerHandleOnChangeRef: {
		current: ((value: Object) => void) | null,
	},
};

export {
	BlockStylesPickerContext,
	BlockStylesPickerContextProvider,
	useBlockStylesPickerContext,
} from './block-styles-picker-context';
export {
	StyleItemMenuContext,
	StyleItemMenuContextProvider,
	useStyleItemMenuContext,
} from './style-item-menu-context';

export const useGlobalStylesPanelContext =
	(): UseGlobalStylesPanelContextReturnType => {
		const contextReceivedValue = useContext(GlobalStylesPanelContext);

		const { getEditorSettings } = select(editorStore);
		const { updateEditorSettings } = dispatch(editorStore);
		const { setStyleVariationBlocks, deleteStyleVariationBlocks } =
			dispatch(EDITOR_STORE_NAME);

		return {
			...contextReceivedValue,
			getEditorSettings,
			updateEditorSettings,
			setStyleVariationBlocks,
			deleteStyleVariationBlocks,
		};
	};
