// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import {
	Tabs,
	Header,
	Promote,
	SettingsContext,
	handleCurrentActiveMenuPage,
} from '@blockera/wordpress';
import { Button } from '@blockera/controls';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { Panel } from './panel';
import { config as optionsConfig } from './config';

const getCurrentPage = (): string => {
	const location = window.location;
	const pages = ['general-settings', 'block-manager', 'license-manager'];

	for (const page of pages) {
		if (-1 === location.search.indexOf(page)) {
			continue;
		}

		return page;
	}

	return 'general-settings';
};

export const Dashboard = (): MixedElement => {
	const { blockeraVersion, blockeraSettings, blockeraDefaultSettings } =
		window;
	const [settings, setSettings] = useState(blockeraSettings);
	const currentPage = getCurrentPage();
	const config = applyFilters(
		'blockera.admin.panel.settings.config',
		optionsConfig
	);

	return (
		<div className={'blockera-settings-dashboard'}>
			<SettingsContext.Provider
				value={{
					config,
					settings,
					defaultSettings: blockeraDefaultSettings,
				}}
			>
				<Promote
					url={'https://blockera.ai/products/site-builder/upgrade/'}
					description={__(
						"You're using Blockera Free. To unlock more features, consider ",
						'blockera'
					)}
				/>

				<Header
					icon={
						<Icon
							library={'blockera'}
							icon={'blockera'}
							iconSize={40}
						/>
					}
					version={`v${blockeraVersion}`}
					name={__('Blockera', 'blockera')}
				>
					<div className={'blockera-settings-header-links'}>
						<Button
							variant={'link'}
							className={
								'blockera-settings-button blockera-settings-primary-button'
							}
							text={__('Upgrade to PRO', 'blockera')}
							href={
								'https://blockera.ai/products/site-builder/upgrade/'
							}
						/>
					</div>
				</Header>

				<Tabs
					onSelect={(tabKey: string): void =>
						handleCurrentActiveMenuPage(tabKey)
					}
					activeTab={currentPage}
					setSettings={setSettings}
					settings={settings}
					items={[
						{
							settingSlug: 'general',
							name: 'general-settings',
							className: 'general-settings-tab',
							title: __('General Settings', 'blockera'),
						},
						{
							name: 'block-manager',
							settingSlug: 'disabledBlocks',
							className: 'block-manager-tab',
							title: __('Block Manager', 'blockera'),
						},
					]}
					getPanel={Panel}
				/>
			</SettingsContext.Provider>
		</div>
	);
};
