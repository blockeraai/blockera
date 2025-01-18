// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { applyFilters } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { Update } from '../../';
import type { TabsProps } from '../types';

export const PanelHeader = ({
	tab,
	kind,
	name,
	tabSettings,
	description,
	showButtons,
}: {
	kind: string,
	name: string,
	tab: TabsProps,
	tabSettings: any,
	description: any,
	showButtons: boolean,
}): MixedElement | null => {
	if (
		applyFilters('blockera.admin.panelHeader.ignoredTabs', []).includes(
			tab.name
		)
	) {
		return null;
	}

	return (
		<Flex direction={'column'} className={'blockera-settings-panel-header'}>
			<Flex
				direction={'row'}
				justifyContent={'space-between'}
				alignItems={'center'}
			>
				<h3 className={'blockera-settings-panel-title'}>{tab.title}</h3>

				{showButtons && (
					<Flex direction={'row'} justifyContent={'space-between'}>
						<Update
							tab={tab}
							kind={kind}
							name={name}
							slugSettings={tabSettings}
						/>
					</Flex>
				)}
			</Flex>
			<div className={'blockera-settings-panel-desc'}>{description}</div>
		</Flex>
	);
};
