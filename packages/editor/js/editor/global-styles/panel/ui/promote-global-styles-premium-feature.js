// @flow

/**
 * External dependencies
 */
import { type MixedElement } from 'react';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { UpgradePrompt, Flex } from '@blockera/controls';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import {
	VARIATION_SURFACE_SIZE,
	VARIATION_SURFACE_STYLE,
} from '../variation-surfaces';

export const PromoteGlobalStylesPremiumFeature = ({
	onClose = () => {},
	isOpen = false,
	variationSurface = VARIATION_SURFACE_STYLE,
}: {
	onClose: () => void,
	isOpen: boolean,
	variationSurface?: string,
}): MixedElement | null => {
	const isSizeSurface = variationSurface === VARIATION_SURFACE_SIZE;

	const lockedFeature = useMemo(
		() => ({
			icon: (
				<Icon
					icon={isSizeSurface ? 'extension-size' : 'style-variations'}
					iconSize={22}
				/>
			),
			title: isSizeSurface
				? __('Unlimited Size Variations', 'blockera')
				: __('Unlimited Style Variations', 'blockera'),
			description: (
				<Flex direction="column" gap="6px">
					{isSizeSurface
						? __(
								'Create unlimited custom global size variations',
								'blockera'
							)
						: __(
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
		}),
		[isSizeSurface]
	);

	return (
		<UpgradePrompt
			type="modal"
			data-test={'promote-global-styles-premium-feature'}
			lockedFeature={lockedFeature}
			isOpen={isOpen}
			onClose={onClose}
		/>
	);
};
