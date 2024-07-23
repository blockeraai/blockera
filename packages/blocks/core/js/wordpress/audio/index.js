// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

export const Audio = {
	name: 'blockeraAudio',
	targetBlock: 'core/audio',
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
