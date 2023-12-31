// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { Button } from '@publisher/components';
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
		<Button
			className={controlInnerClassNames(
				'shape',
				selected ? 'is-focus' : '',
				isBottom ? 'bottom' : ''
			)}
			onClick={() => onClick(id)}
			aria-label={sprintf(
				// translators: %s is a shape name.
				__('Icon %s', 'publisher-core'),
				id
			)}
		>
			{icon}
		</Button>
	);
};
