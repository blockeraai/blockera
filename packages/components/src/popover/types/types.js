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
	title?: any,
	onClose?: () => void,
	children?: any,
	className?: string,
	placement?: PopoverPlacement,
	resize?: boolean,
	shift?: boolean,
	flip?: boolean,
	animate?: boolean,
	offset?: number,
	closeButton?: boolean,
	titleButtonsRight?: any,
	titleButtonsLeft?: any,
};
