// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { SelectControl, ControlContextProvider } from '@blockera/controls';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import { generateExtensionId } from '../../utils';
import { blendModeFieldOptions } from '../utils';

export const Blending = ({
	blendMode,
	block,
	handleOnChangeAttributes,
	defaultValue,
	...props
}: {
	blendMode: string | void,
	block: TBlockProps,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	defaultValue: string,
}): MixedElement => {
	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'blend-mode'),
				value: blendMode,
				attribute: 'blockeraBlendMode',
				blockName: block.blockName,
			}}
		>
			<SelectControl
				controlName="select"
				label={__('Blending', 'blockera-core')}
				labelPopoverTitle={__('Mix Blending Mode', 'blockera-core')}
				labelDescription={
					<>
						<p>
							{__(
								"It specifies how the block's content blends with its background.",
								'blockera-core'
							)}
						</p>
						<p>
							{__(
								'It allows for various visual effects by altering the way colors mix between blocks and their backgrounds.',
								'blockera-core'
							)}
						</p>
						<h3>{__('Normal', 'blockera-core')}</h3>
						<p>
							{__(
								'Default blending. Elements are rendered without blending.',
								'blockera-core'
							)}
						</p>
						<h3>{__('Darken', 'blockera-core')}</h3>
						<p>
							{__(
								'Selects the darker of the base or blend color.',
								'blockera-core'
							)}
						</p>
						<h3>{__('Multiply', 'blockera-core')}</h3>
						<p>
							{__(
								'Colors are multiplied, resulting in a darker effect. Useful for burning or shading.',
								'blockera-core'
							)}
						</p>
						<h3>{__('Lighten', 'blockera-core')}</h3>
						<p>
							{__(
								'Selects the lighter of the base or blend color.',
								'blockera-core'
							)}
						</p>
						<h3>{__('Screen', 'blockera-core')}</h3>
						<p>
							{__(
								'Colors are inverted, multiplied, and inverted again. Creates a lighter effect.',
								'blockera-core'
							)}
						</p>
						<h3>{__('Overlay', 'blockera-core')}</h3>
						<p>
							{__(
								'Combines "Multiply" and "Screen". Dark parts get darker, and light parts get lighter.',
								'blockera-core'
							)}
						</p>
						<h3>{__('Soft Light', 'blockera-core')}</h3>
						<p>
							{__(
								'Soft version of "Hard Light", more subdued blending.',
								'blockera-core'
							)}
						</p>
						<h3>{__('Soft Light', 'blockera-core')}</h3>
						<p>
							{__(
								'Similar to "Overlay", but with the base and blend colors swapped.',
								'blockera-core'
							)}
						</p>
						<h3>{__('Difference', 'blockera-core')}</h3>
						<p>
							{__(
								'Subtracts the darker color from the lighter color.',
								'blockera-core'
							)}
						</p>
						<h3>{__('Exclusion', 'blockera-core')}</h3>
						<p>
							{__(
								'Similar to "Difference", but with lower contrast.',
								'blockera-core'
							)}
						</p>
						<h3>{__('Hue', 'blockera-core')}</h3>
						<p>
							{__(
								'Blends the hue of the blend color with the saturation and luminosity of the base color.',
								'blockera-core'
							)}
						</p>
						<h3>{__('Color', 'blockera-core')}</h3>
						<p>
							{__(
								'Combines the hue and saturation of the blend color with the luminosity of the base color.',
								'blockera-core'
							)}
						</p>
						<h3>{__('Saturation', 'blockera-core')}</h3>
						<p>
							{__(
								'Uses the saturation of the blend color with the hue and luminosity of the base color.',
								'blockera-core'
							)}
						</p>
						<h3>{__('Color Dodge', 'blockera-core')}</h3>
						<p>
							{__(
								'Brightens the base color to reflect the blend color.',
								'blockera-core'
							)}
						</p>
						<h3>{__('Color Burn', 'blockera-core')}</h3>
						<p>
							{__(
								'Darkens the base color to reflect the blend color.',
								'blockera-core'
							)}
						</p>
						<h3>{__('Luminosity', 'blockera-core')}</h3>
						<p>
							{__(
								'Keeps the luminosity of the base color while adopting the hue and saturation of the blend color.',
								'blockera-core'
							)}
						</p>
						<h3>{__('Inherit', 'blockera-core')}</h3>
						<p>
							{__(
								'Blending inherit from parent container block.',
								'blockera-core'
							)}
						</p>
					</>
				}
				columns="columns-2"
				options={blendModeFieldOptions()}
				onChange={(newValue, ref) =>
					handleOnChangeAttributes('blockeraBlendMode', newValue, {
						ref,
					})
				}
				type="custom"
				customMenuPosition="top"
				defaultValue={defaultValue}
				{...props}
			/>
		</ControlContextProvider>
	);
};
