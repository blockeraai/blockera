// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Internal dependencies
 */
import type { TTabProps } from './tabs-props';

export type TTabPanelProps = {
	tabs: Array<{
		...TTabProps,
		icon?: Element<any>,
		settingSlug?: string,
	}>,
	children: (props: Object) => Element<any>,
	className?: string,
	initialTabName: ?string,
	onSelect: (tab: string) => void,
	/**
	 * @default 'horizontal'
	 */
	orientation?: 'horizontal' | 'vertical',
	/**
	 * @default 'is-active'
	 */
	activeClass?: string,
	/**
	 * Icon for active item
	 */
	activeIcon?: Element<any>,
	/**
	 * Design of the tab.
	 *
	 * @default 'modern'
	 */
	design?: 'default' | 'modern',
	/**
	 * Inject items to end of the menu
	 */
	injectMenuEnd?: any,
	/**
	 * Heading for navigation
	 */
	heading?: string,
};
