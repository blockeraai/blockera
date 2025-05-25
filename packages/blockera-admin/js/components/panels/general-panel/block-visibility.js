// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import { UserRoles } from './user-roles';
import { PostTypes } from './post-types';
export type BlockVisibilityProps = {
	config: Object,
	settings: Object,
	setSettings: Function,
	setHasUpdates: Function,
	generalSettings: Object,
	savedGeneralSettings: Object,
};

export const BlockVisibility = ({
	config,
	settings,
	setSettings,
	setHasUpdates,
	generalSettings,
	savedGeneralSettings,
}: BlockVisibilityProps): MixedElement => (
	<>
		<UserRoles
			settings={settings}
			setSettings={setSettings}
			setHasUpdates={setHasUpdates}
			generalSettings={generalSettings}
			savedGeneralSettings={savedGeneralSettings}
			config={config.general}
		/>

		<PostTypes
			settings={settings}
			setSettings={setSettings}
			setHasUpdates={setHasUpdates}
			generalSettings={generalSettings}
			savedGeneralSettings={savedGeneralSettings}
			config={config.general}
		/>
	</>
);
