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

export const AccordionHeading: BlockType = {
	name: 'blockeraAccordionHeading',
	targetBlock: 'core/accordion-heading',
	blockeraInnerBlocks: {
		'elements/icon': {
			name: 'elements/icon',
			label: __('Icon', 'blockera'),
			description: __('Plus icon of accordion items.', 'blockera'),
			icon: <Icon icon="block-accordion-icon" iconSize="20" />,
			settings: {
				force: true,
				priority: 0,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
