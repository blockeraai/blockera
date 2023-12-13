// @flow

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';

export const Shape = ({ id, icon, selected, onClick, bottom }) => {
	return (
		<div
			className={`${controlInnerClassNames('shape')} ${
				selected ? 'selected' : ''
			} ${bottom ? 'bottom' : ''}`}
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
