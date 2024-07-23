// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

export const SiteLogo = {
	name: 'blockeraSiteLogo',
	targetBlock: 'core/site-logo',
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
