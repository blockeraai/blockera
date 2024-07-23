// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

export const CommentsTitle = {
	name: 'blockeraCommentsTitle',
	targetBlock: 'core/comments-title',
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
