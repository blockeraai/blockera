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
	defaultValue,
}: {
	tab: TTabProps,
	tabSettings: any,
	defaultValue: any,
	hasUpdate: boolean,
	description: string,
	onUpdate: (hasUpdate: boolean) => void,
}): MixedElement => {
	return (
		<VStack>
			<HStack justifyContent={'space-between'}>
				<h3 className={'blockera-settings-panel panel-title'}>
					{tab.title}
				</h3>

				<Update
					onUpdate={onUpdate}
					hasUpdate={hasUpdate}
					slug={tab?.settingSlug}
					slugSettings={tabSettings}
					defaultValue={defaultValue}
				/>
			</HStack>
			<div className={'blockera-settings-panel-desc'}>{description}</div>
		</VStack>
	);
};
