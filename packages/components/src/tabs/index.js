// @flow
/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import type { Element } from 'react';
import { useRef } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import classnames from 'classnames';

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
 */
const onSelect = (tabName: string): void => {
	const tab = document.querySelector(`.bf-${tabName}-tab`);
	// eslint-disable-next-line
	tab && tab.classList.add('is-active');
};

export function Tabs(props: TTabsProps): Element<any> {
	const { tabs, getPanel } = props;
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
	const classes = classnames('publisher-tab-panel');

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
