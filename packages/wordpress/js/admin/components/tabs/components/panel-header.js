// @flow

/**
 * External dependencies
 */
import {
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import { Update } from '../../';
import type { TTabProps } from '@blockera/components/js/tabs/types';

export const PanelHeader = ({
	tab,
	onUpdate,
	hasUpdate,
	tabSettings,
	description,
}: {
	tab: TTabProps,
	tabSettings: any,
	description: any,
	hasUpdate: boolean,
	onUpdate: (hasUpdate: boolean) => void,
}): MixedElement => {
	return (
		<VStack>
			<HStack justifyContent={'space-between'}>
				<h3 className={'blockera-settings-panel panel-title'}>
					{tab.title}
				</h3>

				<Update
					tab={tab}
					onUpdate={onUpdate}
					hasUpdate={hasUpdate}
					slugSettings={tabSettings}
				/>
			</HStack>
			<div className={'blockera-settings-panel-desc'}>{description}</div>
		</VStack>
	);
};
