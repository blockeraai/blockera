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
					'blockera-core'
				)}
			</p>
			<p>
				{__(
					"it's used for animations, responsive layouts, and enhancing user interaction with creative visual elements.",
					'blockera-core'
				)}
			</p>
			<h3>
				<MoveIcon />
				{__('Move (Translate)', 'blockera-core')}
			</h3>
			<p>
				{__(
					'Repositions an element from its original place. Ideal for creating movement and transition effects.',
					'blockera-core'
				)}
			</p>
			<h3>
				<ScaleIcon />
				{__('Scale', 'blockera-core')}
			</h3>
			<p>
				{__(
					'Changes the size of an element. Essential for zoom effects and emphasizing elements.',
					'blockera-core'
				)}
			</p>

			<h3>
				<RotateIcon />
				{__('Rotate', 'blockera-core')}
			</h3>
			<p>
				{__(
					'Rotates an element around its center point. Useful for creating dynamic interactions like hover effects.',
					'blockera-core'
				)}
			</p>

			<h3>
				<SkewIcon />
				{__('Skew', 'blockera-core')}
			</h3>
			<p>
				{__(
					'Distorts elements along the X and Y axes.',
					'blockera-core'
				)}
			</p>
		</>
	);
}
