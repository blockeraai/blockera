// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

export const Shared = {
	name: 'Shared',
	edit: ({ children, ...props }: Object): MixedElement => {
		return (
			<SharedBlockExtension {...props}>{children}</SharedBlockExtension>
		);
	},
};
