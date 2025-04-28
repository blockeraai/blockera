// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { TPreviewProps } from '../types';
import { InnerBlocksExtension } from '../../inner-blocks';
import StatesManager from '../../block-states/components/states-manager';

export const Preview = ({
	// General Props.
	block,
	onChange,
	currentBlock,
	currentState,
	currentBreakpoint,
	currentInnerBlockState,

	// States Manager props.
	blockStatesProps,

	// Inner Blocks props.
	innerBlocksProps,
}: TPreviewProps): MixedElement => {
	const { attributes, availableStates } = blockStatesProps;

	return (
		<StatesManager
			block={block}
			onChange={onChange}
			attributes={attributes}
			availableStates={availableStates}
			{...{
				currentBlock,
				currentState,
				currentBreakpoint,
				currentInnerBlockState,
			}}
		>
			{innerBlocksProps && (
				<InnerBlocksExtension
					{...innerBlocksProps}
					block={block}
					onChange={onChange}
				/>
			)}
		</StatesManager>
	);
};
