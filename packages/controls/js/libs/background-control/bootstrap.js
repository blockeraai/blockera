// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { updateConfig } from '@blockera/editor-extensions';

/**
 * Internal dependencies
 */
import TypeImageIcon from './icons/type-image';
import TypeLinearGradientIcon from './icons/type-linear-gradient';
import TypeRadialGradientIcon from './icons/type-radial-gradient';
import { default as TypeMeshGradientIcon } from './icons/type-mesh-gradient';

export const backgroundBootstrapper = (): void => {
	return updateConfig('backgroundConfig', {
		blockeraBackground: {
			config: {
				types: [
					{
						label: __('Image', 'blockera'),
						value: 'image',
						icon: <TypeImageIcon />,
					},
					{
						label: __('Linear Gradient', 'blockera'),
						value: 'linear-gradient',
						icon: <TypeLinearGradientIcon />,
					},
					{
						label: __('Radial Gradient', 'blockera'),
						value: 'radial-gradient',
						icon: <TypeRadialGradientIcon />,
					},
					{
						label: __('Mesh Gradient', 'blockera'),
						value: 'mesh-gradient',
						icon: <TypeMeshGradientIcon />,
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
