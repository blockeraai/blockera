// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { NavigableMenu, Button as WPButton } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import {
	Tabs,
	Header,
	SettingsContext,
	handleCurrentActiveMenuPage,
} from '@blockera/wordpress';
import { Button } from '@blockera/controls';
import { Icon } from '@blockera/icons';
import {
	componentClassNames,
	componentInnerClassNames,
} from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { Panel } from './panel';
import { config as optionsConfig } from './config';
import { OptInModal } from '@blockera/data-stream';

const getCurrentPage = (): string => {
	const location = window.location;
	const pages = ['dashboard', 'general-settings', 'block-manager'];

	for (const page of pages) {
		if (-1 === location.search.indexOf(page)) {
			continue;
		}

		return page;
	}

	return 'dashboard';
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
			<OptInModal kind={'blockera/v1'} name={'opt-in'} />
			<SettingsContext.Provider
				value={{
					config,
					settings,
					defaultSettings: blockeraDefaultSettings,
				}}
			>
				<Header
					icon={
						<Icon
							library={'blockera'}
							icon={'blockera'}
							iconSize={32}
						/>
					}
					version={`v${blockeraVersion}`}
					name={__('Blockera', 'blockera')}
				>
					<div className={'blockera-settings-header-links'}>
						<Button
							variant="secondary-on-hover"
							icon={
								<Icon
									library={'ui'}
									icon={'crown'}
									iconSize={22}
								/>
							}
							text={__('Upgrade to Pro', 'blockera')}
							href={
								'https://blockera.ai/products/site-builder/upgrade/'
							}
							target="_blank"
						/>

						<Button
							variant="tertiary-on-hover"
							icon={
								<Icon
									library={'ui'}
									icon={'changelog'}
									iconSize={22}
								/>
							}
							text={__('Changelog', 'blockera')}
							href={
								'https://community.blockera.ai/changelog-9l8hbrv0'
							}
							target="_blank"
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
							settingSlug: 'dashboard',
							name: 'dashboard',
							className: 'dashboard-settings-tab',
							title: __('Dashboard', 'blockera'),
						},
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
					injectMenuEnd={
						<NavigableMenu
							orientation={'vertical'}
							className={componentClassNames('tabs__list')}
						>
							<div
								className={componentInnerClassNames(
									'tabs__heading'
								)}
							>
								{__('Resources', 'blockera')}
							</div>

							<WPButton
								className={componentInnerClassNames(
									'tabs__list__item',
									'tab-item-button'
								)}
								target="_blank"
								href={'https://community.blockera.ai/'}
							>
								{__('Community', 'blockera')}

								<span
									className={componentInnerClassNames(
										'active-icon'
									)}
								>
									<Icon
										library={'ui'}
										icon={'arrow-new-tab'}
										iconSize={22}
									/>
								</span>
							</WPButton>

							<WPButton
								className={componentInnerClassNames(
									'tabs__list__item',
									'tab-item-button'
								)}
								target="_blank"
								href={'https://community.blockera.ai/roadmap'}
							>
								{__('Roadmap', 'blockera')}

								<span
									className={componentInnerClassNames(
										'active-icon'
									)}
								>
									<Icon
										library={'ui'}
										icon={'arrow-new-tab'}
										iconSize={22}
									/>
								</span>
							</WPButton>

							<WPButton
								className={componentInnerClassNames(
									'tabs__list__item',
									'tab-item-button'
								)}
								target="_blank"
								href={
									'https://community.blockera.ai/feature-request-1rsjg2ck'
								}
							>
								{__('Feature Request', 'blockera')}

								<span
									className={componentInnerClassNames(
										'active-icon'
									)}
								>
									<Icon
										library={'ui'}
										icon={'arrow-new-tab'}
										iconSize={22}
									/>
								</span>
							</WPButton>
						</NavigableMenu>
					}
				/>
			</SettingsContext.Provider>
		</div>
	);
};
