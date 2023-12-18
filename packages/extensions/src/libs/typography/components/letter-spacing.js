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
				attribute: 'publisherLetterSpacing',
				blockName: block.blockName,
			}}
		>
			<InputControl
				controlName="input"
				columns="2fr 2.6fr"
				label={__('Letters', 'publisher-core')}
				{...{
					...parentProps,
					defaultValue,
					arrows: true,
					unitType: 'letter-spacing',
					onValidate: (newValue) => {
						return newValue;
					},
					onChange: (newValue) =>
						onChange('publisherLetterSpacing', newValue, {
							addOrModifyRootItems: {
								style: {
									...(block.attributes?.style ?? {}),
									typography: {
										...(block.attributes?.style
											?.typography ?? {}),
										letterSpacing: newValue,
									},
								},
							},
						}),
				}}
			/>
		</ControlContextProvider>
	);
};
