/**
 * External dependencies
 */
import type { ComponentProps, ReactElement } from 'react';
import { Navigator } from '@wordpress/components';

type NavItemScreenProps = ComponentProps<typeof Navigator.Screen>;

/**
 * Internal wrapper for Navigator.Screen
 */
export const NavItemScreen = (props: NavItemScreenProps): ReactElement => {
	return <Navigator.Screen {...props} />;
};
