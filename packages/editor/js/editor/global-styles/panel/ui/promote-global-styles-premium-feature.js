// @flow

/**
 * External dependencies
 */
import { type MixedElement } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { UpgradePrompt } from '@blockera/controls';

export const PromoteGlobalStylesPremiumFeature = ({
	items,
	onClose = () => {},
	isOpen = false,
}: {
	items: Array<Object>,
	onClose: () => void,
	isOpen: boolean,
}): MixedElement | null => {
	if (items.length < 2) {
		return null;
	}

	return (
		<UpgradePrompt
			type="modal"
			heading={__('Advanced Global Styles', 'blockera')}
			data-test={'promote-global-styles-premium-feature'}
			featuresList={[
				__('Multiple styles', 'blockera'),
				__('All styles', 'blockera'),
				__('Advanced features', 'blockera'),
				__('Premium styles', 'blockera'),
			]}
			isOpen={isOpen}
			onClose={onClose}
		/>
	);
};
