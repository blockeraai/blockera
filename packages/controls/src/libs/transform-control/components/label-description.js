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
					'publisher-core'
				)}
			</p>
			<p>
				{__(
					"it's used for animations, responsive layouts, and enhancing user interaction with creative visual elements.",
					'publisher-core'
				)}
			</p>
			<h3>
				<MoveIcon />
				{__('Move (Translate)', 'publisher-core')}
			</h3>
			<p>
				{__(
					'Repositions an element from its original place. Ideal for creating movement and transition effects.',
					'publisher-core'
				)}
			</p>
			<h3>
				<ScaleIcon />
				{__('Scale', 'publisher-core')}
			</h3>
			<p>
				{__(
					'Changes the size of an element. Essential for zoom effects and emphasizing elements.',
					'publisher-core'
				)}
			</p>

			<h3>
				<RotateIcon />
				{__('Rotate', 'publisher-core')}
			</h3>
			<p>
				{__(
					'Rotates an element around its center point. Useful for creating dynamic interactions like hover effects.',
					'publisher-core'
				)}
			</p>

			<h3>
				<SkewIcon />
				{__('Skew', 'publisher-core')}
			</h3>
			<p>
				{__(
					'Distorts elements along the X and Y axes.',
					'publisher-core'
				)}
			</p>
		</>
	);
}
