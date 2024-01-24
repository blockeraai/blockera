// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	SharedBlockExtension,
	sharedBlockExtensionAttributes as attributes,
	sharedBlockExtensionSupports as supports,
} from '@publisher/extensions';

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
