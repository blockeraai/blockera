// @flow

/**
 * External dependencies
 */
import {
	useMemo,
	useState,
	useContext,
	useCallback,
	createContext,
} from '@wordpress/element';
import type { MixedElement } from 'react';
import { select, dispatch } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { SlotFillProvider, Slot } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { isEmpty, isEquals, mergeObject, setImmutably } from '@blockera/utils';
import { useGlobalStylesContext } from '@blockera/global-styles-ui';

/**
 * Internal dependencies
 */
import { useGlobalStyle } from './hooks';
import { BlockPortals } from '../../../../extensions/components';
import { STORE_NAME } from '../../../../extensions/store/constants';
import { STORE_NAME as EDITOR_STORE_NAME } from '../../../../store/constants';
import { sanitizeDefaultAttributes } from '../../../../extensions/hooks/utils';
import { ignoreBlockeraAttributeKeysRegExp } from '../../../../extensions/libs';
import { prepareBlockeraDefaultAttributesValues } from '../../../../extensions/components/utils';
import {
	VARIATION_SURFACE_SIZE,
	VARIATION_SURFACE_STYLE,
} from '../variation-surfaces';
import {
	mergeBlockVariationsTrees,
	attachSizeVariationPersistenceKeys,
} from '../size-variations';

// Helper functions
export const getBlockAttributes = (name: string): Object => {
	const {
		getBlockExtensionBy,
		getBlockTypeAttributes,
		getSharedBlockAttributes,
	} = select(STORE_NAME) || {};

	const blockeraOverrideBlockTypeAttributes = getBlockTypeAttributes(name);
	return {
		blockExtension: getBlockExtensionBy('targetBlock', name),
		blockeraOverrideBlockAttributes: isEmpty(
			blockeraOverrideBlockTypeAttributes
		)
			? getSharedBlockAttributes()
			: blockeraOverrideBlockTypeAttributes,
	};
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
		if (!defaultStyles[key]?.hasOwnProperty('default')) {
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
	baseConfig: {},
	userConfig: {},
	statesManagerHandleOnChangeRef: {
		current: null,
	},
});

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
		resetBlockStateToNormal,
		blockType: { name, attributes },
		statesManagerHandleOnChangeRef,
		variationSurface = VARIATION_SURFACE_STYLE,
	} = value;

	const { blockExtension, blockeraOverrideBlockAttributes } = useMemo(
		() => getBlockAttributes(name),
		[name]
	);

	const originDefaultAttributes = useMemo(() => {
		return mergeObject(blockeraOverrideBlockAttributes, attributes);
	}, [attributes, blockeraOverrideBlockAttributes]);

	const defaultStyles = useMemo(() => {
		return sanitizeDefaultAttributes(originDefaultAttributes, {
			defaultWithoutValue: true,
		});
	}, [originDefaultAttributes]);

	const { getSelectedBlockStyleVariation } = select(EDITOR_STORE_NAME);
	const { getStyleVariationBlocks } = select(EDITOR_STORE_NAME);
	const { setBlockStyles } = dispatch(EDITOR_STORE_NAME);

	const [currentBlockStyleVariation, setCurrentBlockStyleVariation] =
		useState(() =>
			variationSurface === VARIATION_SURFACE_SIZE
				? undefined
				: getSelectedBlockStyleVariation()
		);

	const fallbackClientId = name.replace('/', '-');
	const isSizeVariation = variationSurface === VARIATION_SURFACE_SIZE;
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
	if (currentBlockStyleVariation && !currentBlockStyleVariation?.isDefault) {
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
				currentBlockStyleVariation?.name
			) {
				payload = attachSizeVariationPersistenceKeys(
					normalized,
					currentBlockStyleVariation.name,
					mergedVariationsSnapshot
				);
			}

			const isVariationScopedEdit =
				variationSurface === VARIATION_SURFACE_SIZE
					? Boolean(currentBlockStyleVariation?.name)
					: Boolean(
							currentBlockStyleVariation &&
							!currentBlockStyleVariation.isDefault &&
							currentBlockStyleVariation.name
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
			const variationArg = isSizeVariation
				? currentBlockStyleVariation?.name || ''
				: styleVariationArg;

			if (variationSurface === VARIATION_SURFACE_SIZE && !variationArg) {
				return;
			}

			const shouldFanOutAcrossBlocks =
				variationSurface === VARIATION_SURFACE_SIZE
					? Boolean(variationArg)
					: Boolean(
							!currentBlockStyleVariation?.isDefault &&
							variationArg !== 'default'
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
			isSizeVariation,
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

	return (
		<GlobalStylesPanelContext.Provider
			value={{
				style,
				getStyle,
				setStyle,
				baseConfig,
				userConfig,
				defaultStyles,
				fallbackClientId,
				variationSurface,
				childrenComponent,
				getNormalizedStyle,
				selectedBlockClientId,
				memoizedBlockBaseProps,
				getStyleVariationBlocks,
				resetBlockStateToNormal,
				currentBlockStyleVariation,
				setCurrentBlockStyleVariation,
				handleOnChangeStyleInLocalState,
				statesManagerHandleOnChangeRef:
					statesManagerHandleOnChangeRef || {
						current: null,
					},
			}}
		>
			{children}
		</GlobalStylesPanelContext.Provider>
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
