/**
 * WordPress dependencies
 */
import { Popover as WPPopover } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { componentClassNames } from '@publisher/classnames';

export default function Popover({ children, className, ...props }) {
	return (
		<WPPopover
			className={componentClassNames('popover', className)}
			{...props}
		>
			{children}
		</WPPopover>
	);
}
