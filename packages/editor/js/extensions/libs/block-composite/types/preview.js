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
	onChange: THandleOnChangeAttributes,
	currentBlock: string,
	currentState: Object,
	currentBreakpoint: string,
	currentInnerBlockState: Object,

	// States Manager props.
	blockStatesProps: Object,

	// Inner Blocks props.
	innerBlocksProps?: Object,
};
