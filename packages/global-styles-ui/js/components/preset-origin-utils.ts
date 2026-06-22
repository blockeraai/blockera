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
 * Theme vs default preset panels (`theme.json` / Site Editor origins)
 *
 * Both helpers use the same three inputs: whether the default *layer* is allowed
 * (e.g. `settings.typography.defaultFontSizes`), and preset counts per origin.
 * Custom origin is always shown elsewhere; these only gate theme and default repeaters.
 *
 * Typical outcomes:
 * - Both origins empty, default layer on → show **theme** only (one empty state).
 * - Theme empty, default layer on, default has items → show **default** only (skip empty theme).
 * - Theme has items → always show **theme**; default row follows `shouldShowDefaultPresetGroup`.
 *
 * Call sites pass identical arguments to both functions so the UI stays consistent.
 * Pure functions: safe to run every render; no memoization required unless profiling says otherwise.
 */
export function shouldShowDefaultPresetGroup(
	defaultLayerEnabled: boolean,
	themeItemCount: number,
	defaultItemCount: number
): boolean {
	return (
		defaultLayerEnabled && !(0 === themeItemCount && 0 === defaultItemCount)
	);
}

export function shouldShowThemePresetGroup(
	defaultLayerEnabled: boolean,
	themeItemCount: number,
	defaultItemCount: number
): boolean {
	return !(
		0 === themeItemCount &&
		defaultLayerEnabled &&
		defaultItemCount > 0
	);
}

/**
 * Repeater section label: "Theme variables", "Custom variables", etc.
 */
export function getOriginVariablesLabel(origin: string): string {
	return sprintf(
		/* translators: %s: Origin name (Theme, Default, or Custom) */
		__('%s variables', 'blockera'),
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
 * Extra warning shown in the repeater single-item delete confirmation (checkbox + confirm).
 * Wording reflects WordPress global styles origins (theme.json layers).
 */
export function getPresetDeleteConfirmWarningText(
	origin: string | string[],
	presetTitle: string
): string {
	const layer = Array.isArray(origin) ? (origin[0] ?? '') : origin;

	if (layer === 'custom') {
		return sprintf(
			/* translators: %s: Preset group title, e.g. “Font Size” or “Spacing”. */
			__(
				'The %s variable will be permanently removed from your site. Any blocks or pages using it will fall back to their default style and need to be updated manually.',
				'blockera'
			),
			presetTitle.toLowerCase()
		);
	}

	if (layer === 'theme') {
		return sprintf(
			/* translators: %s: Preset group title, e.g. “Font Size” or “Spacing”. */
			__(
				'The %s variable is part of your theme’s default styles. Deleting it will reset it to the theme’s default value and may affect your site’s appearance.',
				'blockera'
			),
			presetTitle.toLowerCase()
		);
	}

	if (layer === 'default') {
		return sprintf(
			/* translators: %s: Preset group title, e.g. “Font Size” or “Spacing”. */
			__(
				'The %s variable is part of the default WordPress set. Deleting it will reset it to the default WordPress value and may affect your site’s appearance.',
				'blockera'
			),
			presetTitle.toLowerCase()
		);
	}

	return __(
		'This action cannot be undone. Make sure you want to remove this item.',
		'blockera'
	);
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
