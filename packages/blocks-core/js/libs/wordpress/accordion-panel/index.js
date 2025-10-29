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
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
