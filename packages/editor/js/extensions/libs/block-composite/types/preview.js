// @flow

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export type TPreviewProps = {
	block: {
		...TBlockProps,
		attributes?: Object,
	},
	blockConfig: Object,
	onChange: THandleOnChangeAttributes,
	currentBlock: string,
	currentState: Object,
	insideBlockInspector?: boolean,
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
