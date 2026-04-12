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
	BoxShadowControl,
	RepeaterContext,
	useControlContext,
	ControlContextProvider,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import ShadowPresetPreview from './shadow-preset-preview';
import { SharedPresetControls } from '../components';
import { type VariableType } from '../components/types';
import { getAllVariableSlugs as getAllShadowSlugs } from '../components/utils';
import {
	repeaterRecordToShadowItems,
	shadowItemsToRepeaterRecord,
	shadowPresetItemsToCss,
	type ShadowPresetItem,
	type WpShadowPreset,
} from './utils';

export type ShadowDefaultPresetValue = {
	items: ShadowPresetItem[];
	isVisible: boolean;
	deletable: boolean;
	cloneable: boolean;
	visibilitySupport: boolean;
};

function ShadowPresetSizeComponent({
	origin,
	shadowPreset,
	presetId,
}: {
	origin: string | string[];
	presetId: string | number;
	shadowPreset: VariableType & ShadowDefaultPresetValue & WpShadowPreset;
}) {
	const { slug } = shadowPreset;

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
		onChange: (newValue: any) => void;
		valueCleanup: (value: any) => any;
		repeaterId: string | null | undefined;
		repeaterItems:
			| Record<
					string,
					Array<
						VariableType & ShadowDefaultPresetValue & WpShadowPreset
					>
			  >
			| undefined;
		itemIdGenerator?: (itemId: string | number) => string;
	};

	const repeaterItems = useMemo(
		() => shadowItemsToRepeaterRecord(shadowPreset.items || []),
		[shadowPreset.items]
	);

	const handleBoxShadowChange = useCallback(
		(newValue: Record<string, Record<string, unknown>>) => {
			const items = repeaterRecordToShadowItems(newValue);
			// Defer: BoxShadow onChange runs synchronously from the inner repeater reducer;
			// updating the preset list in the same tick hits Redux error #3 (getState during reducer).
			queueMicrotask(() => {
				changeRepeaterItem({
					onChange,
					valueCleanup,
					controlId,
					repeaterId,
					itemId: presetId,
					value: { ...shadowPreset, items },
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
			shadowPreset,
		]
	);

	if (!origin || !slug) {
		return null;
	}

	const shadowPresetValueControls = (
		<ControlContextProvider
			value={{
				name: `shadow-preset-${slug}`,
				value: repeaterItems,
				attribute: 'blockeraShadowPreset',
				blockName: 'global-styles-shadows',
			}}
			storeName="blockera/controls/repeater"
		>
			<BaseControl
				controlName={`shadow-preset-box-${slug}`}
				columns="columns-1"
			>
				<BoxShadowControl
					key={slug}
					withoutValueAddons
					id={`shadow-preset-box-${slug}`}
					defaultRepeaterItemValue={{
						type: 'outer',
						x: '10px',
						y: '10px',
						blur: '10px',
						spread: '0px',
						color: '#000000ab',
						isVisible: true,
					}}
					label={__('Box shadow', 'blockera')}
					labelDescription={
						<>
							<p>
								{__(
									'Defines the shadow preset used in box shadow controls across the site.',
									'blockera'
								)}
							</p>
							<p>
								{__(
									'Stored in theme.json as settings.shadow.presets (items array per preset).',
									'blockera'
								)}
							</p>
						</>
					}
					defaultValue={repeaterItems}
					onChange={handleBoxShadowChange}
				/>
			</BaseControl>
		</ControlContextProvider>
	);

	return (
		<Flex direction="column" gap="15px">
			<ShadowPresetPreview
				shadow={shadowPresetItemsToCss(shadowPreset.items)}
			/>

			<SharedPresetControls
				itemId={presetId}
				variable={shadowPreset}
				name={shadowPreset.name}
				slug={shadowPreset.slug}
				allSlugs={getAllShadowSlugs(presets)}
			>
				{shadowPresetValueControls}
			</SharedPresetControls>
		</Flex>
	);
}

export const ShadowPresetSize = memo(ShadowPresetSizeComponent);
