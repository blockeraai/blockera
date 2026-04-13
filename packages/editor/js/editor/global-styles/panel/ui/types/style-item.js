// @flow

/**
 * Internal dependencies
 */
import { type T_SET_CURRENT_ACTIVE_STYLE } from './handlers';

export type T_STYLE_ITEM_PROPS = {
	style: Object,
	counter: number,
	blockName: string,
	counterMap: Object,
	activeStyle: Object,
	hasChangesets?: boolean,
	blockStyles: Array<Object>,
	originDefaultAttributes?: Object,
	inGlobalStylesPanel: boolean,
	handlePromotionPopover: () => boolean,
	setCounter: (counter: number) => void,
	styleItemHandler: (style: Object) => void,
	onSelectStylePreview: (style: Object) => void,
	setBlockStyles: (styles: Array<Object>) => void,
	setCurrentPreviewStyle: (style: Object) => void,
	setChangesets?: (hasChangesets: boolean) => void,
	setCurrentActiveStyle: T_SET_CURRENT_ACTIVE_STYLE,
};
