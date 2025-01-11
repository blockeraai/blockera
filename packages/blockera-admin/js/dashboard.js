// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
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
import { Button, Flex, Avatar } from '@blockera/controls';
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
import { config as optionsConfig } from './config';

const getCurrentPage = (): string => {
	const { location, blockeraAdminPanels } = window;
	const pages = blockeraAdminPanels;

	for (const page of pages) {
		if (-1 === location.search.indexOf(page)) {
			continue;
		}

		return page;
	}

	return 'dashboard';
};

export const Dashboard = (): MixedElement => {
	const {
		blockeraVersion,
		blockeraSettings,
		blockeraAIAccount,
		blockeraAIMyAccountUrl,
		blockeraPROIsActivated,
		blockeraPROIsInstalled,
		blockeraDefaultSettings,
	} = window;
	const [settings, setSettings] = useState(blockeraSettings);
	const currentPage = getCurrentPage();
	const config = applyFilters(
		'blockera.admin.panel.settings.config',
		optionsConfig
	);
	const isConnected = getUrlParams('connectedWithYourAccount');

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
					<div className={'blockera-settings-header-links'}>
						{!blockeraPROIsInstalled && (
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
									'https://blockera.ai/products/site-builder/upgrade/?utm_source=blockera-admin&utm_medium=referral&utm_campaign=upgrade-page&utm_content=cta-link'
								}
								target="_blank"
							/>
						)}
						{!blockeraPROIsActivated && (
							<Button
								variant="secondary-on-hover"
								icon={
									<Icon
										library={'ui'}
										icon={'crown'}
										iconSize={22}
									/>
								}
								text={__('Activate Pro License', 'blockera')}
								href={
									'https://blockera.ai/products/site-builder/upgrade/?utm_source=blockera-admin&utm_medium=referral&utm_campaign=upgrade-page&utm_content=cta-link'
								}
								target="_blank"
							/>
						)}

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
								'https://community.blockera.ai/changelog-9l8hbrv0?utm_source=blockera-admin&utm_medium=referral&utm_campaign=changelog-page&utm_content=cta-link'
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
						{
							name: 'account',
							settingSlug: 'account',
							className: 'account-tab',
							title: __('Account & License', 'blockera'),
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

							{(!blockeraPROIsInstalled ||
								!blockeraPROIsActivated) &&
								!isConnected &&
								!blockeraAIAccount?.client_id && (
									<Flex
										direction="column"
										className={componentClassNames(
											'promotion'
										)}
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
													{__(
														'Multiple Transitions',
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
											{__(
												'Activate Pro License',
												'blockera'
											)}
										</Button>
									</Flex>
								)}
							{blockeraAIAccount?.licenses?.length > 0 && (
								<Flex
									justifyContent="space-between"
									alignItems="center"
									className="profile-container"
									onClick={() =>
										window.open(
											blockeraAIMyAccountUrl,
											'_blank'
										)
									}
								>
									<Flex
										gap="16"
										alignItems="center"
										justifyContent="space-between"
									>
										<Avatar
											src={blockeraAIAccount?.avatar}
											alt={blockeraAIAccount?.name}
											className="account-avatar"
										/>
										<Flex direction="column" gap="4">
											<h3 style={{ margin: 0 }}>
												{blockeraAIAccount?.name}
											</h3>
											<p style={{ margin: 0 }}>
												{blockeraAIAccount?.email}
											</p>
										</Flex>
									</Flex>
									<Icon
										icon={'chevron-right'}
										library="wp"
										iconSize={22}
									/>
								</Flex>
							)}
						</NavigableMenu>
					}
				/>
			</SettingsContext.Provider>
		</div>
	);
};
