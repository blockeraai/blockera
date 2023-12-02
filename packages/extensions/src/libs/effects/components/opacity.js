// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { InputControl, ControlContextProvider } from '@publisher/controls';
import { isInteger } from '@publisher/utils';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import { generateExtensionId } from '../../utils';

export const Opacity = ({
	block,
	opacity,
	props,
	handleOnChangeAttributes,
}: {
	opacity: string | void,
	block: TBlockProps,
	props: Object,
	handleOnChangeAttributes: THandleOnChangeAttributes,
}): MixedElement => {
	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'opacity'),
				value: opacity,
			}}
		>
			<InputControl
				controlName="input"
				label={__('Opacity', 'publisher-core')}
				columns="columns-2"
				{...{
					...props,
					unitType: 'percent',
					range: true,
					min: 0,
					max: 100,
					initialPosition: 100,
					defaultValue: '100%',
					onChange: (newValue) =>
						handleOnChangeAttributes(
							'publisherOpacity',
							isInteger(newValue) ? `${newValue}%` : newValue
						),
				}}
			/>
		</ControlContextProvider>
	);
};
