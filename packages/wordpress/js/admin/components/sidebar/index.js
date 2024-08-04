// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { SidebarProps } from './types';

export const Sidebar = ({ title, children }: SidebarProps): MixedElement => {
	return (
		<div className={'blockera-settings-sidebar'}>
			<h4>{title}</h4>

			{children}
		</div>
	);
};
