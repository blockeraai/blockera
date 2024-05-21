// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { applyFilters } from '@wordpress/hooks';
import { useContext } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	TabsContext,
	SettingsContext,
	AdminFeatureWrapper,
} from '@blockera/wordpress';
import {
	ToggleControl,
	CheckboxControl,
	ControlContextProvider,
} from '@blockera/controls';
import { Flex } from '@blockera/components';

// here store fallback default values for tab general settings.
const fallbackDefaultValue = {
	disableProHints: false,
};

export const GeneralPanel = (): MixedElement => {
	const { defaultSettings, config } = useContext(SettingsContext);
	const { settings, setSettings, setHasUpdates } = useContext(TabsContext);
	const generalSettings =
		settings?.general || defaultSettings?.general || fallbackDefaultValue;

	const BlockVisibility = (): MixedElement => (
		<Flex
			direction={'column'}
			className={'blockera-settings-general section'}
		>
			<h3 className={'blockera-settings-general section-title'}>
				🚫 {__('Restricts Blocks by User Roles', 'blockera')}
			</h3>

			<p className={'blockera-settings-general section-desc'}>
				{__(
					'By default, all users with block editing capabilities can utilize the  features of Blockera blocks. You can specify which user roles should  have access to Blockera block settings within the Editor. Administrators  will always retain permission for these settings.',
					'blockera'
				)}
			</p>
			<div className={'blockera-settings-general control-wrapper'}>
				<Flex direction={'column'}>
					<AdminFeatureWrapper
						config={config.general.restrictBlockVisibility}
					>
						<ControlContextProvider
							value={{
								name: 'toggleRestrictBlockVisibility',
								value: generalSettings.disableRestrictBlockVisibility,
							}}
						>
							<ToggleControl
								// TODO: Convert to advanced labelType. to display for user is changed value or not!
								labelType={'self'}
								id={'toggleRestrictBlockVisibility'}
								className={'blockera-settings-general control'}
								defaultValue={
									generalSettings.disableRestrictBlockVisibility
								}
								onChange={(checked: boolean) => {
									setHasUpdates(
										!generalSettings.disableRestrictBlockVisibility
											? checked
											: !checked
									);

									setSettings({
										...settings,
										general: {
											...generalSettings,
											disableRestrictBlockVisibility:
												checked,
										},
									});
								}}
								label={
									<strong
										className={
											'blockera-settings-general control-label'
										}
									>
										{__(
											'Restrict block visibility controls to selected user roles.',
											'blockera'
										)}
									</strong>
								}
							/>
						</ControlContextProvider>
						<div
							className={
								'blockera-settings-block-visibility user-roles'
							}
						>
							<ControlContextProvider
								value={{
									type: 'nested',
									name: 'userRoles',
									value: Object.fromEntries(
										Object.entries(
											generalSettings.allowedUserRoles
										).map(
											([id, userRole]: [
												string,
												{
													name: string,
													checked: boolean,
												}
											]): [string, boolean] => {
												return [id, userRole.checked];
											}
										)
									),
								}}
							>
								{Object.entries(
									generalSettings.allowedUserRoles
								).map(
									(
										[id, userRole]: [
											string,
											{
												name: string,
												checked: boolean,
											}
										],
										index: number
									): MixedElement => {
										return (
											<CheckboxControl
												id={id}
												key={userRole.name + index}
												checkboxLabel={userRole.name}
												defaultValue={userRole.checked}
												onChange={(
													checked: boolean
												): void => {
													applyFilters(
														'blockera.admin.general.panel.restrictBlockVisibility.userRole.onChange',
														() => {},
														checked,
														id,
														settings,
														setSettings,
														generalSettings
													)(checked);
												}}
											/>
										);
									}
								)}
							</ControlContextProvider>
						</div>
					</AdminFeatureWrapper>
				</Flex>
			</div>
		</Flex>
	);

	return (
		<Flex
			direction={'column'}
			className={'blockera-settings-panel-container'}
		>
			<BlockVisibility />
			<Flex
				direction={'column'}
				className={'blockera-settings-general section'}
			>
				<h3 className={'blockera-settings-general section-title'}>
					⚙️ {__('Other Settings', 'blockera')}
				</h3>

				<p className={'blockera-settings-general section-desc'}>
					{__(
						'Discover advanced settings for fine-tuning your website with ease.',
						'blockera'
					)}
				</p>

				<div className={'blockera-settings-general control-wrapper'}>
					<ControlContextProvider
						value={{
							name: 'toggleProHints',
							value: generalSettings.disableProHints,
						}}
					>
						<ToggleControl
							// TODO: Convert to advanced labelType. to display for user is changed value or not!
							labelType={'self'}
							id={'toggleProHints'}
							className={'blockera-settings-general control'}
							defaultValue={generalSettings.disableProHints}
							onChange={(checked: boolean) => {
								setHasUpdates(
									!generalSettings.disableProHints
										? checked
										: !checked
								);

								setSettings({
									...settings,
									general: {
										...generalSettings,
										disableProHints: checked,
									},
								});
							}}
							label={
								<strong
									className={
										'blockera-settings-general control-label'
									}
								>
									{__(
										'Opt out of Pro version hints and promotions',
										'blockera'
									)}
								</strong>
							}
						/>
					</ControlContextProvider>
				</div>
			</Flex>
		</Flex>
	);
};
