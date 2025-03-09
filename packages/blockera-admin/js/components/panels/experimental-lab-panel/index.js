// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useContext, useState } from '@wordpress/element';

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

/**
 * Internal dependencies
 */
import FeatureLabel from './components/feature-label';
import FeatureDesc from './components/feature-desc';

// here store fallback default values for tab general settings.
const fallbackDefaultValue = {
	earlyAccessLab: {
		optimizeStyleGeneration: false,
		optimizeStyleGenerationStatus: 'alpha',
	},
};

export const ExperimentalLabPanel = (): MixedElement => {
	const {
		defaultSettings,
		//  config
	} = useContext(SettingsContext);

	const { settings, setSettings, setHasUpdates } = useContext(TabsContext);

	const earlyAccessLabSettings =
		settings?.earlyAccessLab ||
		defaultSettings?.earlyAccessLab ||
		fallbackDefaultValue;

	const {
		blockeraSettings: { earlyAccessLab: savedEarlyAccessLabSettings },
	} = window;

	const [optimizeStyleGenerationStatus] = useState(
		earlyAccessLabSettings?.optimizeStyleGenerationStatus !== undefined
			? earlyAccessLabSettings.optimizeStyleGenerationStatus
			: fallbackDefaultValue.earlyAccessLab.optimizeStyleGenerationStatus
	);

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

					<FeatureLabel status={optimizeStyleGenerationStatus} />
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
							value: earlyAccessLabSettings.optimizeStyleGeneration,
						}}
					>
						<ToggleControl
							// TODO: Convert to advanced labelType. to display for user is changed value or not!
							labelType={'self'}
							id={'toggleCleanupStyles'}
							className={'blockera-settings-general control'}
							defaultValue={
								earlyAccessLabSettings.optimizeStyleGeneration
							}
							onChange={(checked: boolean) => {
								setHasUpdates(
									checked !==
										savedEarlyAccessLabSettings.optimizeStyleGeneration
								);

								const newSettings = {
									...settings,
									earlyAccessLab: {
										...earlyAccessLabSettings,
										optimizeStyleGeneration: checked,
									},
								};

								// The status should be removed from the settings because it is not a valid setting.
								// it is only used to display the status of the feature.
								delete newSettings.earlyAccessLab
									.optimizeStyleGenerationStatus;

								setSettings(newSettings);
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

				<FeatureDesc status={optimizeStyleGenerationStatus} />
			</Flex>
		</Flex>
	);
};
