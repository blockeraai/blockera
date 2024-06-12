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
	sharedBlockExtensionAttributes as attributes,
	sharedBlockExtensionSupports as supports,
} from '@blockera/editor/js/extensions/libs';

export const Shared = {
	name: 'Shared',
	attributes,
	supports,
	edit: ({ children, ...props }: Object): MixedElement => {
		return (
			<SharedBlockExtension {...props}>{children}</SharedBlockExtension>
		);
	},
};
