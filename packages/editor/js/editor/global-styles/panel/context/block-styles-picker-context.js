// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { createContext, useContext } from '@wordpress/element';

/**
 * Block Styles Picker Context
 *
 * Provides shared state for the block styles picker UI (StyleVariationsManager,
 * StyleItem, AddNewStyleButton). Reduces prop drilling through the component tree.
 */
export const BlockStylesPickerContext: Object = createContext({
	blockName: '',
	counter: 0,
	counterMap: {},
	setCounter: () => {},
	blockStyles: [],
	setBlockStyles: () => {},
	activeStyle: null,
	setCurrentActiveStyle: () => {},
	setCurrentBlockStyleVariation: () => {},
	handlePromotionPopover: () => {},
	onSelectStylePreview: () => {},
	setCurrentPreviewStyle: () => {},
	styleItemHandler: () => {},
	editorStyles: {},
	setStyles: () => {},
	originDefaultAttributes: {},
	hasChangesets: false,
	setChangesets: () => {},
	isNotActive: false,
});

export const useBlockStylesPickerContext = (): Object => {
	const context = useContext(BlockStylesPickerContext);

	if (!context) {
		throw new Error(
			'useBlockStylesPickerContext must be used within BlockStylesPickerContextProvider'
		);
	}

	return context;
};

export const BlockStylesPickerContextProvider = ({
	children,
	value,
}: {
	children: Object,
	value: Object,
}): MixedElement => (
	<BlockStylesPickerContext.Provider value={value}>
		{children}
	</BlockStylesPickerContext.Provider>
);
