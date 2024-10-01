/**
 * WordPress dependencies
 */
import { createContext } from '@wordpress/element';

export const ControlDataContext = createContext({
	controlValue: '',
	setControlValue: () => {},
});
