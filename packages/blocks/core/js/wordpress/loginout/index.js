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
} from '@blockera/editor';

/**
 * Internal dependencies
 */
import form from '../inners/form';

export const Loginout = {
	name: 'blockeraLoginout',
	targetBlock: 'core/loginout',
	blockeraInnerBlocks: form,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
