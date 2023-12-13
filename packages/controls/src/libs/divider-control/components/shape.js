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
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import type { TShapeProps } from '../types';

export const Shape = ({
	id,
	icon,
	selected,
	onClick,
	isBottom,
}: TShapeProps): MixedElement => {
	return (
		<div
			className={`${controlInnerClassNames('shape')} ${
				selected ? 'selected' : ''
			} ${isBottom ? 'bottom' : ''}`}
			onClick={() => onClick(id)}
			aria-label={
				// translators: it's the aria label for shape item
				sprintf(__('Icon %d', 'publisher-core'), id)
			}
		>
			{icon}
		</div>
	);
};
