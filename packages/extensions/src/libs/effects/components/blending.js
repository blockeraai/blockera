// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { SelectControl, ControlContextProvider } from '@publisher/controls';

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
				attribute: 'publisherBlendMode',
				blockName: block.blockName,
			}}
		>
			<SelectControl
				controlName="select"
				label={__('Blending', 'publisher-core')}
				labelPopoverTitle={__('Mix Blending Mode', 'publisher-core')}
				labelDescription={
					<>
						<p>
							{__(
								"It specifies how the block's content blends with its background.",
								'publisher-core'
							)}
						</p>
						<p>
							{__(
								'It allows for various visual effects by altering the way colors mix between blocks and their backgrounds.',
								'publisher-core'
							)}
						</p>
						<h3>{__('Normal', 'publisher-core')}</h3>
						<p>
							{__(
								'Default blending. Elements are rendered without blending.',
								'publisher-core'
							)}
						</p>
						<h3>{__('Darken', 'publisher-core')}</h3>
						<p>
							{__(
								'Selects the darker of the base or blend color.',
								'publisher-core'
							)}
						</p>
						<h3>{__('Multiply', 'publisher-core')}</h3>
						<p>
							{__(
								'Colors are multiplied, resulting in a darker effect. Useful for burning or shading.',
								'publisher-core'
							)}
						</p>
						<h3>{__('Lighten', 'publisher-core')}</h3>
						<p>
							{__(
								'Selects the lighter of the base or blend color.',
								'publisher-core'
							)}
						</p>
						<h3>{__('Screen', 'publisher-core')}</h3>
						<p>
							{__(
								'Colors are inverted, multiplied, and inverted again. Creates a lighter effect.',
								'publisher-core'
							)}
						</p>
						<h3>{__('Overlay', 'publisher-core')}</h3>
						<p>
							{__(
								'Combines "Multiply" and "Screen". Dark parts get darker, and light parts get lighter.',
								'publisher-core'
							)}
						</p>
						<h3>{__('Soft Light', 'publisher-core')}</h3>
						<p>
							{__(
								'Soft version of "Hard Light", more subdued blending.',
								'publisher-core'
							)}
						</p>
						<h3>{__('Soft Light', 'publisher-core')}</h3>
						<p>
							{__(
								'Similar to "Overlay", but with the base and blend colors swapped.',
								'publisher-core'
							)}
						</p>
						<h3>{__('Difference', 'publisher-core')}</h3>
						<p>
							{__(
								'Subtracts the darker color from the lighter color.',
								'publisher-core'
							)}
						</p>
						<h3>{__('Exclusion', 'publisher-core')}</h3>
						<p>
							{__(
								'Similar to "Difference", but with lower contrast.',
								'publisher-core'
							)}
						</p>
						<h3>{__('Hue', 'publisher-core')}</h3>
						<p>
							{__(
								'Blends the hue of the blend color with the saturation and luminosity of the base color.',
								'publisher-core'
							)}
						</p>
						<h3>{__('Color', 'publisher-core')}</h3>
						<p>
							{__(
								'Combines the hue and saturation of the blend color with the luminosity of the base color.',
								'publisher-core'
							)}
						</p>
						<h3>{__('Saturation', 'publisher-core')}</h3>
						<p>
							{__(
								'Uses the saturation of the blend color with the hue and luminosity of the base color.',
								'publisher-core'
							)}
						</p>
						<h3>{__('Color Dodge', 'publisher-core')}</h3>
						<p>
							{__(
								'Brightens the base color to reflect the blend color.',
								'publisher-core'
							)}
						</p>
						<h3>{__('Color Burn', 'publisher-core')}</h3>
						<p>
							{__(
								'Darkens the base color to reflect the blend color.',
								'publisher-core'
							)}
						</p>
						<h3>{__('Luminosity', 'publisher-core')}</h3>
						<p>
							{__(
								'Keeps the luminosity of the base color while adopting the hue and saturation of the blend color.',
								'publisher-core'
							)}
						</p>
						<h3>{__('Inherit', 'publisher-core')}</h3>
						<p>
							{__(
								'Blending inherit from parent container block.',
								'publisher-core'
							)}
						</p>
					</>
				}
				columns="columns-2"
				options={blendModeFieldOptions()}
				onChange={(newValue, ref) =>
					handleOnChangeAttributes('publisherBlendMode', newValue, {
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
