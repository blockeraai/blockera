/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { memo, useCallback, useMemo } from '@wordpress/element';
import { __experimentalVStack as VStack } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import {
	PRESET_VARIABLES_SECTION_GAP,
	useVarPickerPresetContext,
	VarPickerPresetContext,
} from '@blockera/controls';
import {
	normalizeSizeThemeJsonPreset,
	BLOCKERA_GLOBAL_SETTING_PATH,
} from '@blockera/data';

/**
 * Internal dependencies
 */
import {
	createPresetFieldsPropsResolver,
	getNewIndexFromPresets,
	getOriginVariablesLabel,
	withPresetMetaFromRepeaterRow,
} from '../components';
import { FallbackPresetContent } from '../components/fallback-preset-content';
import { PresetGroup } from '../components/preset-group';
import { useGlobalSetting } from '../context/global-style-hooks';
import { type VariableType } from '../components/types';
import {
	WidthSizeField,
	type WidthSizeDefaultPresetValue,
} from './width-size-field';
import { WidthSizePresetOpener } from './width-size-preset-opener';

type WidthSizePreset = {
	slug: string;
	name: string;
	size: string;
};

const widthSizePresetFieldsPropsResolver =
	createPresetFieldsPropsResolver('widthSize');

function normalizeWidthSizePresetsForUi(
	presets: WidthSizePreset[] | void | null
): WidthSizePreset[] {
	if (!Array.isArray(presets)) {
		return [];
	}

	return presets.map(
		(preset) => normalizeSizeThemeJsonPreset(preset) as WidthSizePreset
	);
}

function WidthSizeCatalogFallback() {
	const pickerCtx = useVarPickerPresetContext();
	const catalogItems = useMemo(
		() =>
			(pickerCtx.catalogItems ?? []).filter(
				(item) => item.reference?.type !== 'custom'
			),
		[pickerCtx.catalogItems]
	);

	return (
		<VarPickerPresetContext.Provider
			value={{
				...pickerCtx,
				catalogItems,
				disablePresetRowEdit: true,
				omitRepeaterSectionLabel: true,
			}}
		>
			<FallbackPresetContent />
		</VarPickerPresetContext.Provider>
	);
}

function WidthSizeCustomGroupComponent({
	sizes,
	persistSizes,
}: {
	sizes: WidthSizePreset[];
	persistSizes: (items: WidthSizePreset[]) => void;
}) {
	const index = useMemo(
		() => getNewIndexFromPresets(sizes, 'width-size-'),
		[sizes]
	);

	const defaultPresetValue = useMemo((): WidthSizeDefaultPresetValue &
		VariableType => {
		return {
			size: '640px',
			isVisible: true,
			slug: `width-size-${index}`,
			deletable: true,
			cloneable: true,
			visibilitySupport: true,
			/* translators: %d: width size preset index */
			name: sprintf(__('Width size %d', 'blockera'), index) as string,
		};
	}, [index]);

	const convertRepeaterValueToArray = useCallback(
		(newValue: Object): WidthSizePreset[] =>
			normalizeWidthSizePresetsForUi(
				Object.values(
					newValue as Record<
						string,
						WidthSizePreset & Record<string, unknown>
					>
				).map((value) =>
					withPresetMetaFromRepeaterRow(value, {
						slug: value.slug,
						name: value.name,
						size: value.size,
						isVisible: value.isVisible,
					})
				)
			),
		[]
	);

	const handleChange = useCallback(
		(newValue: Object) => {
			persistSizes(convertRepeaterValueToArray(newValue));
		},
		[persistSizes, convertRepeaterValueToArray]
	);

	const variables = useMemo(() => {
		const out: Record<string, WidthSizePreset & Record<string, unknown>> =
			{};
		sizes.forEach((item, orderIndex) => {
			const slug = String(item.slug);
			out[slug] = {
				...item,
				slug,
				order: orderIndex + 1,
				isVisible: item.isVisible !== false,
				selectable: true,
				deletable: true,
				cloneable: true,
				visibilitySupport: true,
			};
		});
		return out;
	}, [sizes]);

	return (
		<PresetGroup
			repeaterItemHeader={WidthSizePresetOpener}
			onChange={handleChange}
			controlName="width-size-presets-custom"
			defaultPresetValue={defaultPresetValue}
			origin="custom"
			variables={variables as never}
			PresetFields={WidthSizeField}
			title={__('Width Size', 'blockera')}
			label={getOriginVariablesLabel('custom')}
			enableCreatingStep={true}
			presetFieldsPropsResolver={widthSizePresetFieldsPropsResolver}
		/>
	);
}

const WidthSizeCustomGroup = memo(WidthSizeCustomGroupComponent);

/**
 * Variable picker panel for width-size: read-only layout catalog + editable custom presets.
 */
export function WidthSizePresetContent() {
	const [rawCustomWidthSizes = [], setCustomWidthSizes] = useGlobalSetting(
		BLOCKERA_GLOBAL_SETTING_PATH.WIDTH_SIZES_CUSTOM
	);

	const customSizesForUi = useMemo(
		() =>
			normalizeWidthSizePresetsForUi(
				rawCustomWidthSizes as WidthSizePreset[]
			),
		[rawCustomWidthSizes]
	);

	const persistCustomSizes = useCallback(
		(next: WidthSizePreset[]) => {
			setCustomWidthSizes(next);
		},
		[setCustomWidthSizes]
	);

	return (
		<VStack
			spacing={PRESET_VARIABLES_SECTION_GAP}
			style={{ width: '100%' }}
		>
			<WidthSizeCatalogFallback />
			<WidthSizeCustomGroup
				sizes={customSizesForUi}
				persistSizes={persistCustomSizes}
			/>
		</VStack>
	);
}
