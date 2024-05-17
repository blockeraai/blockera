// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useEffect, useState } from '@wordpress/element';
import { __experimentalVStack as VStack } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { isEquals } from '@blockera/utils';
import { type TabsComponentsProps, PanelHeader } from '@blockera/wordpress';
import { Switch } from '@blockera/components';

// here store default values for tab general settings.
// todo update this code to get value from config
const defaultValue = {
	disableAds: false,
};

export const GeneralPanel = ({
	tab,
	settings,
	description,
	setSettings,
}: TabsComponentsProps): MixedElement => {
	const savedGeneralSettings = settings?.general || defaultValue;
	const [generalSettings, setGeneralSettings] =
		useState(savedGeneralSettings);
	const [hasUpdate, setHasUpdates] = useState(false);

	useEffect(() => {
		if (isEquals(savedGeneralSettings, generalSettings)) {
			return;
		}

		setGeneralSettings(savedGeneralSettings);
		// eslint-disable-next-line
	}, [savedGeneralSettings]);

	return (
		<>
			<PanelHeader
				tab={tab}
				defaultValue={defaultValue}
				hasUpdate={hasUpdate}
				tabSettings={generalSettings}
				onUpdate={(_hasUpdate: boolean): void => {
					setHasUpdates(_hasUpdate);

					setSettings({
						...settings,
						general: generalSettings,
					});
				}}
				description={description}
			/>
			<VStack className={'blockera-settings-panel-container'}>
				<VStack className={'blockera-settings-general section'}>
					<h3 className={'blockera-settings-general section-title'}>
						{__('Other Settings', 'blockera')}
					</h3>
					<p className={'blockera-settings-general section-desc'}>
						{__(
							'Discover advanced settings for fine-tuning website with ease.',
							'blockera'
						)}
					</p>
					<div
						className={'blockera-settings-general control-wrapper'}
					>
						<Switch
							className={'blockera-settings-general control'}
							value={generalSettings.disableAds}
							onChange={(checked: boolean) => {
								setHasUpdates(
									savedGeneralSettings.disableAds !== checked
								);

								setGeneralSettings({
									...generalSettings,
									disableAds: checked,
								});
							}}
						/>
						<strong
							className={
								'blockera-settings-general control-label'
							}
						>
							{__(
								'Opt out of PRO version hints and promotions',
								'blockera'
							)}
						</strong>
					</div>
				</VStack>
			</VStack>
		</>
	);
};
