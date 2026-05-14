// @flow

import { type T_SET_CURRENT_ACTIVE_STYLE } from './handlers';

export type T_BLOCK_STYLES_PROPS = {
	blockName: string,
	hasChangesets?: boolean,
	isNotActive?: boolean,
	originDefaultAttributes?: Object,
	setChangesets?: (hasChangesets: boolean) => void,
	context?: 'global-styles-panel' | 'inspector-controls',
	pickerVariationSurface?: string,
	styles: {
		onSelect: (style: string) => void,
		stylesToRender: Array<Object>,
		activeStyle: Object,
		genericPreviewBlock: Object,
		setCurrentActiveStyle: T_SET_CURRENT_ACTIVE_STYLE,
		setCurrentPreviewStyle: (style: Object) => void,
		previewClassName: string,
		popoverAnchor: Object,
		setIsOpen: (isOpen: boolean) => void,
		isDeletedStyle: string | false,
	},
};
