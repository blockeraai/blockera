// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import sharedInnerBlocks from '../inners/shared';
import type { BlockType } from '../../type';

export const PostTerms: BlockType = {
	name: 'blockeraPostTerms',
	targetBlock: 'core/post-terms',
	blockeraInnerBlocks: {
		'elements/link': {
			...sharedInnerBlocks['elements/link'],
			label: __('Term', 'blockera'),
			description: __('All term elements.', 'blockera'),
		},
		'core/separator': {
			name: 'core/separator',
			label: __('Separator', 'blockera'),
			description: __('The terms separator element.', 'blockera'),
			icon: <Icon icon="block-post-terms-separator" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/prefix': {
			name: 'elements/prefix',
			label: __('Prefix Text', 'blockera'),
			description: __('The terms prefix text element.', 'blockera'),
			icon: <Icon icon="block-post-terms-prefix" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/suffix': {
			name: 'elements/suffix',
			label: __('Suffix Text', 'blockera'),
			description: __('The terms suffix text element.', 'blockera'),
			icon: <Icon icon="block-post-terms-suffix" iconSize="20" />,
			settings: {
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
