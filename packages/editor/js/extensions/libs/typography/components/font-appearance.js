// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { ControlContextProvider, SelectControl } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../../utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import {
	getFontAppearanceObject,
	getFontAppearanceId,
	fontAppearancesOptions,
} from '../utils';

export const FontAppearance = ({
	block,
	value,
	onChange,
	defaultValue,
	...props
}: {
	block: TBlockProps,
	value: Object | void,
	defaultValue?: string,
	onChange: THandleOnChangeAttributes,
}): MixedElement => {
	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'font-appearance'),
				value: getFontAppearanceId(value),
				attribute: 'blockeraFontAppearance',
				blockName: block.blockName,
			}}
		>
			<SelectControl
				label={__('Appearance', 'blockera')}
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
				options={fontAppearancesOptions}
				type="native"
				defaultValue={defaultValue}
				onChange={(newValue, ref) =>
					onChange(
						'blockeraFontAppearance',
						getFontAppearanceObject(newValue),
						{ ref }
					)
				}
				{...props}
			/>
		</ControlContextProvider>
	);
};
