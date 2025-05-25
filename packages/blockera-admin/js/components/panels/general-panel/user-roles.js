// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { applyFilters } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { noop } from '@blockera/utils';
import { Icon } from '@blockera/icons';
import { AdminFeatureWrapper } from '@blockera/wordpress';
import {
	Flex,
	ToggleControl,
	CheckboxControl,
	ControlContextProvider,
} from '@blockera/controls';
import type { BlockVisibilityProps } from './block-visibility';

export const UserRoles = ({
	config,
	settings,
	setSettings,
	setHasUpdates,
	generalSettings,
	savedGeneralSettings,
}: BlockVisibilityProps) => {
	return (
		<Flex direction={'column'} className={'blockera-settings-section'}>
			<h3 className={'blockera-settings-general section-title'}>
				<Icon
					icon={'slash-circle'}
					iconSize={24}
					style={{
						color: '#ff0c0c',
					}}
				/>
				{__('Restricts Blocks by User Roles', 'blockera')}
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
				<AdminFeatureWrapper config={config.restrictBlockVisibility}>
					<Flex direction={'column'}>
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
								'blockera-settings-block-visibility user-roles ' +
								(!generalSettings.disableRestrictBlockVisibility
									? 'blockera-control-is-not-active'
									: '')
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
											([id, checked]: [
												string,
												boolean
											]): [string, boolean] => {
												return [id, checked];
											}
										)
									),
								}}
							>
								{Object.entries(
									generalSettings.allowedUserRoles
								).map(
									(
										[id, checked]: [string, boolean],
										index: number
									): MixedElement => {
										return (
											<CheckboxControl
												id={id}
												key={id + index}
												checkboxLabel={id}
												defaultValue={checked}
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
};
