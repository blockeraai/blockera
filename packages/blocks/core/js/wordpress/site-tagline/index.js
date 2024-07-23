// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

export const SiteTagline = {
	name: 'blockeraSiteTagline',
	targetBlock: 'core/site-tagline',
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
