// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';

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
				<Icon icon="transform-move" />
				{__('Move (Translate)', 'blockera')}
			</h3>
			<p>
				{__(
					'Repositions an element from its original place. Ideal for creating movement and transition effects.',
					'blockera'
				)}
			</p>

			<h3>
				<Icon icon="transform-scale" />
				{__('Scale', 'blockera')}
			</h3>
			<p>
				{__(
					'Changes the size of an element. Essential for zoom effects and emphasizing elements.',
					'blockera'
				)}
			</p>

			<h3>
				<Icon icon="transform-rotate" />
				{__('Rotate', 'blockera')}
			</h3>
			<p>
				{__(
					'Rotates an element around its center point. Useful for creating dynamic interactions like hover effects.',
					'blockera'
				)}
			</p>

			<h3>
				<Icon icon="transform-skew" />
				{__('Skew', 'blockera')}
			</h3>
			<p>{__('Distorts elements along the X and Y axes.', 'blockera')}</p>
		</>
	);
}
