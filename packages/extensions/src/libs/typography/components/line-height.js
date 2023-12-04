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
	ControlContextProvider,
	InputControl,
	extractNumberAndUnit,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../../utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export const LineHeight = ({
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
				name: generateExtensionId(block, 'line-height'),
				value,
			}}
		>
			<InputControl
				controlName="input"
				label={__('Line Height', 'publisher-core')}
				columns="columns-2"
				{...{
					...parentProps,
					unitType: 'essential',
					range: true,
					min: 0,
					max: 100,
					defaultValue: defaultValue || '',
					onChange: (newValue) => {
						onChange(
							'publisherLineHeight',
							newValue,
							'',
							(
								attributes: Object,
								setAttributes: (attributes: Object) => void
							): void => {
								const extractedValue =
									extractNumberAndUnit(newValue);

								if (
									extractedValue.unit === '' ||
									(extractedValue.unit === 'func' &&
										extractedValue?.unitSimulated)
								) {
									setAttributes({
										...attributes,
										style: {
											...(attributes?.style ?? {}),
											typography: {
												...(attributes?.style
													?.typography ?? {}),
												lineHeight:
													extractedValue.value,
											},
										},
									});
								} else {
									// remove old lineHeight
									const newAttrs = { ...attributes };
									if (
										newAttrs?.style?.typography?.lineHeight
									) {
										delete newAttrs.style.typography
											.lineHeight;
										setAttributes(newAttrs);
									}
								}
							}
						);
					},
				}}
			/>
		</ControlContextProvider>
	);
};
