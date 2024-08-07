// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import type { MixedElement, Element } from 'react';
import { __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import type { TTabProps } from '@blockera/controls/js/libs/tabs/types';
import { TabsContext, Sidebar, PanelHeader } from '@blockera/wordpress';

import { GeneralPanel, BlockManagerPanel } from './components';

export const Panel = (tab: {
	...TTabProps,
	settingSlug: string,
}): MixedElement => {
	let description: Element<any> = <></>;
	let activePanel: any = <></>;
	const { settings } = useContext(TabsContext);

	switch (tab.name) {
		case 'general-settings':
			activePanel = <GeneralPanel />;
			description = (
				<p>
					{__(
						'In the General Settings Panel, you can customize your Blockera settings. These settings are used to customize the design and functionality of Blockera.',
						'blockera'
					)}
				</p>
			);
			break;
		case 'block-manager':
			activePanel = <BlockManagerPanel />;
			description = (
				<p>
					{__(
						"In the Block Manager Panel, you have full control over both supported  and custom blocks offered by Blockera. If a block isn't listed, it's  because it's not currently supported.",
						'blockera'
					)}
				</p>
			);
			break;
	}

	return (
		<HStack
			justifyContent={'flex-start'}
			className={'blockera-settings-panel'}
			gap="20"
		>
			<div className={'blockera-settings-active-panel'}>
				<PanelHeader
					tab={tab}
					name={'settings'}
					kind={'blockera/v1'}
					description={description}
					tabSettings={settings[tab.settingSlug]}
				/>

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
