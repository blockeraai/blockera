// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

export type MenuItemProps = {
	/**
	 * A CSS `class` to give to the container element.
	 */
	className?: string,
	/**
	 * The children elements.
	 */
	children?: MixedElement,
	/**
	 * Text to use as description for button text.
	 */
	info?: string,
	/**
	 * The icon to render. Supported values are: Dashicons (specified as
	 * strings), functions, Component instances and `null`.
	 *
	 * @default null
	 */
	icon?: MixedElement | null,
	/**
	 * Determines where to display the provided `icon`.
	 */
	iconPosition?: any, // ButtonAsButtonProps['iconPosition']
	/**
	 * Whether or not the menu item is currently selected, `isSelected` is only taken into
	 * account when the `role` prop is either `"menuitemcheckbox"` or `"menuitemradio"`.
	 */
	isSelected?: boolean,
	/**
	 * If shortcut is a string, it is expecting the display text. If shortcut is an object,
	 * it will accept the properties of `display` (string) and `ariaLabel` (string).
	 */
	shortcut?: string | { display: string, ariaLabel: string },
	/**
	 * If you need to have selectable menu items use menuitemradio for single select,
	 * and menuitemcheckbox for multiselect.
	 *
	 * @default 'menuitem'
	 */
	role?: string,
	/**
	 * Allows for markup other than icons or shortcuts to be added to the menu item.
	 *
	 */
	suffix?: MixedElement,
	/**
	 * Human-readable label for item.
	 */
	label?: string,
	/**
	 * Whether the menu item is destructive.
	 */
	isDestructive?: boolean, // From Pick<ButtonAsButtonProps, 'isDestructive'>
	/**
	 * A callback function to invoke when the menu item is clicked.
	 */
	onClick?: (event: MouseEvent) => void,
	/**
	 * A style object to apply to the menu item.
	 */
	style?: Object,
	/**
	 * A test identifier to use for testing purposes.
	 */
	'data-test'?: string,
	/**
	 * A cypress identifier to use for cypress testing purposes.
	 */
	'data-cy'?: string,
	/**
	 * A data identifier to use for data purposes.
	 */
	'data-id'?: string,
};
