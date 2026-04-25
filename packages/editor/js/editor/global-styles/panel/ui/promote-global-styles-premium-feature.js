// @flow

/**
 * External dependencies
 */
import { type MixedElement } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { UpgradePrompt, Flex } from '@blockera/controls';
import { Icon } from '@blockera/icons';

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
			data-test={'promote-global-styles-premium-feature'}
			lockedFeature={{
				icon: <Icon icon="style-variations" iconSize={22} />,
				title: __('Unlimited Style Variations', 'blockera'),
				description: (
					<Flex direction="column" gap="6px">
						{__(
							'Create unlimited custom global style variations',
							'blockera'
						)}
						<Flex direction="row" gap="6px">
							<span className="blockera-free-plan-hint">
								{__('Free: Only 1', 'blockera')}
							</span>
							<span className="blockera-pro-plan-hint">
								{__('Pro: Unlimited', 'blockera')}
							</span>
						</Flex>
					</Flex>
				),
			}}
			isOpen={isOpen}
			onClose={onClose}
		/>
	);
};
