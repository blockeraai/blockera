// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { UpgradePromptProductId } from '../types';
import {
	SiteEditorOfferPill,
	SiteEditorUpgradeRightColumn,
} from './blockera-site-editor';

export type ProductChromeConfig = {|
	OfferPill: () => MixedElement,
	RightColumn: () => MixedElement,
|};

export function getUpgradePromptProductChrome(
	product: UpgradePromptProductId
): ProductChromeConfig {
	switch (product) {
		case 'blockera-site-editor':
		default:
			return {
				OfferPill: SiteEditorOfferPill,
				RightColumn: SiteEditorUpgradeRightColumn,
			};
	}
}
