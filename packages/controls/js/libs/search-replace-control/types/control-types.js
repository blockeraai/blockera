// @flow
/**
 * Internal dependencies
 */
import type { RepeaterControlProps } from '../../repeater-control/types';

export type TItem = {
	search: string,
	replace: string,
	isVisible: boolean,
};

export type TSearchReplaceControlProps = {
	...RepeaterControlProps,
	defaultValue?: [],
	defaultRepeaterItemValue?: TItem,
};
