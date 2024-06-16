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

/**
 * Internal dependencies
 */
import { Button } from '../../';
import type { TShapeProps } from '../types';

export const Shape = ({
	id,
	icon,
	selected = false,
	onClick,
}: TShapeProps): MixedElement => {
	return (
		<Button
			className={controlInnerClassNames(
				'shape',
				selected ? 'selected-item' : ''
			)}
			onClick={() => onClick(id)}
			label={sprintf(
				// translators: %s is the selected shape name for mask
				__('Shape: %s', 'blockera'),
				id
			)}
			showTooltip={true}
			{...(selected ? { isFocus: true, autoFocus: true } : {})}
		>
			{icon}
		</Button>
	);
};
