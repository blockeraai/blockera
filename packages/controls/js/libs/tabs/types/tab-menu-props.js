// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Internal dependencies
 */
import type { TTabProps } from './tabs-props';

export type TTabMenuProps = {
	tabs: Array<{
		...TTabProps,
		icon?: Element<any>,
		settingSlug?: string,
	}>,
	selected: ?string,
	instanceId: string,
	/**
	 * @default 'horizontal'
	 */
	orientation?: 'horizontal' | 'vertical',
	/**
	 * @default 'is-active-tab'
	 */
	activeClass?: string,
	/**
	 * Icon for active item
	 */
	activeIcon?: Element<any>,
	/**
	 * Inject items to end of the menu
	 */
	injectMenuEnd?: any,
	/**
	 * Heading for navigation
	 */
	heading?: string,
	/**
	 * Callback when a tab is clicked
	 */
	onTabClick: (tabName: string) => void,
	/**
	 * Design variant: 'clean' | 'modern'. When 'modern', uses JS-driven dynamic indicator.
	 */
	design?: string,
};
