// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

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
}: {
	kind: string,
	name: string,
	tab: TabsProps,
	tabSettings: any,
	description: any,
}): MixedElement => {
	return (
		<Flex direction={'column'}>
			<Flex direction={'row'} justifyContent={'space-between'}>
				<h3 className={'blockera-settings-panel panel-title'}>
					{tab.title}
				</h3>

				<Flex direction={'row'} justifyContent={'space-between'}>
					<Update
						tab={tab}
						kind={kind}
						name={name}
						slugSettings={tabSettings}
					/>
				</Flex>
			</Flex>
			<div className={'blockera-settings-panel-desc'}>{description}</div>
		</Flex>
	);
};
