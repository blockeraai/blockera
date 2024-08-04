// @flow
/**
 * External Dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';

export function FilterLabelDescription({
	labelDescription,
}: {
	labelDescription: MixedElement,
}): MixedElement {
	return (
		<>
			{labelDescription}
			<h3>
				<Icon icon="filter-blur" iconSize="18" />
				{__('Blur', 'blockera')}
			</h3>
			<p>
				{__(
					'The Blur filter applies a Gaussian blur for softening the details and creating a hazy effect.',
					'blockera'
				)}
			</p>

			<h3>
				<Icon icon="filter-drop-shadow" iconSize="18" />
				{__('Drop Shadow', 'blockera')}
			</h3>
			<p>
				{__(
					'Applies a shadow effect similar to a box-shadow but not for the box and for the contents of the block.',
					'blockera'
				)}
			</p>
			<p style={{ marginTop: '-7px' }}>
				{__(
					'It respects the alpha transparency of images and blocks, applying the shadow to the actual shape rather than the entire rectangular box.',
					'blockera'
				)}
			</p>

			<h3>
				<Icon icon="filter-brightness" iconSize="18" />
				{__('Brightness', 'blockera')}
			</h3>
			<p>{__('It adjusts the brightness of the block.', 'blockera')}</p>

			<h3>
				<Icon icon="filter-contrast" iconSize="18" />
				{__('Contrast', 'blockera')}
			</h3>
			<p>{__('It adjusts the contrast of the block.', 'blockera')}</p>

			<h3>
				<Icon icon="filter-hue-rotate" iconSize="18" />
				{__('Hue Rotate', 'blockera')}
			</h3>
			<p>
				{__(
					'It applies a hue shift to the colors of block.',
					'blockera'
				)}
			</p>

			<h3>
				<Icon icon="filter-saturate" iconSize="18" />
				{__('Saturation', 'blockera')}
			</h3>
			<p>{__('It adjusts the saturation level of block.', 'blockera')}</p>

			<h3>
				<Icon icon="filter-grayscale" iconSize="18" />
				{__('Grayscale', 'blockera')}
			</h3>
			<p>
				{__(
					'It converts the colors of a block to shades of gray.',
					'blockera'
				)}
			</p>

			<h3>
				<Icon icon="filter-invert" iconSize="18" />
				{__('Invert', 'blockera')}
			</h3>
			<p>
				{__(
					'It inverts the colors of a block by swapping each color with its opposite on the color wheel, creating a negative effect.',
					'blockera'
				)}
			</p>

			<h3>
				<Icon icon="filter-sepia" iconSize="18" />
				{__('Sepia', 'blockera')}
			</h3>
			<p>
				{__(
					'It applies a warm, brownish tone to block, mimicking the look of sepia-toned photographs.',
					'blockera'
				)}
			</p>
		</>
	);
}
