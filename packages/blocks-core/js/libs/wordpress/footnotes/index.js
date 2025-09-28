// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
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
import type { BlockType } from '../../../type';

export const Footnotes: BlockType = {
	name: 'blockeraFootnotes',
	targetBlock: 'core/footnotes',
	blockeraInnerBlocks: {
		'elements/link': {
			...sharedInnerBlocks['elements/link'],
			icon: <Icon icon="block-footnote-return" iconSize="20" />,
			label: __('Jump to Footnote Links', 'blockera'),
			description: __('The links to the footnote reference.', 'blockera'),
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
