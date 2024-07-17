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
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/inner-blocks/types';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import link from '../inners/link';

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

const blockeraInnerBlocks: InnerBlocks = {
	separator: {
		name: 'core/separator',
		type: 'separator',
		label: __('Separator', 'blockera'),
		icon: <Icon icon="block-post-terms-separator" iconSize="20" />,
		attributes,
		settings: {
			force: true,
		},
	},
	prefix: {
		name: 'elements/prefix',
		type: 'prefix',
		label: __('Prefix Text', 'blockera'),
		icon: <Icon icon="block-post-terms-prefix" iconSize="20" />,
		attributes,
		settings: {
			force: true,
		},
	},
	suffix: {
		name: 'elements/suffix',
		type: 'suffix',
		label: __('Suffix Text', 'blockera'),
		icon: <Icon icon="block-post-terms-suffix" iconSize="20" />,
		attributes,
		settings: {
			force: true,
		},
	},
};

export const PostTerms = {
	name: 'blockeraPostTerms',
	targetBlock: 'core/post-terms',
	attributes,
	supports,
	blockeraInnerBlocks: {
		...link,
		...blockeraInnerBlocks,
	},
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
