// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

export function LabelDescription(): MixedElement {
	return (
		<>
			<p>
				{__(
					'A state refers to the specific condition or appearance of a block based on user interaction or other factors.',
					'publisher-core'
				)}
			</p>
			<p>
				{__(
					'Different states allow blocks to change their style and behavior in response to actions like hovering, clicking, or focusing.',
					'publisher-core'
				)}
			</p>
			<p>
				{__(
					'This dynamic capability is crucial for creating interactive and responsive web interfaces.',
					'publisher-core'
				)}
			</p>
			<h3>{__('Normal', 'publisher-core')}</h3>
			<p>
				{__('The default appearance of the block.', 'publisher-core')}
			</p>
			<h3>{__('Hover', 'publisher-core')}</h3>
			<p>
				{__(
					'Customizations applied when the mouse cursor is over the block.',
					'publisher-core'
				)}
			</p>
			<h3>{__('Focus', 'publisher-core')}</h3>
			<p>
				{__(
					'Appearance changes when the block is in focus (typically used for form inputs, buttons, links and interactive content).',
					'publisher-core'
				)}
			</p>
			<h3>{__('Active', 'publisher-core')}</h3>
			<p>
				{__(
					'How the block appears when it is actively clicked or interacted with.',
					'publisher-core'
				)}
			</p>
			<h3>{__('Visited', 'publisher-core')}</h3>
			<p>
				{__(
					'Used primarily for links and buttons, this state reflects how a block appears after it has been visited.',
					'publisher-core'
				)}
			</p>
			<h3>{__('Before', 'publisher-core')}</h3>
			<p>
				{__(
					"Similar to the ::before pseudo-element in CSS, this state allows for adding decorative content before the block's content.",
					'publisher-core'
				)}
			</p>
			<h3>{__('After', 'publisher-core')}</h3>
			<p>
				{__(
					"Analogous to the ::after pseudo-element, it enables adding content or styling after the block's content.",
					'publisher-core'
				)}
			</p>
			<h3>{__('Custom Class', 'publisher-core')}</h3>
			<p>
				{__(
					'Provides styling options for the block when it has a specific user-defined class.',
					'publisher-core'
				)}
			</p>
			<p>
				{__(
					'Its useful to add custom class to block using interactive features to change the design of block dynamically.',
					'publisher-core'
				)}
			</p>
			<h3>{__('Parent Class', 'publisher-core')}</h3>
			<p>
				{__(
					'Allows customization of the block based on a class applied to its parent block.',
					'publisher-core'
				)}
			</p>
			<p>
				{__(
					'Its useful to add custom class to parent block using interactive features to change the design of this block dynamically.',
					'publisher-core'
				)}
			</p>
			<h3>{__('Parent Hover', 'publisher-core')}</h3>
			<p>
				{__(
					'Defines how the block should look when its parent block is hovered over.',
					'publisher-core'
				)}
			</p>
		</>
	);
}
