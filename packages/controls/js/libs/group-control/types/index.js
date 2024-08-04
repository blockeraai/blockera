// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

export type GroupControlMode = 'popover' | 'accordion' | 'nothing';

export type GroupControlProps = {
	/**
	 * The design style of group.
	 */
	design?: 'minimal',
	/**
	 * Add border outline for group while it's open?
	 * Please note it works only in accordion mode, and it's always active for popover mode
	 */
	toggleOpenBorder?: boolean,
	/**
	 * is group open by default or not
	 */
	isOpen?: boolean,
	/**
	 * The group open mode.
	 */
	mode: GroupControlMode,
	popoverTitle?: string | MixedElement,
	popoverTitleButtonsRight?: string | MixedElement,
	popoverClassName?: string,
	/**
	 * Text or component to show in group header.
	 */
	header?: string | MixedElement,
	/**
	 * Show group open close button?
	 */
	headerOpenButton?: boolean,
	/**
	 * Custom icon for header open/close button for opening it
	 */
	headerOpenIcon?: MixedElement,
	/**
	 * Custom icon for header open/close button for closing it
	 */
	headerCloseIcon?: MixedElement,
	/**
	 * Injection location for adding item in the beginning of the buttons (before open/close button)
	 */
	injectHeaderButtonsStart?: string | MixedElement,
	/**
	 * Injection location for adding item in the end of the buttons (after open/close button)
	 */
	injectHeaderButtonsEnd?: string | MixedElement,
	//
	children?: string | MixedElement,
	//
	className?: string,
	/**
	 * Function that will be fired while closing group
	 */
	onClose?: () => void,
	/**
	 * Function that will be fired while opening group
	 */
	onOpen?: () => void,
	onClick?: (event?: MouseEvent) => void | boolean,
};
