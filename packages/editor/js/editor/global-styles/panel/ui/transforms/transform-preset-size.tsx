/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalView as View,
	__experimentalSpacer as Spacer,
	__experimentalVStack as VStack,
	FlexItem,
} from '@wordpress/components';
import { useCallback, memo, useContext, useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	BaseControl,
	TransformControl,
	RepeaterContext,
	useControlContext,
	ControlContextProvider,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import TransformPresetPreview from './transform-preset-preview';
import { VariableNameEditor } from '../components';
import { type VariableType } from '../components/types';
import { getAllVariableSlugs as getAllTransformSlugs } from '../components/utils';
import {
	itemsToRepeaterRecord,
	repeaterRecordToItems,
	type WpTransformPreset,
	type TransformPresetItem,
} from './utils';

export type TransformDefaultPresetValue = {
	items: TransformPresetItem[];
	deletable: boolean;
	cloneable: boolean;
	visibilitySupport: boolean;
};

/** Stable reference: avoids a new function each render and needless child updates. */
const noopTransformPromo = (): null => null;

/** Matches TransformControl’s default row shape; defined once to avoid new object identity on each render. */
const TRANSFORM_PRESET_REPEATER_DEFAULT = {
	type: 'move' as const,
	'move-x': '0px',
	'move-y': '0px',
	'move-z': '0px',
	scale: '100%',
	'rotate-x': '0deg',
	'rotate-y': '0deg',
	'rotate-z': '0deg',
	'skew-x': '0deg',
	'skew-y': '0deg',
	isVisible: true,
};

function TransformPresetSizeComponent({
	origin,
	transformPreset,
	presetId,
}: {
	origin: string | string[];
	transformPreset: VariableType &
		TransformDefaultPresetValue &
		WpTransformPreset;
	presetId: string | number;
}) {
	const { slug } = transformPreset;

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
						VariableType &
							TransformDefaultPresetValue &
							WpTransformPreset
					>
			  >
			| undefined;
		itemIdGenerator?: (itemId: string | number) => string;
	};

	const repeaterItems = useMemo(
		() => itemsToRepeaterRecord(transformPreset.items || []),
		[transformPreset.items]
	);

	const handleTransformChange = useCallback(
		(newValue: Record<string, Record<string, unknown>>) => {
			const items = repeaterRecordToItems(newValue);
			// Defer: inner repeater may dispatch during the same tick; updating the preset list
			// synchronously triggers Redux “getState during reducer”. Same pattern as transition / text-shadow presets.
			queueMicrotask(() => {
				changeRepeaterItem({
					onChange,
					valueCleanup,
					controlId,
					repeaterId,
					itemId: presetId,
					value: { ...transformPreset, items },
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
			transformPreset,
		]
	);

	if (!origin || !slug) {
		return null;
	}

	return (
		<VStack spacing={4}>
			<View>
				<Spacer paddingX={4} marginBottom={0} paddingBottom={6}>
					<VStack spacing={4}>
						<FlexItem>
							<TransformPresetPreview
								items={transformPreset.items}
							/>
						</FlexItem>

						{'custom' === origin && (
							<VariableNameEditor
								itemId={presetId}
								variable={transformPreset}
								name={transformPreset.name}
								slug={transformPreset.slug}
								allSlugs={getAllTransformSlugs(presets)}
							/>
						)}

						<ControlContextProvider
							value={{
								name: `transform-preset-${slug}`,
								value: repeaterItems,
								attribute: 'blockeraTransformPreset',
								blockName: 'global-styles-transforms',
							}}
							storeName="blockera/controls/repeater"
						>
							<BaseControl
								controlName={`transform-preset-${slug}`}
								columns="columns-1"
							>
								<TransformControl
									key={slug}
									PromoComponent={noopTransformPromo}
									id={`transform-preset-${slug}`}
									label={__('2D & 3D Transforms', 'blockera')}
									labelDescription={
										<>
											<p>
												{__(
													'Defines the transform preset used in effects transform controls across the site.',
													'blockera'
												)}
											</p>
											<p>
												{__(
													'Stored in theme.json as settings.transform.presets (items array per preset).',
													'blockera'
												)}
											</p>
										</>
									}
									defaultRepeaterItemValue={
										TRANSFORM_PRESET_REPEATER_DEFAULT
									}
									defaultValue={repeaterItems}
									onChange={handleTransformChange}
								/>
							</BaseControl>
						</ControlContextProvider>
					</VStack>
				</Spacer>
			</View>
		</VStack>
	);
}

export const TransformPresetSize = memo(TransformPresetSizeComponent);
