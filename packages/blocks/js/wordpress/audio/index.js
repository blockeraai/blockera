// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	SharedBlockExtension,
	sharedBlockExtensionSupports,
	sharedBlockExtensionAttributes,
} from '@blockera/editor/js/extensions/libs';

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

export const Audio = {
	name: 'blockeraAudio',
	targetBlock: 'core/audio',
	attributes,
	supports,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
