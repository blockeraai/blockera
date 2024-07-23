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
	'core/avatar': {
		name: 'core/avatar',
		type: 'avatar',
		label: __('Avatar', 'blockera'),
		icon: <Icon icon="block-post-author-avatar" iconSize="20" />,
		settings: {
			force: true,
		},
	},
	'elements/byline': {
		name: 'elements/byline',
		type: 'byline',
		label: __('Byline', 'blockera'),
		icon: <Icon icon="block-post-author-byline" iconSize="20" />,
		settings: {
			force: true,
		},
	},
	'elements/author': {
		name: 'elements/author',
		type: 'author',
		label: __('Name', 'blockera'),
		icon: <Icon icon="block-post-author-name" iconSize="20" />,
		settings: {
			force: true,
		},
	},
};

export const PostAuthor = {
	name: 'blockeraPostAuthor',
	targetBlock: 'core/post-author',
	blockeraInnerBlocks: {
		...blockeraInnerBlocks,
		...link,
	},
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
