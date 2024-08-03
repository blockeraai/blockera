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

export const Quote: BlockType = {
	name: 'blockeraQuote',
	targetBlock: 'core/quote',
	blockeraInnerBlocks: {
		'elements/citation': {
			name: 'elements/citation',
			label: __('Citation', 'blockera'),
			icon: <Icon icon="verse" library="wp" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'core/paragraph': sharedInnerBlocks['core/paragraph'],
		'elements/link': sharedInnerBlocks['elements/link'],
		'core/heading': sharedInnerBlocks['core/heading'],
		'core/heading-1': sharedInnerBlocks['core/heading-1'],
		'core/heading-2': sharedInnerBlocks['core/heading-2'],
		'core/heading-3': sharedInnerBlocks['core/heading-3'],
		'core/heading-4': sharedInnerBlocks['core/heading-4'],
		'core/heading-5': sharedInnerBlocks['core/heading-5'],
		'core/heading-6': sharedInnerBlocks['core/heading-6'],
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
