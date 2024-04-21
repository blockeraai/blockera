// @flow
/**
 * External Dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import BlurIcon from '../icons/blur';
import DropShadowIcon from '../icons/drop-shadow';
import BrightnessIcon from '../icons/brightness';
import ContrastIcon from '../icons/contrast';
import HueRotateIcon from '../icons/hue-rotate';
import SaturationIcon from '../icons/saturate';
import GrayscaleIcon from '../icons/grayscale';
import InvertIcon from '../icons/invert';
import SepiaIcon from '../icons/sepia';

export function FilterLabelDescription({
	labelDescription,
}: {
	labelDescription: MixedElement,
}): MixedElement {
	return (
		<>
			{labelDescription}
			<h3>
				<BlurIcon />
				{__('Blur', 'blockera-core')}
			</h3>
			<p>
				{__(
					'The Blur filter applies a Gaussian blur for softening the details and creating a hazy effect.',
					'blockera-core'
				)}
			</p>
			<h3>
				<DropShadowIcon />
				{__('Drop Shadow', 'blockera-core')}
			</h3>
			<p>
				{__(
					'Applies a shadow effect similar to a box-shadow but not for the box and for the contents of the block.',
					'blockera-core'
				)}
			</p>
			<p style={{ marginTop: '-7px' }}>
				{__(
					'It respects the alpha transparency of images and blocks, applying the shadow to the actual shape rather than the entire rectangular box.',
					'blockera-core'
				)}
			</p>
			<h3>
				<BrightnessIcon />
				{__('Brightness', 'blockera-core')}
			</h3>
			<p>
				{__('It adjusts the brightness of the block.', 'blockera-core')}
			</p>
			<h3>
				<ContrastIcon />
				{__('Contrast', 'blockera-core')}
			</h3>
			<p>
				{__('It adjusts the contrast of the block.', 'blockera-core')}
			</p>
			<h3>
				<HueRotateIcon />
				{__('Hue Rotate', 'blockera-core')}
			</h3>
			<p>
				{__(
					'It applies a hue shift to the colors of block.',
					'blockera-core'
				)}
			</p>
			<h3>
				<SaturationIcon />
				{__('Saturation', 'blockera-core')}
			</h3>
			<p>
				{__(
					'It adjusts the saturation level of block.',
					'blockera-core'
				)}
			</p>
			<h3>
				<GrayscaleIcon />
				{__('Grayscale', 'blockera-core')}
			</h3>
			<p>
				{__(
					'It converts the colors of a block to shades of gray.',
					'blockera-core'
				)}
			</p>
			<h3>
				<InvertIcon />
				{__('Invert', 'blockera-core')}
			</h3>
			<p>
				{__(
					'It inverts the colors of a block by swapping each color with its opposite on the color wheel, creating a negative effect.',
					'blockera-core'
				)}
			</p>
			<h3>
				<SepiaIcon />
				{__('Sepia', 'blockera-core')}
			</h3>
			<p>
				{__(
					'It applies a warm, brownish tone to block, mimicking the look of sepia-toned photographs.',
					'blockera-core'
				)}
			</p>
		</>
	);
}
