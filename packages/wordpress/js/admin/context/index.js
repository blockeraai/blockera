// @flow

/**
 * External dependencies
 */
import { createContext } from '@wordpress/element';

export const SettingsContext: {
	Provider: Object,
	Consumer: Object,
	displayName?: string | void,
} = createContext({});
