// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

export const PageList = {
	name: 'blockeraPageList',
	targetBlock: 'core/page-list',
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
