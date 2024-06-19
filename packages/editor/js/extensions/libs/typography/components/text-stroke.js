// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	BaseControl,
	ColorControl,
	InputControl,
	useControlContext,
} from '@blockera/controls';

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
				handleOnChangeAttributes('blockeraTextStroke', defaultValue, {
					ref,
				});
			} else {
				handleOnChangeAttributes('blockeraTextStroke', newValue, {
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
			label={__('Text Stroke', 'blockera')}
			labelPopoverTitle={__('Text Stroke', 'blockera')}
			labelDescription={
				<>
					<p>
						{__(
							'It sets outline stroke to text characters, allowing customization of text appearance with a stroke color and width, enhancing visual impact and readability.',
							'blockera'
						)}
					</p>
					<p>
						{__(
							'This property is particularly useful for stylistic text effects, such as creating contrast against backgrounds or emphasizing headings, adding a creative touch to web typography.',
							'blockera'
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
				label={__('Color', 'blockera')}
				labelPopoverTitle={__('Text Stroke Color', 'blockera')}
				labelDescription={
					<>
						<p>
							{__(
								'It sets sets the color of the stroke around text characters to enhance text visibility and aesthetic appeal.',
								'blockera'
							)}
						</p>
					</>
				}
				columns="columns-2"
				defaultValue={defaultValue.color}
				onChange={(newValue, ref) => {
					if ('reset' === ref?.current?.action || newValue === '') {
						handleOnChangeAttributes(
							'blockeraTextStroke',
							defaultValue,
							{ ref }
						);
					} else {
						handleOnChangeAttributes(
							'blockeraTextStroke',
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
					label={__('Width', 'blockera')}
					labelPopoverTitle={__('Text Stroke Width', 'blockera')}
					labelDescription={
						<>
							<p>
								{__(
									'It sets sets the the thickness of the stroke around text characters.',
									'blockera'
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
								'blockeraTextStroke',
								{
									...value,
									width: defaultValue.width,
								},
								{ ref }
							);
						} else {
							handleOnChangeAttributes(
								'blockeraTextStroke',
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
