// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	sharedBlockStates,
	SharedBlockExtension,
	sharedBlockExtensionSupports,
	sharedBlockExtensionAttributes,
} from '@blockera/editor';

delete sharedBlockStates.active;

export const Avatar = {
	name: 'blockeraAvatar',
	targetBlock: 'core/avatar',
	availableBlockStates: sharedBlockStates,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
