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
	props,
}: {
	transition: Array<Object> | void,
	props: Object,
	block: TBlockProps,
	handleOnChangeAttributes: THandleOnChangeAttributes,
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
					onChange={(newValue) =>
						handleOnChangeAttributes(
							'publisherTransition',
							newValue
						)
					}
					{...props}
				/>
			</BaseControl>
		</ControlContextProvider>
	);
};
