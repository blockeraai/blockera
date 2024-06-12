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
import { noop } from '@blockera/utils';
import {
	Flex,
	ToggleControl,
	CheckboxControl,
	ControlContextProvider,
} from '@blockera/controls';

// here store fallback default values for tab general settings.
const fallbackDefaultValue = {
	disableProHints: false,
};

export const GeneralPanel = (): MixedElement => {
	const { defaultSettings, config } = useContext(SettingsContext);
	const { settings, setSettings, setHasUpdates } = useContext(TabsContext);
	const generalSettings =
		settings?.general || defaultSettings?.general || fallbackDefaultValue;
	const {
		blockeraSettings: { general: savedGeneralSettings },
	} = window;

	const BlockVisibility = ({ isChecked }: Object): MixedElement => (
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

			<div
				className={'blockera-settings-general control-wrapper'}
				aria-label={'Restrict block visibility'}
			>
				<AdminFeatureWrapper
					config={config.general.restrictBlockVisibility}
				>
					<Flex direction={'column'}>
						<ControlContextProvider
							value={{
								name: 'toggleRestrictBlockVisibility',
								value: isChecked,
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
									applyFilters(
										'blockera.admin.general.panel.disableRestrictBlockVisibility.onChange',
										noop,
										{
											settings,
											setSettings,
											setHasUpdates,
											generalSettings,
											savedGeneralSettings,
										}
									)(checked);
								}}
								label={
									<strong
										className={
											'blockera-settings-general control-label'
										}
									>
										{__(
											'Restrict Blockera blocks to selected user roles.',
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
												): void =>
													applyFilters(
														'blockera.admin.general.panel.restrictBlockVisibility.userRole.onChange',
														noop,
														{
															id,
															settings,
															setSettings,
															setHasUpdates,
															generalSettings,
															savedGeneralSettings,
														}
													)(checked)
												}
											/>
										);
									}
								)}
							</ControlContextProvider>
						</div>
					</Flex>
				</AdminFeatureWrapper>
			</div>
		</Flex>
	);

	return (
		<Flex
			direction={'column'}
			className={'blockera-settings-panel-container'}
		>
			<BlockVisibility
				isChecked={generalSettings.disableRestrictBlockVisibility}
			/>

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

				<div
					className={'blockera-settings-general control-wrapper'}
					aria-label={'Opt out of PRO hints and promotions'}
				>
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
									checked !==
										savedGeneralSettings.disableProHints
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
