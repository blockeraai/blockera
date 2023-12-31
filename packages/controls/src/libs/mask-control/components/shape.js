// @flow

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';
import { Button } from '@publisher/components';

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
				__('Icon %s', 'publisher-core'),
				id
			)}
		>
			{icon}
		</Button>
	);
};
