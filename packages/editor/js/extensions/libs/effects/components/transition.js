// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	BaseControl,
	TransitionControl,
	ControlContextProvider,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import { generateExtensionId } from '../../utils';

export const Transition = ({
	transition,
	block,
	handleOnChangeAttributes,
	defaultValue,
	...props
}: {
	transition: Array<Object> | void,
	block: TBlockProps,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	defaultValue: Array<Object>,
}): MixedElement => {
	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'transition'),
				value: transition,
				attribute: 'blockeraTransition',
				blockName: block.blockName,
			}}
			storeName={'blockera/controls/repeater'}
		>
			<BaseControl controlName="transition" columns="columns-1">
				<TransitionControl
					onChange={(newValue, ref) =>
						handleOnChangeAttributes(
							'blockeraTransition',
							newValue,
							{ ref }
						)
					}
					defaultValue={defaultValue}
					{...props}
				/>
			</BaseControl>
		</ControlContextProvider>
	);
};
