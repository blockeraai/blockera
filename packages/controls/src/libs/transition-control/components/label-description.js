// @flow
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';

export function LabelDescription(): MixedElement {
	return (
		<>
			<p>
				{__(
					'The Transition property in CSS enables smooth design and state changes in block over a specified duration.',
					'publisher-core'
				)}
			</p>
			<p>
				{__(
					"It's used to animate the change of a property's value, by all or custom properties like color, size, position, or opacity.",
					'publisher-core'
				)}
			</p>
			<p>
				{__(
					'Transitions are fundamental for enhancing user interaction by adding subtle animations to blocks.',
					'publisher-core'
				)}
			</p>
			<p>
				{__(
					'They make changes appear more natural and less abrupt, significantly improving the user experience in web interfaces.',
					'publisher-core'
				)}
			</p>
		</>
	);
}
