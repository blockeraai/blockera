// @flow
/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { pascalCase } from '@blockera/utils';

/**
 * In the block variable picker, theme/default preset repeater titles use the generic
 * “Theme Variables” / “Default Variables” copy. Replace that origin word with the
 * active variable type in PascalCase (e.g. font-size → FontSize).
 *
 * @param presetType Variable slug from the picker (e.g. spacing, font-size).
 * @param origin Preset origin (theme, default, custom, …).
 * @param label Default repeater section label (e.g. “Theme Variables”).
 * @return {string} Resolved label for the variable-picker context only; callers gate usage.
 */
export function resolveVariablePickerPresetGroupLabel(
	presetType: string,
	origin: string | string[],
	label: string
): string {
	if (typeof origin !== 'string') {
		return label;
	}
	if (origin !== 'theme' && origin !== 'default') {
		return label;
	}

	return sprintf(
		/* translators: %s: Preset kind in PascalCase (e.g. FontSize, Spacing). */
		__('%s Variables', 'blockera'),
		pascalCase(presetType)
	);
}
