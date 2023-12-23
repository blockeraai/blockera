// @flow

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { TShapeProps } from '../types';

export const Shape = ({
	id,
	icon,
	selected,
	onClick,
}: TShapeProps): MixedElement => {
	return (
		<div
			className={`shape ${selected ? 'selected' : ''}`}
			onClick={() => onClick(id)}
			aria-label={sprintf(
				// translators: it's the aria label for shape item
				__('Icon %s', 'publisher-core'),
				id
			)}
		>
			{icon}
		</div>
	);
};
