/**
 * External dependencies
 */
import { createContext } from '@wordpress/element';

export const PopoverContextData = createContext({
	onFocusOutside: null,
	shift: undefined,
	resize: undefined,
	flip: undefined,
});
