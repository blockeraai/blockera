// @flow
/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * In the block variable picker, theme/default preset repeater titles use the generic
 * “Theme Variables” / “Default Variables” copy. Replace that origin word with the
 * preset-group `title` from the consumer (e.g. translated “Font Size”).
 *
 * @param presetTitle Consumer `title` prop passed to PresetGroup.
 * @param origin Preset origin (theme, default, custom, …).
 * @param label Default repeater section label (e.g. “Theme Variables”).
 * @return {string} Resolved label for the variable-picker context only; callers gate usage.
 */
export function resolveVariablePickerPresetGroupLabel(
	presetTitle: string,
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
		/* translators: %s: Preset group title from the consumer (e.g. Font Size, Spacing). */
		__('%s Variables', 'blockera'),
		presetTitle
	);
}
