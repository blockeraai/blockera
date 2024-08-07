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
	 * Design of the tab.
	 *
	 * @default 'modern'
	 */
	design?: 'default' | 'modern',
};
