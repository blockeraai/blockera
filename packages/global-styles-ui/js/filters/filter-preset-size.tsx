/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback, memo, useContext, useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	Flex,
	BaseControl,
	FilterControl,
	RepeaterContext,
	useControlContext,
	ControlContextProvider,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import FilterPresetPreview from './filter-preset-preview';
import { SharedPresetControls } from '../components';
import { type VariableType } from '../components/types';
import { getAllVariableSlugs as getAllFilterSlugs } from '../components/utils';
import {
	itemsToRepeaterRecord,
	repeaterRecordToItems,
	type WpFilterPreset,
	type FilterPresetItem,
} from './utils';

export type FilterDefaultPresetValue = {
	items: FilterPresetItem[];
	deletable: boolean;
	cloneable: boolean;
	isVisible: boolean;
	visibilitySupport: boolean;
};

const FILTER_PRESET_REPEATER_DEFAULT = {
	type: 'blur' as const,
	blur: '3px',
	brightness: '200%',
	contrast: '200%',
	'hue-rotate': '45deg',
	saturate: '200%',
	grayscale: '100%',
	invert: '100%',
	sepia: '100%',
	'drop-shadow-x': '10px',
	'drop-shadow-y': '10px',
	'drop-shadow-blur': '10px',
	'drop-shadow-color': '',
	isVisible: true,
};

function FilterPresetSizeComponent({
	origin,
	filterPreset,
	presetId,
}: {
	origin: string | string[];
	filterPreset: VariableType & FilterDefaultPresetValue & WpFilterPreset;
	presetId: string | number;
}) {
	const { slug } = filterPreset;

	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();
	const {
		onChange,
		repeaterId,
		valueCleanup,
		repeaterItems: presets,
	} = useContext(RepeaterContext) as {
		disableRegenerateId?: boolean;
		onChange: (newValue: unknown) => void;
		valueCleanup: (value: unknown) => unknown;
		repeaterId: string | null | undefined;
		repeaterItems:
			| Record<
					string,
					Array<
						VariableType & FilterDefaultPresetValue & WpFilterPreset
					>
			  >
			| undefined;
		itemIdGenerator?: (itemId: string | number) => string;
	};

	const repeaterItems = useMemo(
		() => itemsToRepeaterRecord(filterPreset.items || []),
		[filterPreset.items]
	);

	const handleFilterChange = useCallback(
		(newValue: Record<string, Record<string, unknown>>) => {
			const items = repeaterRecordToItems(newValue);
			// Defer: inner repeater can dispatch in the same tick; updating the outer preset list
			// synchronously would trigger Redux “getState during reducer” (same as transform / transition presets).
			queueMicrotask(() => {
				changeRepeaterItem({
					onChange,
					valueCleanup,
					controlId,
					repeaterId,
					itemId: presetId,
					value: { ...filterPreset, items },
				});
			});
		},
		[
			changeRepeaterItem,
			onChange,
			valueCleanup,
			controlId,
			repeaterId,
			presetId,
			filterPreset,
		]
	);

	if (!origin || !slug) {
		return null;
	}

	const filterPresetValueControls = (
		<ControlContextProvider
			value={{
				name: `filter-preset-${slug}`,
				value: repeaterItems,
				attribute: 'blockeraFilterPreset',
				blockName: 'global-styles-filters',
			}}
			storeName="blockera/controls/repeater"
		>
			<BaseControl
				controlName={`filter-preset-${slug}`}
				columns="columns-1"
			>
				<FilterControl
					key={slug}
					id={`filter-preset-${slug}`}
					withoutValueAddons
					label={__('Filters', 'blockera')}
					labelDescription={
						<>
							<p>
								{__(
									'Defines the filter preset used in effects filter controls across the site.',
									'blockera'
								)}
							</p>
							<p>
								{__(
									'Stored in theme.json as settings.filter.presets (items array per preset).',
									'blockera'
								)}
							</p>
						</>
					}
					defaultRepeaterItemValue={FILTER_PRESET_REPEATER_DEFAULT}
					defaultValue={repeaterItems}
					onChange={handleFilterChange}
				/>
			</BaseControl>
		</ControlContextProvider>
	);

	return (
		<Flex direction="column" gap="15px">
			<FilterPresetPreview items={filterPreset.items} />

			<SharedPresetControls
				itemId={presetId}
				variable={filterPreset}
				name={filterPreset.name}
				slug={filterPreset.slug}
				allSlugs={getAllFilterSlugs(presets)}
			>
				{filterPresetValueControls}
			</SharedPresetControls>
		</Flex>
	);
}

export const FilterPresetSize = memo(FilterPresetSizeComponent);
