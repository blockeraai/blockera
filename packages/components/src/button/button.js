/**
 *External dependencies
 */
import PropTypes from 'prop-types';

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
	noBorder = false,
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
				noBorder && 'no-border',
				className
			)}
			{...props}
		>
			{children}
		</WPButton>
	);
}

Button.propTypes = {
	size: PropTypes.string,
	style: PropTypes.string,
	align: PropTypes.string,
	props: PropTypes.object,
	className: PropTypes.string,
	children: PropTypes.element,
};
