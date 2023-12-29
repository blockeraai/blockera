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
				{__('Blur', 'publisher-core')}
			</h3>
			<p>
				{__(
					'The Blur filter applies a Gaussian blur for softening the details and creating a hazy effect.',
					'publisher-core'
				)}
			</p>
			<h3>
				<DropShadowIcon />
				{__('Drop Shadow', 'publisher-core')}
			</h3>
			<p>
				{__(
					'Applies a shadow effect similar to a box-shadow but not for the box and for the contents of the block.',
					'publisher-core'
				)}
			</p>
			<p style={{ marginTop: '-7px' }}>
				{__(
					'It respects the alpha transparency of images and blocks, applying the shadow to the actual shape rather than the entire rectangular box.',
					'publisher-core'
				)}
			</p>
			<h3>
				<BrightnessIcon />
				{__('Brightness', 'publisher-core')}
			</h3>
			<p>
				{__(
					'It adjusts the brightness of the block.',
					'publisher-core'
				)}
			</p>
			<h3>
				<ContrastIcon />
				{__('Contrast', 'publisher-core')}
			</h3>
			<p>
				{__('It adjusts the contrast of the block.', 'publisher-core')}
			</p>
			<h3>
				<HueRotateIcon />
				{__('Hue Rotate', 'publisher-core')}
			</h3>
			<p>
				{__(
					'It applies a hue shift to the colors of block.',
					'publisher-core'
				)}
			</p>
			<h3>
				<SaturationIcon />
				{__('Saturation', 'publisher-core')}
			</h3>
			<p>
				{__(
					'It adjusts the saturation level of block.',
					'publisher-core'
				)}
			</p>
			<h3>
				<GrayscaleIcon />
				{__('Grayscale', 'publisher-core')}
			</h3>
			<p>
				{__(
					'It converts the colors of a block to shades of gray.',
					'publisher-core'
				)}
			</p>
			<h3>
				<InvertIcon />
				{__('Invert', 'publisher-core')}
			</h3>
			<p>
				{__(
					'It inverts the colors of a block by swapping each color with its opposite on the color wheel, creating a negative effect.',
					'publisher-core'
				)}
			</p>
			<h3>
				<SepiaIcon />
				{__('Sepia', 'publisher-core')}
			</h3>
			<p>
				{__(
					'It applies a warm, brownish tone to block, mimicking the look of sepia-toned photographs.',
					'publisher-core'
				)}
			</p>
		</>
	);
}
