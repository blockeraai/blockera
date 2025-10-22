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
import {
	EditorFeatureWrapper,
	EditorAdvancedLabelControl,
} from '../../../components';
import { useGlobalStyle } from './hooks';
import { BlockPortals } from '../../../extensions/components';
import { STORE_NAME } from '../../../extensions/store/constants';
import { STORE_NAME as EDITOR_STORE_NAME } from '../../../store/constants';
import { sanitizeDefaultAttributes } from '../../../extensions/hooks/utils';
import { prepareBlockeraDefaultAttributesValues } from '../../../extensions/components/utils';

// Helper functions
const getBlockAttributes = (name: string): Object => {
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
			['blockeraPropsId', 'blockeraCompatId', 'className'].includes(key)
		) {
			continue;
		}

		if (!/^blockera/.test(key)) {
			cleanStyles[key] = styles[key];
			continue;
		}

		if (
			!defaultStyles[key]?.hasOwnProperty('default') &&
			styles[key]?.value
		) {
			cleanStyles[key] = styles[key];
			continue;
		}

		if (!isEquals(defaultStyles[key]?.default, styles[key]?.value)) {
			cleanStyles[key] = styles[key];
		}
	}

	return cleanStyles;
};

export const GlobalStylesPanelContext: Object = createContext({
	currentBlockStyleVariation: {
		name: '',
		label: '',
	},
	setCurrentBlockStyleVariation: () => {},
	setStyles: () => {},
	styles: {},
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
		blockType: { name, attributes },
		selectedBlockClientId: clientId,
		className,
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
	const { setBlockStyles } = dispatch(EDITOR_STORE_NAME);

	const [currentBlockStyleVariation, setCurrentBlockStyleVariation] =
		useState(getSelectedBlockStyleVariation());

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
	const [style, rootStyle, setStyle] = useGlobalStyle(prefix, name, 'user', {
		shouldDecodeEncode: false,
		defaultStylesValue,
	});

	const getStyle = useCallback(
		() => ({
			...defaultStylesValue,
			...(rootStyle || {}),
		}),
		[rootStyle, defaultStylesValue]
	);

	const baseContextValue = useMemo(
		() => ({
			components: {
				FeatureWrapper: (props: Object) => (
					<EditorFeatureWrapper
						{...{
							...props,
							name,
							clientId: name.replace('/', '-'),
						}}
					/>
				),
				AdvancedLabelControl: (props: Object) => (
					<EditorAdvancedLabelControl
						getAttributesRef={getStyle}
						clientId={name.replace('/', '-')}
						{...props}
					/>
				),
			},
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[name]
	);

	const cleanupStyles = useCallback(
		(styles) => cleanupStylesHelper(styles, defaultStyles),
		[defaultStyles]
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

	const normalizedNewStyle = useCallback(
		(newStyle: Object): Object => {
			if (newStyle?.style) {
				newStyle = {
					...newStyle,
					...newStyle.style,
				};

				delete newStyle.style;
			}

			return cleanupStyles(newStyle);
		},
		[cleanupStyles]
	);

	const handleOnChangeStyle = useCallback(
		(newStyle: Object) => {
			const cleanedStyle = normalizedNewStyle(newStyle);

			setStyle(cleanedStyle);
		},
		[normalizedNewStyle, setStyle]
	);
	const handleOnChangeStyleInLocalState = useCallback(
		(newStyle: Object): void => {
			const cleanedStyle = normalizedNewStyle(newStyle);

			setBlockStyles(
				name,
				currentBlockStyleVariation?.isDefault
					? 'default'
					: currentBlockStyleVariation?.name,
				cleanedStyle
			);
		},
		[name, setBlockStyles, normalizedNewStyle, currentBlockStyleVariation]
	);

	const memoizedBlockBaseProps = useMemo(
		() => ({
			name,
			clientId: name.replace('/', '-'),
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
				baseContextValue,
				childrenComponent,
				memoizedBlockBaseProps,
				currentBlockStyleVariation,
				setCurrentBlockStyleVariation,
				handleOnChangeStyleInLocalState,
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
	children: MixedElement,
	memoizedBlockBaseProps: Object,
	baseContextValue: Object,
	getStyle: () => Object,
	currentBlockStyleVariation: {
		name: string,
		label: string,
		isDefault?: boolean,
	},
	setCurrentBlockStyleVariation: (Object) => void,
	setStyle: (Object) => void,
	style: Object,
	blockName: string,
	selectedBlockClientId: string,
	updateEditorSettings: (Object) => void,
	getEditorSettings: () => Object,
	handleOnChangeStyleInLocalState: (newStyle: Object) => void,
};

export const useGlobalStylesPanelContext =
	(): UseGlobalStylesPanelContextReturnType => {
		const contextReceivedValue = useContext(GlobalStylesPanelContext);

		const { getEditorSettings } = select(editorStore);
		const { updateEditorSettings } = dispatch(editorStore);

		return {
			...contextReceivedValue,
			updateEditorSettings,
			getEditorSettings,
		};
	};
