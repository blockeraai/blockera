/**
 * External dependencies
 */
import type { ElementType } from 'react';
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { VariableType } from '../types';
import type { PresetFieldsPropsResolver } from '../preset-group';

export type PresetTaxonomyPresetFieldsProps = {
	item: VariableType;
	itemId: string | number;
	origin: string | string[];
	PresetFields: ElementType;
	presetFieldsPropsResolver?: PresetFieldsPropsResolver;
};

/** Renders preset detail fields inside taxonomy bridge rows (feature-agnostic slot). */
export function PresetTaxonomyPresetFields({
	item,
	itemId,
	origin,
	PresetFields,
	presetFieldsPropsResolver,
}: PresetTaxonomyPresetFieldsProps) {
	const fieldsProps = useMemo(
		() => presetFieldsPropsResolver?.(item, itemId, origin) || {},
		[item, itemId, origin, presetFieldsPropsResolver]
	);

	return <PresetFields {...fieldsProps} />;
}
