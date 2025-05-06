// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import sharedInnerBlocks from '../inners/shared';
import type { BlockType } from '../../type';

export const File: BlockType = {
	name: 'blockeraFile',
	targetBlock: 'core/file',
	blockeraInnerBlocks: {
		'elements/link': {
			...sharedInnerBlocks['elements/link'],
			label: __('File Name', 'blockera'),
			description: __('The name of the file.', 'blockera'),
		},
		'core/button': {
			...sharedInnerBlocks['core/button'],
			label: __('Download Button', 'blockera'),
			description: __('A button to download the file.', 'blockera'),
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
