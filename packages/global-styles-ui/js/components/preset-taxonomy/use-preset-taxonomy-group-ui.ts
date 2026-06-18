/**
 * External dependencies
 */
import { useCallback, useMemo, useRef } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { isEquals } from '@blockera/utils';
import { useVarPickerPresetContext } from '@blockera/controls';

/**
 * Internal dependencies
 */
import type { TaxonomyGroupBranch } from './types';
import {
	buildTaxonomyTree,
	partitionPresetsForTaxonomyUi,
} from './partition-and-tree';
import { mergeSimpleRepeaterIntoFullPalette } from './merge-palette-after-simple-repeater';
import { mergeTaxonomyRepeaterPayloadBySlug } from './merge-taxonomy-repeater-payload';
import { presetsBySlugMap } from './parse-preset-name-taxonomy';
import { isPresetTaxonomyGroupedUiEnabled } from './use-preset-taxonomy-grouped-ui-enabled';
import { usePresetTaxonomyEditSession } from './preset-taxonomy-edit-session-context';
import { type PresetVariationsContextValue } from '../../context/preset-variations-context';

export type UsePresetTaxonomyGroupUiConfig<
	TItem extends Record<string, unknown>,
> = {
	items: TItem[];
	baseItems?: TItem[];
	origin: string;
	controlName: string;
	/** When true, taxonomy UI is suppressed (e.g. color picker search flatten). */
	suppressTaxonomyUi?: boolean;
	convertRepeaterToItems: (payload: object, baseline: TItem[]) => TItem[];
	onPersistItems: (items: TItem[]) => void;
	/**
	 * Augment each main-list row (e.g. shade `renderRepeaterItem`, `hasVariations`).
	 * Receives the row after default taxonomy flags are applied.
	 */
	augmentMainItem?: (
		row: TItem,
		ctx: {
			showTaxonomyUi: boolean;
			taxonomySlugSet: Set<string>;
			simpleSlugSet: Set<string>;
		}
	) => TItem;
	/** After simple repeater merge, before persist (e.g. keep color shades). */
	mergeAfterSimpleChange?: (
		previousFull: TItem[],
		mergedFlat: TItem[]
	) => TItem[];
	/** After taxonomy repeater slug-map merge (e.g. keep color shades). */
	mergeAfterTaxonomyChange?: (
		baseline: TItem[],
		mergedFull: TItem[]
	) => TItem[];
};

export type UsePresetTaxonomyGroupUiResult<
	TItem extends Record<string, unknown>,
> = {
	showTaxonomyUi: boolean;
	mainItems: TItem[];
	taxonomyTree: TaxonomyGroupBranch<TItem>[];
	taxonomyBridgeMainItems: TItem[];
	partition: ReturnType<typeof partitionPresetsForTaxonomyUi<TItem>>;
	taxonomyRepeaterDefaults: Record<string, unknown>;
	variationsContextValue: PresetVariationsContextValue<unknown>;
	onSimpleRepeaterChange: (newValue: object) => void;
	mergeTaxonomyRepeaterIntoPersisted: (
		payload: object,
		baselineItems: TItem[]
	) => TItem[];
	setFullItems: (next: TItem[]) => void;
	suppressThemeRepeaterWhenTaxonomyBasePopulated: boolean;
};

export function usePresetTaxonomyGroupUi<
	TItem extends Record<string, unknown>,
>({
	items,
	baseItems,
	origin,
	suppressTaxonomyUi = false,
	convertRepeaterToItems,
	onPersistItems,
	augmentMainItem,
	mergeAfterSimpleChange,
	mergeAfterTaxonomyChange,
}: UsePresetTaxonomyGroupUiConfig<TItem>): UsePresetTaxonomyGroupUiResult<TItem> {
	const pickerCtx = useVarPickerPresetContext();
	const { activeSessionCount } = usePresetTaxonomyEditSession();

	const baseItemsTyped = baseItems as TItem[] | undefined;

	const committedPartition = useMemo(
		() => partitionPresetsForTaxonomyUi(items, baseItemsTyped),
		[items, baseItemsTyped]
	);

	const showTaxonomyUi =
		!suppressTaxonomyUi &&
		committedPartition.taxonomyPresets.length > 0 &&
		(pickerCtx.active !== true || isPresetTaxonomyGroupedUiEnabled());

	const simpleSlugSet = useMemo(
		() =>
			new Set(
				committedPartition.simplePresets.map((p) =>
					String(p.slug ?? '')
				)
			),
		[committedPartition.simplePresets]
	);

	const defaultMainItems = useMemo(() => {
		const ctx = {
			showTaxonomyUi,
			taxonomySlugSet: committedPartition.taxonomySlugSet,
			simpleSlugSet,
		};
		return items.map((row) => {
			const slug = String(row.slug ?? '');
			let renderRepeaterItem = true;
			if (showTaxonomyUi) {
				if (committedPartition.taxonomySlugSet.has(slug)) {
					renderRepeaterItem = false;
				} else {
					renderRepeaterItem = simpleSlugSet.has(slug);
				}
			}
			const withFlags = {
				...row,
				renderRepeaterItem,
			} as TItem;
			return augmentMainItem
				? augmentMainItem(withFlags, ctx)
				: withFlags;
		});
	}, [
		items,
		showTaxonomyUi,
		committedPartition.taxonomySlugSet,
		simpleSlugSet,
		augmentMainItem,
	]);

	const committedTree = useMemo(
		() =>
			buildTaxonomyTree(
				committedPartition.taxonomyPresets,
				defaultMainItems,
				baseItemsTyped
			),
		[committedPartition.taxonomyPresets, defaultMainItems, baseItemsTyped]
	);

	const frozenTreeRef = useRef<TaxonomyGroupBranch<TItem>[]>(committedTree);
	const frozenPartitionRef = useRef(committedPartition);

	if (activeSessionCount === 0) {
		frozenTreeRef.current = committedTree;
		frozenPartitionRef.current = committedPartition;
	}

	const partition =
		activeSessionCount > 0
			? frozenPartitionRef.current
			: committedPartition;
	const taxonomyTree =
		activeSessionCount > 0 ? frozenTreeRef.current : committedTree;
	const mainItems = defaultMainItems;

	const taxonomyBridgeMainItems = useMemo(() => {
		if (!showTaxonomyUi) {
			return [] as TItem[];
		}
		return mainItems;
	}, [mainItems, showTaxonomyUi]);

	const taxonomyRepeaterDefaults = useMemo(
		() => ({
			isVisible: true,
			renderRepeaterItem: true,
			deletable: false,
			cloneable: false,
			visibilitySupport: false,
		}),
		[]
	);

	const setFullItems = useCallback(
		(next: TItem[]) => {
			if (isEquals(next, items)) {
				return;
			}
			onPersistItems(next);
		},
		[items, onPersistItems]
	);

	const onSimpleRepeaterChange = useCallback(
		(newValue: object) => {
			const nextMain = convertRepeaterToItems(newValue, items);
			const mergedFlat = showTaxonomyUi
				? mergeSimpleRepeaterIntoFullPalette(
						items,
						nextMain,
						partition.taxonomySlugSet
					)
				: nextMain;
			const merged = mergeAfterSimpleChange
				? mergeAfterSimpleChange(items, mergedFlat)
				: mergedFlat;
			if (isEquals(merged, items)) {
				return;
			}
			onPersistItems(merged);
		},
		[
			convertRepeaterToItems,
			items,
			mergeAfterSimpleChange,
			onPersistItems,
			partition.taxonomySlugSet,
			showTaxonomyUi,
		]
	);

	const mergeTaxonomyRepeaterIntoPersisted = useCallback(
		(payload: object, baselineItems: TItem[]) => {
			const mergedFull = mergeTaxonomyRepeaterPayloadBySlug(
				payload,
				baselineItems,
				convertRepeaterToItems
			);
			return mergeAfterTaxonomyChange
				? mergeAfterTaxonomyChange(baselineItems, mergedFull)
				: mergedFull;
		},
		[convertRepeaterToItems, mergeAfterTaxonomyChange]
	);

	const variationsContextValue = useMemo(
		(): PresetVariationsContextValue<unknown> => ({
			origin,
			setFullItems: (next) => setFullItems(next as TItem[]),
			fullItems: items,
			taxonomyNameSource:
				Array.isArray(baseItemsTyped) && baseItemsTyped.length > 0
					? {
							basePresetsBySlug: presetsBySlugMap(baseItemsTyped),
						}
					: undefined,
		}),
		[origin, items, setFullItems, baseItemsTyped]
	);

	const suppressThemeRepeaterWhenTaxonomyBasePopulated =
		showTaxonomyUi &&
		taxonomyTree.length > 0 &&
		partition.simplePresets.length === 0;

	return {
		showTaxonomyUi,
		mainItems,
		taxonomyTree,
		taxonomyBridgeMainItems,
		partition,
		taxonomyRepeaterDefaults,
		variationsContextValue,
		onSimpleRepeaterChange,
		mergeTaxonomyRepeaterIntoPersisted,
		setFullItems,
		suppressThemeRepeaterWhenTaxonomyBasePopulated,
	};
}
