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
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue?: {},
	/**
	 * Default value of each repeater item
	 */
	defaultRepeaterItemValue?: TItem,
};
