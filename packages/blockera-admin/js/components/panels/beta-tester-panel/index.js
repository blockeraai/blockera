// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useContext } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { TabsContext, SettingsContext } from '@blockera/wordpress';
import {
	Flex,
	ToggleControl,
	ControlContextProvider,
} from '@blockera/controls';

// here store fallback default values for tab general settings.
const fallbackDefaultValue = {
	general: {
		disableCleanupStyles: false,
	},
};

export const BetaTesterPanel = (): MixedElement => {
	const {
		defaultSettings,
		//  config
	} = useContext(SettingsContext);
	const { settings, setSettings, setHasUpdates } = useContext(TabsContext);
	const betaTesterSettings =
		settings?.betaTester ||
		defaultSettings?.betaTester ||
		fallbackDefaultValue;

	const {
		blockeraSettings: { betaTester: savedBetaTesterSettings },
	} = window;

	return (
		<Flex
			direction={'column'}
			className={'blockera-settings-panel-container'}
			gap={40}
		>
			<Flex direction={'column'} className={'blockera-settings-section'}>
				<h3 className={'blockera-settings-general section-title'}>
					🧹 {__('Cleanup Styles', 'blockera')}
				</h3>

				<p className={'blockera-settings-general section-desc'}>
					{__(
						'Cleanup styles from the editor to remove important styles, avoid conflicts, and improve blocks css classnames.',
						'blockera'
					)}
				</p>

				<div
					className={'blockera-settings-general control-wrapper'}
					aria-label={'Opt out of PRO hints and promotions'}
				>
					<ControlContextProvider
						value={{
							name: 'toggleCleanupStyles',
							value: betaTesterSettings.general
								.disableCleanupStyles,
						}}
					>
						<ToggleControl
							// TODO: Convert to advanced labelType. to display for user is changed value or not!
							labelType={'self'}
							id={'toggleCleanupStyles'}
							className={'blockera-settings-general control'}
							defaultValue={
								betaTesterSettings.general.disableCleanupStyles
							}
							onChange={(checked: boolean) => {
								setHasUpdates(
									checked !==
										savedBetaTesterSettings.general
											.disableCleanupStyles
								);

								setSettings({
									...settings,
									betaTester: {
										...betaTesterSettings,
										general: {
											...betaTesterSettings.general,
											disableCleanupStyles: checked,
										},
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
										'Cleanup styles from the editor',
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
