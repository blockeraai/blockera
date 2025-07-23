// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { generalInnerBlockStates } from '@blockera/editor/js/extensions/libs/block-card/block-states/states';

export const icon = {
	block: {
		status: true,
		inspector: {
			status: true,
			tabPosition: 'blockera-inspector-settings-start',
			innerBlocks: {},
			blockStates: {},
		},
		htmlEditable: {
			status: true,
		},
		contextualToolbar: {
			status: false,
			type: 'none',
		},
		innerBlocks: {
			status: true,
			items: {
				'elements/icon': {
					name: 'elements/icon',
					label: __('Icons', 'blockera'),
					description: __('All icon elements.', 'blockera'),
					icon: (
						<Icon icon="star-filled" library="wp" iconSize="20" />
					),
					settings: {
						force: false,
						priority: 10,
					},
					availableBlockStates: {
						...generalInnerBlockStates,
						focus: {
							...generalInnerBlockStates.focus,
							force: true,
						},
					},
				},
			},
		},
		blockStates: {
			status: false,
		},
	},
};
