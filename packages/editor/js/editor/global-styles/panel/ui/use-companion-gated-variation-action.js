// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useState, useCallback } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { CompanionPluginModal } from '@blockera/controls';

/**
 * Gate style/size variation actions behind the companion install modal in theme mode.
 */
export function useCompanionGatedVariationAction(): {
	gateVariationAction: (onAllowed: () => void) => void,
	companionInstallModal: MixedElement | null,
	isCompanionModalOpen: boolean,
} {
	const [isCompanionModalOpen, setIsCompanionModalOpen] = useState(false);
	const isCompanionPlugin = applyFilters(
		'blockera.products.isCompanionPlugin',
		false
	);

	const gateVariationAction = useCallback(
		(onAllowed: () => void) => {
			if (!isCompanionPlugin) {
				setIsCompanionModalOpen(true);
				return;
			}

			onAllowed();
		},
		[isCompanionPlugin]
	);

	const companionInstallModal = isCompanionModalOpen ? (
		<CompanionPluginModal
			isOpen={isCompanionModalOpen}
			onRequestClose={() => setIsCompanionModalOpen(false)}
		/>
	) : null;

	return {
		gateVariationAction,
		companionInstallModal,
		isCompanionModalOpen,
	};
}
