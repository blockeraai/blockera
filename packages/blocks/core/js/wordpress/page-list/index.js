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

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

export const PageList = {
	name: 'blockeraPageList',
	targetBlock: 'core/page-list',
	attributes,
	supports,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
