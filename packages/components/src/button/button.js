/**
 * WordPress dependencies
 */
import { Button as WPButton } from '@wordpress/components';

/**
 * Publisher dependencies
 */
import { componentClassNames } from '@publisher/classnames';

export default function Button({
	size = 'normal',
	style = 'primary',
	align = 'left',
	//
	className,
	children,
	...props
}) {
	return (
		<WPButton
			className={componentClassNames(
				'button',
				'size-' + size,
				'style-' + style,
				'align-' + align,
				className
			)}
			{...props}
		>
			{children}
		</WPButton>
	);
}
