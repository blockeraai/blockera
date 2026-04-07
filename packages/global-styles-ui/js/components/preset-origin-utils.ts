/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useCallback, useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { pascalCase } from '@blockera/utils';

/**
 * Repeater section label: "Theme Variables", "Custom Variables", etc.
 */
export function getOriginVariablesLabel(origin: string): string {
	return sprintf(
		/* translators: %s: Origin name (Theme, Default, or Custom) */
		__('%s Variables', 'blockera'),
		pascalCase(origin)
	);
}

/**
 * Body copy and primary action label for removing (custom) or resetting (theme/default) presets.
 *
 * @param presetKindPhrase Translated short name for the preset family, e.g. __("spacing size", "blockera").
 */
export function getOriginResetDialogCopy(
	origin: string,
	presetKindPhrase: string
): { dialogText: string; confirmButtonText: string } {
	const dialogText =
		origin === 'custom'
			? sprintf(
					/* translators: %s: preset kind, e.g. “spacing size” or “linear gradient”. */
					__(
						'Are you sure you want to remove all custom %s presets?',
						'blockera'
					),
					presetKindPhrase
				)
			: sprintf(
					/* translators: %s: preset kind, e.g. “spacing size” or “linear gradient”. */
					__(
						'Are you sure you want to reset all %s presets to their default values?',
						'blockera'
					),
					presetKindPhrase
				);

	const confirmButtonText =
		origin === 'custom'
			? __('Remove', 'blockera')
			: __('Reset', 'blockera');

	return { dialogText, confirmButtonText };
}

/**
 * Open/close state for the shared reset / remove-all dialog.
 */
export function usePresetResetDialogState(): {
	isResetDialogOpen: boolean;
	toggleResetDialog: () => void;
} {
	const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
	const toggleResetDialog = useCallback(() => {
		setIsResetDialogOpen((open) => !open);
	}, []);

	return { isResetDialogOpen, toggleResetDialog };
}
