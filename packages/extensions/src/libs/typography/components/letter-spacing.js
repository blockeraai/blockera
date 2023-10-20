// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { ControlContextProvider, InputControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../../utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export const LetterSpacing = ({
	block,
	value,
	onChange,
	parentProps,
	defaultValue = '',
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
				name: generateExtensionId(block, 'letter-spacing'),
				value,
			}}
		>
			<InputControl
				controlName="input"
				columns="2fr 2.4fr"
				label={__('Letters', 'publisher-core')}
				{...{
					...parentProps,
					defaultValue,
					unitType: 'letter-spacing',
					onValidate: (newValue) => {
						return newValue;
					},
					onChange: (newValue) =>
						onChange(
							'publisherLetterSpacing',
							newValue,
							'',
							(
								attributes: Object,
								setAttributes: (attributes: Object) => void
							): void =>
								setAttributes({
									...attributes,
									style: {
										...(attributes?.style ?? {}),
										typography: {
											...(attributes?.style?.typography ??
												{}),
											letterSpacing: newValue,
										},
									},
								})
						),
				}}
			/>
		</ControlContextProvider>
	);
};
