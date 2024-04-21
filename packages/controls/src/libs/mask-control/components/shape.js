// @flow

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { Button } from '@blockera/components';

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
		<Button
			className={controlInnerClassNames(
				'shape',
				selected ? 'selected' : ''
			)}
			onClick={() => onClick(id)}
			aria-label={sprintf(
				// translators: %s is the selected shape name for mask
				__('Icon %s', 'blockera-core'),
				id
			)}
		>
			{icon}
		</Button>
	);
};
