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
} from '@blockera/editor-extensions/js/libs';

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

delete sharedBlockStates.active;

export const Avatar = {
	name: 'blockeraAvatar',
	targetBlock: 'core/avatar',
	attributes,
	supports,
	availableBlockStates: sharedBlockStates,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
