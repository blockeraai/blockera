// @flow
import type { Element } from 'react';
export type TPopoverProps = {
	title?: string | Element<any>,
	onClose: () => {},
	children?: string | Element<any>,
	className?: string,
	/* eslint-disable ft-flow/space-after-type-colon */
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
	closeButton?: boolean,
	titleButtonsRight?: string | Element<any>,
	titleButtonsLeft?: string | Element<any>,
};
