//@flow

/**
 * Internal dependencies
 */
import type { FlexProps } from '../../flex/types';

export type ButtonsProps = {
	...FlexProps,
};

export type ButtonProps = {
	/**
	 * Sets the style of button, `primary` is the style with
	 * background and `secondary` is outlined button style.
	 */
	variant?: 'primary' | 'secondary' | 'tertiary' | 'link',
	/**
	 * Sets the size of button.
	 */
	size?: 'small' | 'medium' | 'large',
	/**
	 * It is useful for buttons with specified width and allows
	 * you to align the content to `left` or `right`.
	 *
	 * By default, it's `center` and handled by flex justify-content property.
	 */
	contentAlign?: 'left' | 'center' | 'right',
	noBorder?: boolean,
	/**
	 * Indicates permanent focus style on button.
	 * By setting this prop the toggle-class also will be added
	 * to component even if the value was `false`.
	 */
	isFocus?: boolean | void,
	/**
	 * 🔗 WP Button → If provided, renders an Icon component inside the button.
	 */
	icon?: any,
	/**
	 * 🔗 WP Button → If provided with `icon`, sets the position of icon relative to the `text`.
	 *
	 * @default 'left'
	 */
	iconPosition?: 'left' | 'right',
	/**
	 * 🔗 WP Button → If provided with `icon`, sets the icon size.
	 * Please refer to the Icon component for more details regarding
	 * the default value of its `size` prop.
	 */
	iconSize?: number,
	/**
	 * 🔗 WP Button → Indicates activity while a action is being performed.
	 */
	isBusy?: boolean,
	/**
	 * 🔗 WP Button → Renders a red text-based button style to indicate destructive behavior.
	 */
	isDestructive?: boolean,
	/**
	 * 🔗 WP Button → Renders a pressed button style.
	 */
	isPressed?: boolean,
	/**
	 * 🔗 WP Button → If provided with `showTooltip`, appends the Shortcut label to the tooltip content.
	 * If an object is provided, it should contain `display` and `ariaLabel` keys.
	 */
	shortcut?: string | Shortcut,
	/**
	 * 🔗 WP Button → If provided, renders a Tooltip component for the button.
	 */
	showTooltip?: boolean,
	/**
	 * 🔗 WP Button → If provided, sets the position of the Tooltip relative to the button.
	 */
	tooltipPosition?: 'left' | 'top' | 'bottom' | 'right',
	/**
	 * 🔗 WP Button → If provided, displays the given text inside the button. If the button contains children elements, the text is displayed before them.
	 */
	text?: string,
	className?: string,
	children?: any,
};

type Shortcut = {
	display?: string,
	ariaLabel?: string,
};
