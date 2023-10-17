// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
/**
 * Publisher dependencies
 */
import {
	BaseControl,
	ControlContextProvider,
	InputControl,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../../utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export const FontSize = ({
	block,
	value,
	onChange,
	parentProps,
	defaultValue,
}: {
	block: TBlockProps,
	parentProps: Object,
	value: string | void,
	defaultValue?: string,
	onChange: THandleOnChangeAttributes,
}): MixedElement => {
	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'font-size'),
				value,
			}}
		>
			<InputControl
				controlName="input"
				label={__('Font Size', 'publisher-core')}
				columns="columns-2"
				{...{
					...parentProps,
					unitType: 'essential',
					range: true,
					min: 0,
					max: 200,
					defaultValue,
					onChange: (newValue) =>
						onChange(
							'publisherFontSize',
							String(newValue),
							'',
							(
								attributes: Object,
								setAttributes: (attributes: Object) => void
							) => {
								setAttributes({
									...attributes,
									fontSize: undefined,
								});
							}
						),
				}}
			/>
		</ControlContextProvider>
	);
};
