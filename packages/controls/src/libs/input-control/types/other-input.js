// @flow

import type { Node } from 'react';

export type TOtherInput = {
	value: string,
	setValue: (value: string) => void,
	type: string,
	noBorder?: boolean,
	className?: string,
	disabled?: boolean,
	validator?: (value: string) => boolean,
	actions?: Node,
};
