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
	ColorControl,
	InputControl,
	useControlContext,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import type { THandleOnChangeAttributes } from '../../types';

export const TextStroke = ({
	value,
	handleOnChangeAttributes,
	defaultValue,
	...props
}: {
	value: {
		width: string,
		color: string,
	},
	defaultValue: Object,
	handleOnChangeAttributes: THandleOnChangeAttributes,
}): MixedElement => {
	const {
		value: _value,
		attribute,
		blockName,
		resetToDefault,
	} = useControlContext({
		onChange: (newValue, ref) => {
			if ('reset' === ref?.current?.action) {
				handleOnChangeAttributes('publisherTextStroke', defaultValue, {
					ref,
				});
			} else {
				handleOnChangeAttributes('publisherTextStroke', newValue, {
					ref,
				});
			}
		},
		defaultValue,
	});

	const labelProps = {
		value: _value,
		attribute,
		blockName,
		resetToDefault,
		mode: 'advanced',
		path: attribute,
		defaultValue,
	};

	return (
		<BaseControl
			label={__('Text Stroke', 'publisher-core')}
			labelPopoverTitle={__('Text Stroke', 'publisher-core')}
			labelDescription={
				<>
					<p>
						{__(
							'It sets outline stroke to text characters, allowing customization of text appearance with a stroke color and width, enhancing visual impact and readability.',
							'publisher-core'
						)}
					</p>
					<p>
						{__(
							'This property is particularly useful for stylistic text effects, such as creating contrast against backgrounds or emphasizing headings, adding a creative touch to web typography.',
							'publisher-core'
						)}
					</p>
				</>
			}
			columns="columns-2"
			{...labelProps}
		>
			<ColorControl
				id={'color'}
				singularId={'color'}
				label={__('Color', 'publisher-core')}
				labelPopoverTitle={__('Text Stroke Color', 'publisher-core')}
				labelDescription={
					<>
						<p>
							{__(
								'It sets sets the color of the stroke around text characters to enhance text visibility and aesthetic appeal.',
								'publisher-core'
							)}
						</p>
					</>
				}
				columns="columns-2"
				defaultValue={defaultValue.color}
				onChange={(newValue, ref) => {
					if ('reset' === ref?.current?.action || newValue === '') {
						handleOnChangeAttributes(
							'publisherTextStroke',
							defaultValue,
							{ ref }
						);
					} else {
						handleOnChangeAttributes(
							'publisherTextStroke',
							{
								...value,
								color: newValue,
							},
							{ ref }
						);
					}
				}}
				{...props}
			/>

			{value.color && (
				<InputControl
					id={'width'}
					singularId={'width'}
					label={__('Width', 'publisher-core')}
					labelPopoverTitle={__(
						'Text Stroke Width',
						'publisher-core'
					)}
					labelDescription={
						<>
							<p>
								{__(
									'It sets sets the the thickness of the stroke around text characters.',
									'publisher-core'
								)}
							</p>
						</>
					}
					columns="columns-2"
					unitType="essential"
					defaultValue={defaultValue.width}
					onChange={(newValue, ref) => {
						if ('reset' === ref?.current?.action) {
							handleOnChangeAttributes(
								'publisherTextStroke',
								{
									...value,
									width: defaultValue.width,
								},
								{ ref }
							);
						} else {
							handleOnChangeAttributes(
								'publisherTextStroke',
								{
									...value,
									width: newValue,
								},
								{ ref }
							);
						}
					}}
				/>
			)}
		</BaseControl>
	);
};
