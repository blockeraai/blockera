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

export const PostTypes = ({
	config,
	settings,
	setSettings,
	setHasUpdates,
	generalSettings,
	savedGeneralSettings,
}: BlockVisibilityProps): MixedElement => {
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
				{__('Restricts Blocks by Post Types', 'blockera')}
			</h3>

			<p className={'blockera-settings-general section-desc'}>
				{__(
					'By default, all users with block editing capabilities can utilize the  features of Blockera blocks. You can specify which post types should  have access to Blockera block settings within the Editor. Administrators  will always retain permission for these settings.',
					'blockera'
				)}
			</p>

			<div
				className={'blockera-settings-general control-wrapper'}
				aria-label={'Restrict block visibility by post type'}
			>
				<AdminFeatureWrapper
					config={config.restrictBlockVisibilityByPostType}
				>
					<Flex direction={'column'}>
						<ControlContextProvider
							value={{
								name: 'toggleRestrictBlockVisibilityByPostType',
								value: generalSettings.disableRestrictBlockVisibilityByPostType,
							}}
						>
							<ToggleControl
								// TODO: Convert to advanced labelType. to display for user is changed value or not!
								labelType={'self'}
								id={'toggleRestrictBlockVisibilityByPostType'}
								className={'blockera-settings-general control'}
								defaultValue={
									generalSettings.disableRestrictBlockVisibilityByPostType
								}
								onChange={(checked: boolean) => {
									applyFilters(
										'blockera.admin.general.panel.disableRestrictBlockVisibilityByPostType.onChange',
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
											'Restrict Blockera blocks to selected post types.',
											'blockera'
										)}
									</strong>
								}
							/>
						</ControlContextProvider>
						<div
							className={
								'blockera-settings-block-visibility post-types ' +
								(!generalSettings.disableRestrictBlockVisibilityByPostType
									? 'blockera-control-is-not-active'
									: '')
							}
						>
							<ControlContextProvider
								value={{
									type: 'nested',
									name: 'postTypes',
									value: Object.fromEntries(
										Object.entries(
											generalSettings.allowedPostTypes
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
									generalSettings.allowedPostTypes
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
														'blockera.admin.general.panel.restrictBlockVisibilityByPostType.postType.onChange',
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
