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
	style = 'primary',
	size = 'normal',
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
	style: PropTypes.oneOf(['primary', 'secondary']),
	size: PropTypes.oneOf(['normal', 'small', 'extra-small']),
	align: PropTypes.oneOf(['left', 'center', 'right']),
	noBorder: PropTypes.bool,
	icon: PropTypes.element,
	props: PropTypes.object,
	className: PropTypes.string,
	children: PropTypes.element,
};
