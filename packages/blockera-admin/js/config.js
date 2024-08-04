// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

export const config: Object = {
	general: {
		restrictBlockVisibility: {
			status: true,
			label: __(
				'Restrict block visibility controls to selected user roles.',
				'blockera'
			),
			isActiveOnFree: false,
			config: {
				userRole: {
					label: '',
					status: true,
					isActiveOnFree: false,
					isParentActive: false,
					parent: 'Restrict Block Visibility',
				},
			},
		},
	},
};
