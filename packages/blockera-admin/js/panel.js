// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import type { MixedElement, Element } from 'react';
import { __experimentalHStack as HStack } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { noop } from '@blockera/utils';
import { TabsContext, PanelHeader } from '@blockera/wordpress';
import type { TTabProps } from '@blockera/controls/js/libs/tabs/types';

/**
 * Internal dependencies
 */
import {
	GeneralPanel,
	DashboardPanel,
	BlockManagerPanel,
	LabAndExperimentalPanel,
} from './components';

export const Panel = (tab: {
	...TTabProps,
	settingSlug?: string,
}): MixedElement => {
	let description: Element<any> = <></>;
	let activePanel: any = <></>;
	let panelHeader: boolean = true;
	let showButtons: boolean = true;
	const { settings } = useContext(TabsContext);

	switch (tab.name) {
		case 'dashboard':
			panelHeader = false;
			activePanel = <DashboardPanel />;
			break;

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

		case 'lab-experimental':
			activePanel = <LabAndExperimentalPanel />;
			description = (
				<p>
					{__(
						'In the Lab & Experimental Panel, you can customize your Blockera settings. These settings are used to customize the design and functionality of Blockera.',
						'blockera'
					)}
				</p>
			);
			break;

		default:
			/**
			 * Developer can add new tabs to panel dashboard by using this filter powered by WordPress Hooks API.
			 *
			 * @since 1.0.0
			 */
			const panels = applyFilters('blockera.admin.panels', []);

			for (let index = 0; index < panels.length; index++) {
				const panel = panels[index];

				if (tab.name === panel) {
					panelHeader = applyFilters(
						'blockera.admin.panel.' + panel + '.hasHeader',
						true
					);
					activePanel = applyFilters(
						'blockera.admin.panel.' +
							panel +
							'.activePanelComponent',
						noop
					);
					description = applyFilters(
						'blockera.admin.panel.' + panel + '.description',
						noop
					);
					showButtons = applyFilters(
						'blockera.admin.panel.' + panel + '.showButtons',
						true
					);
				}
			}
			break;
	}

	return (
		<HStack
			justifyContent={'flex-start'}
			className={'blockera-settings-panel'}
			gap="20"
		>
			<div className={'blockera-settings-active-panel'}>
				{panelHeader && (
					<PanelHeader
						tab={tab}
						name={'settings'}
						kind={'blockera/v1'}
						description={description}
						tabSettings={settings[tab.settingSlug]}
						showButtons={showButtons}
					/>
				)}

				{activePanel}
			</div>
		</HStack>
	);
};
