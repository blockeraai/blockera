// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useContext } from '@wordpress/element';
import { __experimentalVStack as VStack } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { SettingsContext, TabsContext } from '@blockera/wordpress';
import { Switch } from '@blockera/components';

// here store fallback default values for tab general settings.
const fallbackDefaultValue = {
	disableProHints: false,
};

export const GeneralPanel = (): MixedElement => {
	const { defaultSettings } = useContext(SettingsContext);
	const { settings, setSettings, setHasUpdates } = useContext(TabsContext);
	const generalSettings =
		settings?.general || defaultSettings?.general || fallbackDefaultValue;

	return (
		<VStack className={'blockera-settings-panel-container'}>
			<VStack className={'blockera-settings-general section'}>
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
					<Switch
						id={'toggleProHints'}
						className={'blockera-settings-general control'}
						value={generalSettings.disableProHints}
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
					/>

					<strong
						className={'blockera-settings-general control-label'}
					>
						{__(
							'Opt out of Pro version hints and promotions',
							'blockera'
						)}
					</strong>
				</div>
			</VStack>
		</VStack>
	);
};
