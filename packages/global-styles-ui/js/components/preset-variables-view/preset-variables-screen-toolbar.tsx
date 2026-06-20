/**
 * External dependencies
 */
import { useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	normalizeVariablePickerSearchQuery,
	PRESET_VARIABLES_SECTION_GAP,
	PresetVariablesSummaryRow,
	useVarPickerPresetContext,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import {
	countPresetVariables,
	type PresetVariablesOriginSet,
} from './count-preset-variables';
import { hasPresetTaxonomyGroupsInOriginSets } from './has-preset-taxonomy-groups';

export type { PresetVariablesOriginSet };

export function PresetVariablesScreenToolbar<
	T extends Record<string, unknown>,
>({
	originSets,
	hideViewSelect = false,
	searchQuery: searchQueryProp,
	withSummaryRowPadding = false,
}: {
	originSets: Array<PresetVariablesOriginSet<T>>;
	hideViewSelect?: boolean;
	searchQuery?: string;
	/** Global-styles colors/gradients: inset summary row with section gap spacing. */
	withSummaryRowPadding?: boolean;
}) {
	const pickerCtx = useVarPickerPresetContext();
	const searchQuery = searchQueryProp ?? pickerCtx.searchQuery ?? '';

	const variableCount = useMemo(
		() => countPresetVariables(originSets, searchQuery),
		[originSets, searchQuery]
	);

	const hasTaxonomyGroups = useMemo(
		() => hasPresetTaxonomyGroupsInOriginSets(originSets),
		[originSets]
	);

	const hideSelect =
		hideViewSelect ||
		(pickerCtx.active === true &&
			normalizeVariablePickerSearchQuery(searchQuery) !== '');

	const summaryRow = (
		<PresetVariablesSummaryRow
			variableCount={variableCount}
			hasTaxonomyGroups={hasTaxonomyGroups}
			hideViewSelect={hideSelect}
		/>
	);

	if (pickerCtx.active === true || !withSummaryRowPadding) {
		return summaryRow;
	}

	return (
		<div
			className="blockera-preset-variables-summary-row-wrapper"
			style={{
				paddingLeft: PRESET_VARIABLES_SECTION_GAP,
				paddingRight: PRESET_VARIABLES_SECTION_GAP,
			}}
		>
			{summaryRow}
		</div>
	);
}
