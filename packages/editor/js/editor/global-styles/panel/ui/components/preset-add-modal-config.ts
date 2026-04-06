/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { AddVariableModalConfig } from './types';

/**
 * Shared copy for “add preset” modals, matching the spacing panel pattern.
 *
 * @param headerTitle       Modal title (e.g. “Add Spacing Size”).
 * @param newPresetTypeLabel Short translated phrase for the preset kind (e.g. “spacing size”, “font size”).
 * @param controlNamePrefix  Prefix for control context names.
 */
export function buildPresetAddModalConfig({
	headerTitle,
	newPresetTypeLabel,
	controlNamePrefix,
}: {
	headerTitle: string;
	newPresetTypeLabel: string;
	controlNamePrefix: string;
}): AddVariableModalConfig {
	return {
		headerTitle,
		description: sprintf(
			/* translators: %s: preset kind, e.g. “spacing size” or “font size”. */
			__(
				'Name your new %s preset. The ID will be generated from the name and used in your styles.',
				'blockera'
			),
			newPresetTypeLabel
		),
		duplicateSlugMessage: sprintf(
			/* translators: %s: preset kind, e.g. “spacing size” or “font size”. */
			__('This ID is already used by another %s preset.', 'blockera'),
			newPresetTypeLabel
		),
		controlNamePrefix,
	};
}
