// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import Button from '@blockera/components/js/button/button';
import {
	Tabs,
	Header,
	Promote,
	SettingsContext,
	handleCurrentActiveMenuPage,
} from '@blockera/wordpress';

/**
 * Internal dependencies
 */
import { Panel } from './panel';
import { PanelLogoIcon } from './icons/panel-logo-icon';

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

	return (
		<div className={'blockera-settings-dashboard'}>
			<SettingsContext.Provider
				value={{
					settings,
					defaultSettings: blockeraDefaultSettings,
				}}
			>
				<Promote
					url={'https://blockera.ai/upgrade-to-pro/'}
					description={__(
						"You're using Blockera Free. To unlock more features, consider ",
						'blockera'
					)}
				/>

				<Header
					icon={<PanelLogoIcon />}
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
							href={'https://blockera.ai/upgrade-to-pro/'}
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
						{
							name: 'license-manager',
							settingSlug: 'licence',
							className: 'license-manager-tab',
							title: __('License Manager', 'blockera'),
						},
					]}
					getPanel={Panel}
				/>
			</SettingsContext.Provider>
		</div>
	);
};
