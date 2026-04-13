/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Placeholder body for the preset popover in the variable-picker fallback repeater.
 * Selection is performed from the row header; this panel is not used to edit catalog presets.
 */
export function FallbackPresetFields() {
	return (
		<p style={{ margin: 0, fontSize: '12px', opacity: 0.75 }}>
			{__(
				'Choose a variable from the list. These presets are managed in global styles.',
				'blockera'
			)}
		</p>
	);
}
