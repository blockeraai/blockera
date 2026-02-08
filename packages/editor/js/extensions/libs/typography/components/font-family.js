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
import { getFontFamilies } from '../utils';

export const FontFamily = ({
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
				name: generateExtensionId(block, 'font-family'),
				value,
				attribute: 'blockeraFontFamily',
				blockName: block.blockName,
			}}
		>
			<SelectControl
				label={__('Font Family', 'blockera')}
				labelDescription={
					<>
						<p>
							{__(
								'Allows you to set the font family for text content, giving you control over the typography style.',
								'blockera'
							)}
						</p>
						<p>
							{__(
								'You can choose from system fonts or custom web fonts to match your site’s branding and design aesthetic.',
								'blockera'
							)}
						</p>
						<p>
							{__(
								'For consistent styling across your website, it’s recommended to use fonts from your design system or predefined options.',
								'blockera'
							)}
						</p>
					</>
				}
				columns="columns-2"
				options={getFontFamilies()}
				type="native"
				defaultValue={defaultValue}
				onChange={(newValue, ref) =>
					onChange('blockeraFontFamily', newValue, { ref })
				}
				{...props}
			/>
		</ControlContextProvider>
	);
};
