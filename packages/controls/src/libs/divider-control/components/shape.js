// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { Button } from '@blockera/components';
import { controlInnerClassNames } from '@blockera/classnames';

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
				__('Icon %s', 'blockera-core'),
				id
			)}
		>
			{icon}
		</Button>
	);
};
