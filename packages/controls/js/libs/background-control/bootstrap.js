// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { updateConfig } from '@blockera/utils';
import { Icon } from '@blockera/icons';

export const backgroundBootstrapper = (): void => {
	return updateConfig('backgroundConfig', {
		blockeraBackground: {
			config: {
				types: [
					{
						label: __('Image', 'blockera'),
						value: 'image',
						icon: <Icon icon="background-image" iconSize="18" />,
					},
					{
						label: __('Linear Gradient', 'blockera'),
						value: 'linear-gradient',
						icon: (
							<Icon
								icon="background-linear-gradient"
								iconSize="18"
							/>
						),
					},
					{
						label: __('Radial Gradient', 'blockera'),
						value: 'radial-gradient',
						icon: (
							<Icon
								icon="background-radial-gradient"
								iconSize="18"
							/>
						),
					},
					{
						label: __('Mesh Gradient', 'blockera'),
						value: 'mesh-gradient',
						icon: (
							<Icon
								icon="background-mesh-gradient"
								iconSize="18"
							/>
						),
					},
				],
				meshGradientColors: {
					show: true,
					force: true,
					status: true,
					isActiveOnFree: false,
					label: __('Colors', 'blockera'),
				},
			},
		},
	});
};
