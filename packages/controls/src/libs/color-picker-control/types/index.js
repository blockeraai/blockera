// @flow
export type Placement =
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

export type Props = {
	popoverTitle?: string,
	isOpen?: boolean,
	onClose?: () => void,
	placement?: Placement,
	isPopover?: boolean,
	hasClearBtn?: boolean,
	//
	id?: string,
	label?: string,
	columns?: string,
	defaultValue?: string,
	onChange?: () => void,
	field?: string,
	//
	className?: string,
};
