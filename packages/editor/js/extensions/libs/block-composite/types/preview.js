// @flow

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export type TPreviewProps = {
	block: {
		...TBlockProps,
		attributes?: Object,
		selectedBlockClientId?: string,
	},
	blockConfig: Object,
	onChange: THandleOnChangeAttributes,
	currentBlock: string,
	currentState: Object,
	insideBlockInspector?: boolean,
	/**
	 * Active-color scope for popovers; defaults to `insideBlockInspector`.
	 * Inner-block card previews keep inspector repeater scope (`insideBlockInspector`
	 * true) while still using global-styles colors when this is false.
	 */
	activeColorInsideBlockInspector?: boolean,
	variationSurface?: string,
	availableStates: Object,
	currentBreakpoint: string,
	setCurrentTab?: (tab: string) => void,
	currentInnerBlockState: Object,

	// States Manager props.
	blockStatesProps: Object,
	onStatesManagerReady?: (handleOnChange: (value: Object) => void) => void,

	// Inner Blocks props.
	innerBlocksProps?: Object,
};
