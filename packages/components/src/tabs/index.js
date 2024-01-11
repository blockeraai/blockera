// @flow
/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import classnames from 'classnames';
import type { Element } from 'react';
import { useRef } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { useBlockContext } from '@publisher/extensions/src/hooks/context';

/**
 * Internal dependencies
 */
import { Icon } from '../icons';
import TabPanel from './tab-panel';
import type { TTabsProps, TTabProps } from './types';

/**
 * Handle on select event!
 *
 * @param {string} tabName the name of tab
 * @param {Function} setCurrentTab the set current tab to block high level state.
 */
const onSelect = (
	tabName: string,
	setCurrentTab: (tabName: string) => void
): void => setCurrentTab(tabName);

export function Tabs(props: TTabsProps): Element<any> {
	const { activeTab, tabs, getPanel } = props;
	const tabsRef: {
		current: Array<{
			...TTabProps,
			icon: Element<any>,
		}>,
	} = useRef(
		tabs.map((tab: TTabProps, index: number): Object => {
			if (!tab.icon) {
				return tab;
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
	const ref = useRef();
	const { setCurrentTab } = useBlockContext();
	const classes = classnames('publisher-tab-panel');

	return (
		<div ref={ref}>
			<TabPanel
				className={classes}
				activeClass="active-tab"
				onSelect={(tabName) => {
					onSelect(tabName, setCurrentTab);
				}}
				tabs={tabsRef.current}
				initialTabName={activeTab}
			>
				{(tab) => getPanel(tab)}
			</TabPanel>
		</div>
	);
}

Tabs.propTypes = {
	// $FlowFixMe
	props: PropTypes.shape({
		tabs: PropTypes.arrayOf(
			PropTypes.shape({
				name: PropTypes.string,
				title: PropTypes.string,
				icon: {
					name: PropTypes.string,
					library: PropTypes.string,
				},
			})
		).isRequired,
		getPanel: PropTypes.func,
	}),
	ref: PropTypes.object,
};

export default Tabs;
