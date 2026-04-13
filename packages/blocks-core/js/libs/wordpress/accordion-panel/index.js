// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import {
	generalBlockStates,
	sharedBlockStates,
	generalInnerBlockStates,
	SharedBlockExtension,
} from '@blockera/editor';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import sharedInnerBlocks from '../inners/shared';
import type { BlockType } from '../../../type';

export const AccordionPanel: BlockType = {
	name: 'blockeraAccordionPanel',
	targetBlock: 'core/accordion-panel',
	blockeraInnerBlocks: {
		'core/paragraph': {
			...sharedInnerBlocks['core/paragraph'],
			settings: {
				...sharedInnerBlocks['core/paragraph'].settings,
				force: true,
			},
		},
		'elements/bold': sharedInnerBlocks['elements/bold'],
		'elements/italic': sharedInnerBlocks['elements/italic'],
		'elements/kbd': sharedInnerBlocks['elements/kbd'],
		'elements/code': sharedInnerBlocks['elements/code'],
		'elements/span': sharedInnerBlocks['elements/span'],
		'elements/mark': sharedInnerBlocks['elements/mark'],
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
