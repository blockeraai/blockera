// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { extensionInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { CaretIcon } from '../icons';

export function Breadcrumb({
	states,
	children,
}: {
	states: Object,
	children?: MixedElement,
}): MixedElement {
	// do not show normal state
	if (states.length <= 1) {
		return <></>;
	}

	return (
		<>
			{states
				.filter(
					(value) => value?.isSelected && value?.type !== 'normal'
				)
				.map((value) => (
					<>
						<CaretIcon />
						<span
							className={extensionInnerClassNames(
								'block-card__title__item',
								'item-state',
								'item-state-' + value.type
							)}
						>
							{value.label}
						</span>
					</>
				))}
			{children}
		</>
	);
}
