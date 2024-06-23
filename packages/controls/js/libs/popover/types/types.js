// @flow

export type PopoverPlacement =
	| 'top-start'
	| 'top'
	| 'top-end'
	| 'right-start'
	| 'right'
	| 'right-end'
	| 'bottom-start'
	| 'bottom'
	| 'bottom-end'
	| 'left-start'
	| 'left'
	| 'left-end';

export type TPopoverProps = {
	/**
	 * Popover Title
	 */
	title?: any,
	/**
	 * Event that would be called while closing popover.
	 */
	onClose?: () => void,
	children?: any,
	className?: string,
	/**
	 * Used to specify the popover's position with respect to its anchor.
	 *
	 * @default 'bottom-start'
	 */
	placement?: PopoverPlacement,
	/**
	 * Adjusts the size of the popover to prevent its contents from going out of
	 * view when meeting the viewport edges.
	 *
	 * @default true
	 */
	resize?: boolean,
	/**
	 * Enables the `Popover` to shift in order to stay in view when meeting the
	 * viewport edges.
	 *
	 * @default false
	 */
	shift?: boolean,
	/**
	 * Specifies whether the popover should flip across its axis if there isn't
	 * space for it in the normal placement.
	 * When the using a 'top' placement, the popover will switch to a 'bottom'
	 * placement. When using a 'left' placement, the popover will switch to a
	 * `right' placement.
	 * The popover will retain its alignment of 'start' or 'end' when flipping.
	 *
	 * @default true
	 */
	flip?: boolean,
	/**
	 * Whether the popover should animate when opening.
	 *
	 * @default true
	 */
	animate?: boolean,
	/**
	 * The distance (in px) between the anchor and the popover.
	 */
	offset?: number,
	closeButton?: boolean,
	titleButtonsRight?: any,
	titleButtonsLeft?: any,
	focusOnMount?: 'firstElement' | boolean,
	'data-test'?: string,
};
