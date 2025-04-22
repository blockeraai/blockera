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
import { Button, Flex, Promoter } from '@blockera/controls';
import { Icon } from '@blockera/icons';
import {
	componentClassNames,
	componentInnerClassNames,
} from '@blockera/classnames';
import { getUrlParams } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { Panel } from './panel';
import ProIcon from './pro-icon.svg';
import { getCurrentPage } from './helpers';
import { config as optionsConfig } from './config';

export const Dashboard = (): MixedElement => {
	const {
		blockeraVersion,
		blockeraSettings,
		blockeraAIAccount,
		blockeraPROIsActivated,
		blockeraDefaultSettings,
	} = window;
	const [settings, setSettings] = useState(blockeraSettings);
	const currentPage = getCurrentPage(
		applyFilters('blockera.admin.dashboard.availablePages', [
			'dashboard',
			'general-settings',
			'block-manager',
			'experimental-lab',
		])
	);
	const config = applyFilters(
		'blockera.admin.panel.settings.config',
		optionsConfig
	);
	const isConnected: boolean = Boolean(
		getUrlParams('connectedWithYourAccount')
	);
	const ProCallToActions: MixedElement = applyFilters(
		'blockera.admin.dashboard.pro.call.to.actions',
		() => (
			<Button
				variant="secondary"
				href={window.blockeraUpgradeUrl}
				target="_blank"
			>
				<Icon library={'ui'} icon={'crown'} iconSize={22} />

				{__('Upgrade to Pro', 'blockera')}
			</Button>
		)
	);
	const promotionComponent: MixedElement = applyFilters(
		'blockera.admin.dashboard.promotion.component',
		() => (
			<>
				{!blockeraPROIsActivated &&
					!isConnected &&
					!blockeraAIAccount?.client_id && (
						<Flex
							direction="column"
							className={componentClassNames('promotion')}
						>
							<ProIcon />
							<ul>
								<li>
									<span className="align-center">
										<Icon
											icon={'check'}
											library="wp"
											iconSize={22}
										/>
										{__('Multiple Transitions', 'blockera')}
									</span>
								</li>
								<li>
									<span className="align-center">
										<Icon
											icon={'check'}
											library="wp"
											iconSize={22}
										/>
										{__(
											'Advanced Transition Types',
											'blockera'
										)}
									</span>
								</li>
								<li>
									<span className="align-center">
										<Icon
											icon={'check'}
											library="wp"
											iconSize={22}
										/>
										{__(
											'Adjust Transition Delay',
											'blockera'
										)}
									</span>
								</li>
							</ul>
							<Button
								variant="primary"
								className={componentInnerClassNames(
									'pro-license-button'
								)}
							>
								{__('Activate Pro License', 'blockera')}
							</Button>
						</Flex>
					)}
			</>
		)
	);

	const profileComponent: MixedElement = applyFilters(
		'blockera.admin.dashboard.profile.component',
		<>
			{!settings?.general?.disableProHints && (
				<Promoter
					heading={__('Upgrade to Blockera Pro', 'blockera')}
					buttonText={__('Unlock All Features', 'blockera')}
					style={{
						width: '100%',
						boxShadow: 'var(--card-box-shadow)',
						borderRadius: 'var(--card-border-radius)',
						padding: '25px 35px',
						backgroundColor: 'var(--card-bg-color)',
						marginTop: 'auto',
						boxSizing: 'border-box',
					}}
				/>
			)}
		</>
	);

	const tabItems: Array<Object> = applyFilters(
		'blockera.admin.dashboard.tabs',
		[
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
			{
				name: 'experimental-lab',
				settingSlug: 'experimentalLab',
				className: 'experimental-lab-tab',
				title: __('Early Access Lab', 'blockera'),
			},
		]
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
					<Flex
						className={'blockera-settings-header-links'}
						direction="row"
						gap={10}
						alignItems="center"
					>
						<ProCallToActions />

						<Button
							variant="tertiary"
							href={
								'https://community.blockera.ai/changelog-9l8hbrv0?utm_source=blockera-admin&utm_medium=referral&utm_campaign=changelog-page&utm_content=cta-link'
							}
							target="_blank"
						>
							<Icon
								library={'ui'}
								icon={'changelog'}
								iconSize={22}
							/>

							{__('Changelog', 'blockera')}
						</Button>
					</Flex>
				</Header>

				<Tabs
					onSelect={(tabKey: string): void =>
						handleCurrentActiveMenuPage(tabKey)
					}
					activeTab={currentPage}
					setSettings={setSettings}
					settings={settings}
					items={tabItems}
					getPanel={Panel}
					injectMenuEnd={
						<NavigableMenu
							orientation={'vertical'}
							className={componentClassNames('tabs__list')}
							style={{
								height: '100%',
							}}
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
								href={
									'https://community.blockera.ai/?utm_source=blockera-admin&utm_medium=referral&utm_campaign=community-page&utm_content=cta-link'
								}
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
								href={
									'https://community.blockera.ai/roadmap?utm_source=blockera-admin&utm_medium=referral&utm_campaign=roadmap-page&utm_content=cta-link'
								}
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
									'https://community.blockera.ai/feature-request-1rsjg2ck?utm_source=blockera-admin&utm_medium=referral&utm_campaign=feature-request-page&utm_content=cta-link'
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

							{promotionComponent}
							{profileComponent}
						</NavigableMenu>
					}
				/>
			</SettingsContext.Provider>
		</div>
	);
};
