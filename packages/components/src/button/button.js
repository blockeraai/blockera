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
	variant,
	size,
	contentAlign,
	noBorder,
	isFocus,
	className,
	children,
	//
	...props
}) {
	return (
		<WPButton
			className={componentClassNames(
				'button',
				'size-' + size,
				'variant-' + variant,
				contentAlign && 'content-align-' + contentAlign,
				noBorder && 'no-border',
				// eslint-disable-next-line no-nested-ternary
				isFocus !== null
					? isFocus
						? 'is-focus toggle-focus'
						: 'toggle-focus'
					: '',
				className
			)}
			variant={variant}
			{...props}
		>
			{children}
		</WPButton>
	);
}

Button.propTypes = {
	/**
	 * Sets the style of button, `primary` is the style with background and `secondary` is outlined button style.
	 */
	variant: PropTypes.oneOf(['primary', 'secondary', 'tertiary', 'link']),
	/**
	 * Sets the size of button.
	 */
	size: PropTypes.oneOf(['normal', 'small', 'extra-small', 'input']),
	/**
	 * It is useful for buttons with specified width and allows you to align the content to `left` or `right`. By default, it's `center` and handled by flex justify-content property.
	 */
	contentAlign: PropTypes.oneOf(['left', 'center', 'right']),
	/**
	 * It is useful for buttons with specified width and allows you to align the content to `left` or `right`. By default, it's `center` and handled by flex justify-content property.
	 */
	noBorder: PropTypes.bool,
	/**
	 * Indicates permanent focus style on button. By setting this prop the toggle-class also will be added to component even if the value was `false`.
	 */
	isFocus: PropTypes.bool,
	/**
	 * WP Button Props 👇
	 */
	/**
	 * 🔗 WP Button → If provided, renders an Icon component inside the button.
	 */
	icon: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
	/**
	 * 🔗 WP Button → If provided with `icon`, sets the position of icon relative to the `text`.
	 *
	 * @default 'left'
	 */
	iconPosition: PropTypes.oneOf(['left', 'right']),
	/**
	 * 🔗 WP Button → If provided with `icon`, sets the icon size.
	 * Please refer to the Icon component for more details regarding
	 * the default value of its `size` prop.
	 */
	iconSize: PropTypes.number,
	/**
	 * 🔗 WP Button → Indicates activity while a action is being performed.
	 */
	isBusy: PropTypes.bool,
	/**
	 * 🔗 WP Button → Renders a red text-based button style to indicate destructive behavior.
	 */
	isDestructive: PropTypes.bool,
	/**
	 * 🔗 WP Button → Renders a pressed button style.
	 */
	isPressed: PropTypes.bool,
	/**
	 * 🔗 WP Button → Sets the `aria-label` of the component, if none is provided.
	 * Sets the Tooltip content if `showTooltip` is provided.
	 */
	label: PropTypes.string,
	/**
	 * 🔗 WP Button → If provided with `showTooltip`, appends the Shortcut label to the tooltip content.
	 * If an object is provided, it should contain `display` and `ariaLabel` keys.
	 */
	shortcut: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.shape({
			display: PropTypes.string,
			ariaLabel: PropTypes.string,
		}),
	]),
	/**
	 * 🔗 WP Button → If provided, renders a Tooltip component for the button.
	 */
	showTooltip: PropTypes.bool,
	/**
	 * 🔗 WP Button → If provided, displays the given text inside the button. If the button contains children elements, the text is displayed before them.
	 */
	text: PropTypes.string,
};

Button.defaultProps = {
	variant: 'tertiary',
	size: 'normal',
	contentAlign: 'center',
	noBorder: false,
	isFocus: null,
	tooltipPosition: 'top',
};
