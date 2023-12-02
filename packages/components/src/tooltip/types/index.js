// @flow
import type { Node } from 'react';

export type TTooltipItem = {
	className?: string,
	children: Node,
	delay?: number,
	hideOnClick?: boolean,
	placement?:
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
		| 'left-end',
	position?: string,
	shortcut?: string | Object,
	text?: string,
};
