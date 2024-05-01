// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import TypeImageIcon from '../icons/type-image';
import TypePatternIcon from '../icons/type-pattern';
import TypeSlideshowIcon from '../icons/type-slideshow';
import TypeVideoIcon from '../icons/type-video';
import TypeLinearGradientIcon from '../icons/type-linear-gradient';
import TypeRadialGradientIcon from '../icons/type-radial-gradient';
import TypeMeshGradientIcon from '../icons/type-mesh-gradient';

export function LabelDescription(): MixedElement {
	return (
		<>
			<p>
				{__(
					"It is a versatile feature that sets the visual appearance of block's background from a wide range of advanced options.",
					'blockera'
				)}
			</p>
			<h3>
				<TypeImageIcon />
				{__('Image', 'blockera')}
			</h3>
			<p>
				{__(
					'Sets an image as the background of an element, ideal for adding visual interest or branding elements.',
					'blockera'
				)}
			</p>
			<h3>
				<TypePatternIcon />
				{__('Image Pattern', 'blockera')}
				<span>{__('Coming soon…', 'blockera')}</span>
			</h3>
			<p>
				{__(
					'Repeats a small image to form a continuous pattern across the background.',
					'blockera'
				)}
			</p>

			<h3>
				<TypeSlideshowIcon />
				{__('Image Slideshow', 'blockera')}
				<span>{__('Coming soon…', 'blockera')}</span>
			</h3>
			<p>
				{__(
					'Rotates multiple images in the background, creating a slideshow effect.',
					'blockera'
				)}
			</p>
			<h3>
				<TypeVideoIcon />
				{__('Video', 'blockera')}
				<span>{__('Coming soon…', 'blockera')}</span>
			</h3>
			<p>
				{__(
					'Embeds a video as the background of an element, creating an immersive and dynamic visual experience.',
					'blockera'
				)}
			</p>
			<h3>
				<TypeLinearGradientIcon />
				{__('Linear Gradient', 'blockera')}
			</h3>
			<p>
				{__(
					'Creates a linear gradient as the background, transitioning smoothly between multiple colors.',
					'blockera'
				)}
			</p>
			<h3>
				<TypeRadialGradientIcon />
				{__('Radial Gradient', 'blockera')}
			</h3>
			<p>
				{__(
					'Generates a radial gradient as the background, emanating from a central point.',
					'blockera'
				)}
			</p>
			<h3>
				<TypeMeshGradientIcon />
				{__('Mesh Gradient', 'blockera')}
			</h3>
			<p>
				{__(
					'Mesh gradients are complex, multi-color gradients offering rich, realistic shading.',
					'blockera'
				)}
			</p>
		</>
	);
}
