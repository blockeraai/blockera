// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { forwardRef, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { Icon } from '../icons';
import TabPanel from './tab-panel';
import classnames from 'classnames';

/**
 * Handle on select event!
 *
 * @param {string} tabName the name of tab
 */
const onSelect = (tabName: string): void => {
	const tab = document.querySelector(`.bf-${tabName}-tab`);
	// eslint-disable-next-line
	tab && tab.classList.add('is-active');
};

type TTabProps = {
	name: string,
	title: string,
	icon: {
		name: string,
		library: string,
	},
};

type TTabsProps = {
	tabs: Array<TTabProps>,
	getPanel: (tab: string) => Object,
	isCustomized: boolean,
};

export function Tabs(
	{ tabs, getPanel, isCustomized }: TTabsProps,
	ref: Object
): MixedElement {
	const tabsRef = useRef(
		tabs.map((tab, index) => {
			if (!tab.icon) {
				return false;
			}

			return {
				...tab,
				icon: (
					<Icon
						icon={tab.icon.name}
						library={tab.icon.library}
						key={`${tab.title}-${index}`}
					/>
				),
			};
		})
	);

	const classes = classnames('publisher-tab-panel', {
		'publisher-sidebar-customized': isCustomized,
	});

	return (
		<div ref={ref}>
			<TabPanel
				className={classes}
				activeClass="active-tab"
				onSelect={onSelect}
				tabs={tabsRef.current}
			>
				{(tab) => getPanel(tab)}
			</TabPanel>
		</div>
	);
}

const ForwardedComponent: TTabsProps = forwardRef(Tabs);

export default ForwardedComponent;
