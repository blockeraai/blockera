/**
 * External dependencies
 */
import { type ElementType } from '@wordpress/element';
import { useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	normalizeVariablePickerSearchQuery,
	usePresetVariablesViewMode,
	useVarPickerPresetContext,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import { PresetGroup } from './preset-group';
import type { PresetFieldsPropsResolver } from './preset-group';
import ConfirmResetPresetDialog from './confirm-reset-preset-dialog';
import { usePresetResetDialogState } from './preset-origin-utils';
import { PresetTaxonomyBridge } from './preset-taxonomy-ui/preset-taxonomy-bridge';
import { PresetTaxonomyEditSessionProvider } from './preset-taxonomy/preset-taxonomy-edit-session-context';
import { usePresetTaxonomyGroupUi } from './preset-taxonomy/use-preset-taxonomy-group-ui';
import { PresetTaxonomyGroupBridge } from './preset-taxonomy/preset-taxonomy-group-bridge';
import { PresetVariationsContext } from '../context/preset-variations-context';
import type { VariableType } from './types';

export type PresetTaxonomyGroupLayoutProps<
	TItem extends Record<string, unknown>,
> = {
	origin: string;
	items: TItem[];
	baseItems?: TItem[];
	controlName: string;
	convertRepeaterToItems: (payload: object, baseline: TItem[]) => TItem[];
	onPersistItems: (items: TItem[]) => void;
	PresetFields: ElementType;
	repeaterItemHeader: ElementType;
	presetFieldsPropsResolver?: PresetFieldsPropsResolver;
	defaultPresetValue: VariableType & Record<string, unknown>;
	title: string;
	label: string;
	handleReset?: () => void;
	resetDialogText?: string;
	resetConfirmButtonText?: string;
};

function PresetTaxonomyGroupLayoutInner<TItem extends Record<string, unknown>>({
	origin,
	items,
	baseItems,
	controlName,
	convertRepeaterToItems,
	onPersistItems,
	PresetFields,
	repeaterItemHeader,
	presetFieldsPropsResolver,
	defaultPresetValue,
	title,
	label,
	handleReset,
	resetDialogText = '',
	resetConfirmButtonText = '',
}: PresetTaxonomyGroupLayoutProps<TItem>) {
	const { isResetDialogOpen, toggleResetDialog } =
		usePresetResetDialogState();
	const pickerCtx = useVarPickerPresetContext();
	const { viewMode } = usePresetVariablesViewMode();

	const flattenForPickerSearch = useMemo(
		() =>
			pickerCtx.active === true &&
			typeof pickerCtx.variableType === 'string' &&
			normalizeVariablePickerSearchQuery(pickerCtx.searchQuery) !== '',
		[pickerCtx.active, pickerCtx.searchQuery, pickerCtx.variableType]
	);

	const taxonomy = usePresetTaxonomyGroupUi<TItem>({
		items,
		baseItems,
		origin,
		controlName,
		suppressTaxonomyUi: flattenForPickerSearch || viewMode === 'list',
		convertRepeaterToItems,
		onPersistItems,
	});

	return (
		<>
			{handleReset && isResetDialogOpen && (
				<ConfirmResetPresetDialog
					text={resetDialogText}
					confirmButtonText={resetConfirmButtonText}
					isOpen={isResetDialogOpen}
					toggleOpen={toggleResetDialog}
					onConfirm={handleReset}
				/>
			)}
			<PresetVariationsContext.Provider
				value={taxonomy.variationsContextValue}
			>
				<PresetTaxonomyGroupBridge
					taxonomy={taxonomy}
					controlName={controlName}
					origin={origin}
					baselineItems={items}
					PresetFields={PresetFields}
					repeaterItemHeader={repeaterItemHeader}
					presetFieldsPropsResolver={presetFieldsPropsResolver}
					PresetTaxonomyBridge={PresetTaxonomyBridge}
				/>
				<PresetGroup
					origin={origin}
					variables={taxonomy.mainItems}
					onChange={taxonomy.onSimpleRepeaterChange}
					controlName={controlName}
					title={title}
					PresetFields={PresetFields}
					repeaterItemHeader={repeaterItemHeader}
					defaultPresetValue={defaultPresetValue}
					label={label}
					presetFieldsPropsResolver={presetFieldsPropsResolver}
					suppressThemeRepeaterWhenTaxonomyBasePopulated={
						taxonomy.suppressThemeRepeaterWhenTaxonomyBasePopulated
					}
				/>
			</PresetVariationsContext.Provider>
		</>
	);
}

export function PresetTaxonomyGroupLayout<
	TItem extends Record<string, unknown>,
>(props: PresetTaxonomyGroupLayoutProps<TItem>) {
	return (
		<PresetTaxonomyEditSessionProvider>
			<PresetTaxonomyGroupLayoutInner {...props} />
		</PresetTaxonomyEditSessionProvider>
	);
}
