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
	labAndExperimental: {
		disableCleanupStyles: false,
	},
};

export const LabAndExperimentalPanel = (): MixedElement => {
	const {
		defaultSettings,
		//  config
	} = useContext(SettingsContext);
	const { settings, setSettings, setHasUpdates } = useContext(TabsContext);
	const labAndExperimentalSettings =
		settings?.labAndExperimental ||
		defaultSettings?.labAndExperimental ||
		fallbackDefaultValue;

	const {
		blockeraSettings: {
			labAndExperimental: savedLabAndExperimentalSettings,
		},
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
							value: labAndExperimentalSettings.disableCleanupStyles,
						}}
					>
						<ToggleControl
							// TODO: Convert to advanced labelType. to display for user is changed value or not!
							labelType={'self'}
							id={'toggleCleanupStyles'}
							className={'blockera-settings-general control'}
							defaultValue={
								labAndExperimentalSettings.disableCleanupStyles
							}
							onChange={(checked: boolean) => {
								setHasUpdates(
									checked !==
										savedLabAndExperimentalSettings.disableCleanupStyles
								);

								setSettings({
									...settings,
									labAndExperimental: {
										...labAndExperimentalSettings,
										disableCleanupStyles: checked,
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
