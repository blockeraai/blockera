// @flow
import type { Node, MixedElement } from 'react';

export type TooltipPlacement =
	| 'top'
	| 'top-start'
	| 'top-end'
	| 'right'
	| 'right-start'
	| 'right-end'
	| 'bottom'
	| 'bottom-start'
	| 'bottom-end'
	| 'left'
	| 'left-start'
	| 'left-end';

export type TTooltipItem = {
	/**
	 * CSS classes to apply to the tooltip.
	 */
	className?: string,
	/**
	 * Inner items to display in the tooltip.
	 */
	children: Node,
	/**
	 * The amount of time in milliseconds to wait before showing the tooltip.
	 *
	 * default: 600
	 */
	delay?: number,
	/**
	 * Option to hide the tooltip when the anchor is clicked.
	 *
	 * default: true
	 */
	hideOnClick?: boolean,
	/**
	 * Used to specify the tooltip’s placement with respect to its anchor.
	 *
	 * default: top
	 */
	placement?: TooltipPlacement,
	/**
	 * Legacy way to specify the popover’s position with respect to its anchor. Specify y- and x-axis as a space-separated string. Supports 'top', 'middle', 'bottom' y axis, and 'left', 'center', 'right' x axis.
	 */
	position?: string,
	/**
	 * If shortcut is a string, it is expecting the display text. If shortcut is an object, it will accept the properties of display: string and ariaLabel: string.
	 */
	shortcut?: string | Object,
	/**
	 * The text shown in the tooltip when anchor element is focused or hovered.
	 */
	text?: string | MixedElement,
};
