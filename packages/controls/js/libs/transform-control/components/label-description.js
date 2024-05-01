// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import MoveIcon from '../icons/move';
import ScaleIcon from '../icons/scale';
import RotateIcon from '../icons/rotate';
import SkewIcon from '../icons/skew';

export function LabelDescription(): MixedElement {
	return (
		<>
			<p>
				{__(
					'The transform applies a variety of visual manipulations to a block without altering the document flow.',
					'blockera'
				)}
			</p>
			<p>
				{__(
					"it's used for animations, responsive layouts, and enhancing user interaction with creative visual elements.",
					'blockera'
				)}
			</p>
			<h3>
				<MoveIcon />
				{__('Move (Translate)', 'blockera')}
			</h3>
			<p>
				{__(
					'Repositions an element from its original place. Ideal for creating movement and transition effects.',
					'blockera'
				)}
			</p>
			<h3>
				<ScaleIcon />
				{__('Scale', 'blockera')}
			</h3>
			<p>
				{__(
					'Changes the size of an element. Essential for zoom effects and emphasizing elements.',
					'blockera'
				)}
			</p>

			<h3>
				<RotateIcon />
				{__('Rotate', 'blockera')}
			</h3>
			<p>
				{__(
					'Rotates an element around its center point. Useful for creating dynamic interactions like hover effects.',
					'blockera'
				)}
			</p>

			<h3>
				<SkewIcon />
				{__('Skew', 'blockera')}
			</h3>
			<p>{__('Distorts elements along the X and Y axes.', 'blockera')}</p>
		</>
	);
}
