// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/components';
import type { TTabProps } from '@blockera/components/js/tabs/types';

/**
 * Internal dependencies
 */
import { Update } from '../../';

export const PanelHeader = ({
	tab,
	kind,
	name,
	tabSettings,
	description,
}: {
	kind: string,
	name: string,
	tab: TTabProps,
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
