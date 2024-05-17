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
					description={
						<>
							<p>
								{__(
									"In the Block Manager Panel, you have full control over both supported  and custom blocks offered by Blockera. If a block isn't listed, it's  because it's not currently supported.",
									'blockera'
								)}
							</p>
						</>
					}
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
							<p>
								{__(
									'Whether you need help or have a new feature request, please create a topic in the support forum on WordPress.org.',
									'blockera'
								)}
							</p>

							<p>
								<a
									href="https://wordpress.org/support/plugin/blockera"
									referrerPolicy="no-referrer"
								>
									{__('Support forum', 'blockera')}
								</a>
							</p>

							<p>
								{__(
									'Detailed documentation is also available on the plugin website.',
									'blockera'
								)}
							</p>

							<p>
								<a href="https://www.blockera.ai/knowledge-base/?bv_query=learn_more&utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals">
									{__('View Knowledge Base', 'blockera')}
								</a>
							</p>
						</>
					))()}
				/>
				<Sidebar
					title={__('Share Your Feedback', 'blockera')}
					children={((): MixedElement => (
						<>
							<p>
								{__(
									'If you are enjoying Blockera and find it useful, please consider leaving a ★★★★★ review on WordPress.org. Your feedback is greatly appreciated and helps others discover the plugin.',
									'blockera'
								)}
							</p>

							<p>
								<a href="https://blockera.ai/plugins/blockera/feedback">
									{__('Submit a Review', 'blockera')}
								</a>
							</p>
						</>
					))()}
				/>
			</div>
		</HStack>
	);
};
