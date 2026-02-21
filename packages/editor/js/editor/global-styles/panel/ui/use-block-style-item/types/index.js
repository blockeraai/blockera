// @flow

/**
 * Internal dependencies
 */
import { type T_SET_CURRENT_ACTIVE_STYLE } from '../../types';

export type TUseBlockStyleItemProps = {
	// The current style for creating block style handlers.
	style: Object,
	// The main state in global styles panel. for outside of the global styles panel, it's the empty object always.
	styles: Object,
	// The current counter state.
	counter: number,
	// The current selected block name.
	blockName: string,
	// The object to mapping blocks style variations count.
	counterMap: Object,
	// The blockeraGlobalStylesMetaData state.
	cachedStyle: Object,
	// The default styles object for the current selected block.
	defaultStyles: Object,
	// The block styles array the main of state for the current selected block.
	blockStyles: Array<Object>,
	// Whether the current block customizing in the global styles panel.
	inGlobalStylesPanel: boolean,
	// The current selected block style variation.
	currentBlockStyleVariation: Object,
	// The function to set the main state in global styles panel.
	setStyles: (styles: Object) => void,
	// The function to set the counter next state.
	setCounter: (counter: number) => void,
	// The function to set the cached style. (the blockeraGlobalStylesMetaData global state)
	setCachedStyle: (style: Object) => void,
	// The function to select the style preview.
	onSelectStylePreview: (style: Object) => void,
	// The function to set the current selected style as an active style for block level to add related css classes to that.
	setCurrentActiveStyle: T_SET_CURRENT_ACTIVE_STYLE,
	// The function to set the is open context menu.
	setIsOpenContextMenu: (isOpen: boolean) => void,
	// The function to set the block styles array. (update the BlockStyles component state)
	setBlockStyles: (styles: Array<Object>) => void,
	// The function to set the current selected style variation. (update the Blockera global state)
	setCurrentBlockStyleVariation: (style: Object) => void,
	// The function to delete the style variation blocks. (delete from the Blockera global state)
	deleteStyleVariationBlocks: (
		style: string,
		single: boolean,
		blockName?: string,
		disabledIn?: Array<string>
	) => void,
	// The function to set the style variation blocks. (update the Blockera global state)
	setStyleVariationBlocks: (
		style: string,
		blocks: Array<string>,
		type?: 'auto' | 'manual'
	) => void,
	// The function to get the style variation blocks by name. (get from the Blockera global state)
	getStyleVariationBlocks: (style: string) => Array<string>,
};

export type TUseBlockStyleItemReturn = {
	isConfirmedChangeID: boolean,
	setIsConfirmedChangeID: (isConfirmed: boolean) => void,
	handleOnRename: (
		newValue: { label: string, name: string },
		currentStyle: Object
	) => void,
	handleOnDelete: (currentStyleName: string) => void,
	handleOnDuplicate: (
		currentStyle: Object,
		customValues?: { label: string, name: string }
	) => void,
	handleOnDetachStyle: (currentStyle: Object) => void,
	handleOnUsageForMultipleBlocks: (
		currentStyle: Object,
		action: 'add' | 'delete'
	) => void,
	handleOnSaveUsageForMultipleBlocks: (params: {
		style: Object,
		action: string,
		enabledIn: Array<string>,
		disabledIn: Array<string>,
		blockType: ?string,
		newGlobalStyles: Object,
		validItems: Array<Object>,
		selectedBlockStyle: string,
	}) => void,
	handleOnSaveCustomizations: (
		currentStyle: Object,
		defaultStyles?: Object
	) => void,
	handleOnEnable: (status: boolean, currentStyle: Object) => void,
	handleOnClearAllCustomizations: (currentStyle: Object) => void,
};
