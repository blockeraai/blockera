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
import { TabsContext, PanelHeader } from '@blockera/wordpress';

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
		</HStack>
	);
};
