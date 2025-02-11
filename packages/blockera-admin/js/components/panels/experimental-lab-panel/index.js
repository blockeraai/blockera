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
import { Icon } from '@blockera/icons';

// here store fallback default values for tab general settings.
const fallbackDefaultValue = {
	labAndExperimental: {
		enableCleanupStyles: false,
	},
};

export const ExperimentalLabPanel = (): MixedElement => {
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
					<Icon
						icon={'zap-fast'}
						iconSize={24}
						style={{
							color: 'var(--blockera-controls-primary-color)',
						}}
					/>
					{__('Optimized Style Generation', 'blockera')}

					<span className={'section-title-badge alpha-badge'}>
						{__('Alpha Feature', 'blockera')}
					</span>
				</h3>

				<p className={'blockera-settings-general section-desc'}>
					{__(
						'Optimize the style generation process to remove unnecessary inline CSS codes, drop important styles, and improve the performance of your website.',
						'blockera'
					)}{' '}
					<a
						href={
							'https://community.blockera.ai/feature-request-1rsjg2ck/post/optimize-style-generator-on-front-end-editor-y5IVNlZ6nSkzSXD?utm_source=blockera-settings&utm_medium=experimental-lab-panel&utm_campaign=experimental-lab-panel'
						}
						target={'_blank'}
						rel={'noopener noreferrer'}
					>
						{__('Learn more', 'blockera')}
					</a>
				</p>

				<div className={'blockera-settings-general control-wrapper'}>
					<ControlContextProvider
						value={{
							name: 'toggleCleanupStyles',
							value: labAndExperimentalSettings.enableCleanupStyles,
						}}
					>
						<ToggleControl
							// TODO: Convert to advanced labelType. to display for user is changed value or not!
							labelType={'self'}
							id={'toggleCleanupStyles'}
							className={'blockera-settings-general control'}
							defaultValue={
								labAndExperimentalSettings.enableCleanupStyles
							}
							onChange={(checked: boolean) => {
								setHasUpdates(
									checked !==
										savedLabAndExperimentalSettings.enableCleanupStyles
								);

								setSettings({
									...settings,
									labAndExperimental: {
										...labAndExperimentalSettings,
										enableCleanupStyles: checked,
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
										'Optimize the style generation process',
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
