// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
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

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

export const Loginout = {
	name: 'blockeraLoginout',
	targetBlock: 'core/loginout',
	attributes,
	supports,
	blockeraInnerBlocks: form,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
