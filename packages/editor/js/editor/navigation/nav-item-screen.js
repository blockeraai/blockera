// @flow

/**
 * External dependencies
 */
import { type MixedElement } from 'react';
import { Navigator } from '@wordpress/components';

/**
 * Internal wrapper for Navigator.Screen
 */
export const NavItemScreen = (props: { [string]: any }): MixedElement => {
	return <Navigator.Screen {...props} />;
};
