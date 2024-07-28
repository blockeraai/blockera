// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/inner-blocks/types';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import link from '../inners/link';

const blockeraInnerBlocks: InnerBlocks = {
	'core/separator': {
		name: 'core/separator',
		label: __('Separator', 'blockera'),
		icon: <Icon icon="block-post-terms-separator" iconSize="20" />,
		settings: {
			force: true,
		},
	},
	'elements/prefix': {
		name: 'elements/prefix',
		label: __('Prefix Text', 'blockera'),
		icon: <Icon icon="block-post-terms-prefix" iconSize="20" />,
		settings: {
			force: true,
		},
	},
	'elements/suffix': {
		name: 'elements/suffix',
		label: __('Suffix Text', 'blockera'),
		icon: <Icon icon="block-post-terms-suffix" iconSize="20" />,
		settings: {
			force: true,
		},
	},
};

export const PostTerms = {
	name: 'blockeraPostTerms',
	targetBlock: 'core/post-terms',
	blockeraInnerBlocks: {
		...link,
		...blockeraInnerBlocks,
	},
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
