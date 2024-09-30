// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __, _x } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { ControlContextProvider, SelectControl } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../../utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

const FONT_WEIGHTS = [
	{
		label: __('Default', 'blockera'),
		value: '',
	},
	{
		label: _x('100 - Thin', 'font weight', 'blockera'),
		value: '100',
	},
	{
		label: _x('200 - Extra Light', 'font weight', 'blockera'),
		value: '200',
	},
	{
		label: _x('300 - Light', 'font weight', 'blockera'),
		value: '300',
	},
	{
		label: _x('400 - Regular', 'font weight', 'blockera'),
		value: '400',
	},
	{
		label: _x('500 - Medium', 'font weight', 'blockera'),
		value: '500',
	},
	{
		label: _x('600 - Semi Bold', 'font weight', 'blockera'),
		value: '600',
	},
	{
		label: _x('700 - Bold', 'font weight', 'blockera'),
		value: '700',
	},
	{
		label: _x('800 - Extra Bold', 'font weight', 'blockera'),
		value: '800',
	},
	{
		label: _x('900 - Black', 'font weight', 'blockera'),
		value: '900',
	},
	{
		label: _x('1000 - Extra Black', 'font weight', 'blockera'),
		value: '1000',
	},
];

export const FontWeight = ({
	block,
	value,
	onChange,
	defaultValue,
	...props
}: {
	block: TBlockProps,
	value: string | void,
	defaultValue?: string,
	onChange: THandleOnChangeAttributes,
}): MixedElement => {
	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'font-weight'),
				value,
				attribute: 'blockeraFontWeight',
				blockName: block.blockName,
			}}
		>
			<SelectControl
				label={__('Font Weight', 'blockera')}
				labelDescription={
					<>
						<p>
							{__(
								'Adjusts the thickness of the font, providing flexibility in the visual impact of your text.',
								'blockera'
							)}
						</p>
						<p>
							{__(
								'Font weight can be used to create emphasis, hierarchy, and contrast within your design.',
								'blockera'
							)}
						</p>
						<p>
							{__(
								'Lighter weights create a more delicate appearance, while bolder weights draw attention to important elements.',
								'blockera'
							)}
						</p>
					</>
				}
				columns="columns-2"
				options={FONT_WEIGHTS}
				type="native"
				defaultValue={defaultValue}
				onChange={(newValue, ref) =>
					onChange('blockeraFontWeight', newValue, { ref })
				}
				{...props}
			/>
		</ControlContextProvider>
	);
};
