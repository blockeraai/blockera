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

export const Pullquote: BlockType = {
	name: 'blockeraPullquote',
	targetBlock: 'core/pullquote',
	blockeraInnerBlocks: {
		'elements/citation': {
			name: 'elements/citation',
			label: __('Citation', 'blockera'),
			description: __('The pullquote citation element.', 'blockera'),
			icon: <Icon icon="verse" library="wp" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'core/paragraph': sharedInnerBlocks['core/paragraph'],
		'elements/link': {
			...sharedInnerBlocks['elements/link'],
			settings: {
				...sharedInnerBlocks['elements/link'].settings,
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
