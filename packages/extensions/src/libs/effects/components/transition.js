// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	TransitionControl,
	ControlContextProvider,
} from '@publisher/controls';

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
				attribute: 'publisherTransition',
				blockName: block.blockName,
			}}
			storeName={'publisher-core/controls/repeater'}
		>
			<BaseControl controlName="transition" columns="columns-1">
				<TransitionControl
					onChange={(newValue, ref) =>
						handleOnChangeAttributes(
							'publisherTransition',
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
