// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */

/**
 * Internal dependencies
 */
import type { ProHighlightSpec } from '../../types';
import IconBlockStates from './icons/block-states.svg';
import IconResponsiveBreakpoints from './icons/responsive-breakpoints.svg';
import IconPatterns from './icons/patterns.svg';
import IconAnimations from './icons/animations.svg';

export const SITE_EDITOR_DEFAULT_UPGRADE_URL =
	'https://blockera.ai/products/site-builder/upgrade/?utm_source=editor&utm_medium=upgrade-prompt&utm_campaign=pro-upgrade';

export const SITE_EDITOR_FULL_FEATURES_URL =
	'https://blockera.ai/products/site-builder/upgrade/?utm_source=editor&utm_medium=upgrade-prompt&utm_campaign=full-feature-list#features';

export const SITE_EDITOR_OFFER_URL =
	'https://blockera.ai/products/site-builder/upgrade/?utm_source=editor&utm_medium=upgrade-prompt&utm_campaign=limited-offer-15';

export function getSiteEditorDefaultProHighlights(): Array<ProHighlightSpec> {
	return [
		{
			icon: <IconResponsiveBreakpoints />,
			title: __('7+ Responsive breakpoints', 'blockera'),
			description: __(
				'Design pixel-perfect layouts at every screen size',
				'blockera'
			),
		},
		{
			icon: <IconBlockStates />,
			title: __('Block states (Hover, focus…)', 'blockera'),
			description: __(
				'Style every interaction state separately',
				'blockera'
			),
		},
		{
			icon: <IconPatterns />,
			title: __('200+ Pattern library', 'blockera'),
			description: __(
				'Production-ready patterns you can drop in',
				'blockera'
			),
		},
		{
			icon: <IconAnimations />,
			title: __('40+ Animations', 'blockera'),
			description: __(
				'Entrance, hover, scroll triggers animations',
				'blockera'
			),
		},
	];
}
