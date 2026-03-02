// @flow

/**
 * External dependencies
 */
import {
	createContext,
	useContext,
	useState,
	useMemo,
	useCallback,
} from '@wordpress/element';
import type { MixedElement } from 'react';
import { select, dispatch } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { SlotFillProvider, Slot } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { isEmpty, isEquals, mergeObject } from '@blockera/utils';

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
				!Object.values(styles[key]).some((value) => value !== undefined)
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
		useState(getSelectedBlockStyleVariation());

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
			setStyle(getNormalizedStyle(newStyle, defaultStyles));
		},
		[setStyle, defaultStyles]
	);
	const handleOnChangeStyleInLocalState = useCallback(
		(newStyle: Object): void => {
			setBlockStyles(
				name,
				currentBlockStyleVariation?.isDefault
					? 'default'
					: currentBlockStyleVariation?.name || 'default',
				getNormalizedStyle(newStyle, defaultStyles)
			);
		},
		[name, setBlockStyles, currentBlockStyleVariation, defaultStyles]
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
