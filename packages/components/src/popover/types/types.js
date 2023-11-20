// @flow
import type { Element } from 'react';
export type TPopoverProps = {
	title?: string | Element<any>,
	onClose: () => {},
	children?: string | Element<any>,
	className?: string,
	placement?:
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
		| 'left-end',
	resize?: boolean,
	shift?: boolean,
	flip?: boolean,
	animate?: boolean,
	offset?: number,
};
