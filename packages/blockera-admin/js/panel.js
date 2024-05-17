// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useContext } from '@wordpress/element';
import { __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { TabsContext, Sidebar } from '@blockera/wordpress';
import type { TTabProps } from '@blockera/components/js/tabs/types';

import {
	GeneralPanel,
	BlockManagerPanel,
	LicenseManagerPanel,
} from './components';

export const Panel = (tab: TTabProps): MixedElement => {
	let activePanel: any = <></>;
	const { settings, setSettings } = useContext(TabsContext);

	switch (tab.name) {
		case 'general-settings':
			activePanel = (
				<GeneralPanel
					tab={tab}
					settings={settings}
					setSettings={setSettings}
					description={
						<>
							<p>
								{__(
									'In the General Settings Panel, you can customize your Blockera settings. These settings are used to customize the design and functionality of Blockera.',
									'blockera'
								)}
							</p>
						</>
					}
				/>
			);
			break;
		case 'block-manager':
			activePanel = (
				<BlockManagerPanel
					tab={tab}
					settings={settings}
					setSettings={setSettings}
					description={__(
						"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
						'blockera'
					)}
				/>
			);
			break;
		case 'license-manager':
			activePanel = (
				<LicenseManagerPanel
					tab={tab}
					settings={settings}
					setSettings={setSettings}
					description={
						<>
							<p>{__('License activation panel…', 'blockera')}</p>
						</>
					}
				/>
			);
			break;
	}

	return (
		<HStack
			justifyContent={'flex-start'}
			className={'blockera-settings-panel'}
		>
			<div className={'blockera-settings-active-panel'}>
				{activePanel}
			</div>
			<div className={'blockera-settings-sidebar-wrapper'}>
				<Sidebar
					title={__('Need Support?', 'blockera')}
					children={((): MixedElement => (
						<>
							<div>Content</div>
							<div>
								<a href="https://forum.blockera.ai/blockera">
									{__('Support forum', 'blockera')}
								</a>
							</div>
							<div>Content</div>
							<div>
								<a href="https://forum.blockera.ai/blockera">
									{__('Support forum', 'blockera')}
								</a>
							</div>
						</>
					))()}
				/>
				<Sidebar
					title={__('Share Your Feedback', 'blockera')}
					children={((): MixedElement => (
						<>
							<div>Content</div>
							<div>
								<a href="https://blockera.ai/plugins/blockera/feedback">
									{__('Submit a Review', 'blockera')}
								</a>
							</div>
						</>
					))()}
				/>
			</div>
		</HStack>
	);
};
