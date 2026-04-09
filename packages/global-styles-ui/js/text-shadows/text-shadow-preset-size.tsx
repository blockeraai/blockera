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
	TextShadowControl,
	RepeaterContext,
	useControlContext,
	ControlContextProvider,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import TextShadowPresetPreview from './text-shadow-preset-preview';
import { SharedPresetControls } from '../components';
import { type VariableType } from '../components/types';
import { getAllVariableSlugs as getAllTextShadowSlugs } from '../components/utils';
import {
	repeaterRecordToTextShadowItems,
	textShadowItemsToRepeaterRecord,
	textShadowPresetItemsToCss,
	type TextShadowPresetItem,
	type WpTextShadowPreset,
} from './utils';

export type TextShadowDefaultPresetValue = {
	items: TextShadowPresetItem[];
	deletable: boolean;
	cloneable: boolean;
	visibilitySupport: boolean;
};

function TextShadowPresetSizeComponent({
	origin,
	textShadowPreset,
	presetId,
}: {
	origin: string | string[];
	textShadowPreset: VariableType &
		TextShadowDefaultPresetValue &
		WpTextShadowPreset;
	presetId: string | number;
}) {
	const { slug } = textShadowPreset;

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
						VariableType &
							TextShadowDefaultPresetValue &
							WpTextShadowPreset
					>
			  >
			| undefined;
		itemIdGenerator?: (itemId: string | number) => string;
	};

	const repeaterItems = useMemo(
		() => textShadowItemsToRepeaterRecord(textShadowPreset.items || []),
		[textShadowPreset.items]
	);

	const handleTextShadowChange = useCallback(
		(newValue: Record<string, Record<string, unknown>>) => {
			const items = repeaterRecordToTextShadowItems(newValue);
			queueMicrotask(() => {
				changeRepeaterItem({
					onChange,
					valueCleanup,
					controlId,
					repeaterId,
					itemId: presetId,
					value: { ...textShadowPreset, items },
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
			textShadowPreset,
		]
	);

	if (!origin || !slug) {
		return null;
	}

	const textShadowPresetValueControls = (
		<ControlContextProvider
			value={{
				name: `text-shadow-preset-${slug}`,
				value: repeaterItems,
				attribute: 'blockeraTextShadowPreset',
				blockName: 'global-styles-text-shadows',
			}}
			storeName="blockera/controls/repeater"
		>
			<BaseControl
				controlName={`text-shadow-preset-${slug}`}
				columns="columns-1"
			>
				<TextShadowControl
					key={slug}
					withoutValueAddons
					id={`text-shadow-preset-${slug}`}
					defaultRepeaterItemValue={{
						x: '1px',
						y: '1px',
						blur: '1px',
						color: '#000000ab',
						isVisible: true,
					}}
					label={__('Text shadow', 'blockera')}
					labelDescription={
						<>
							<p>
								{__(
									'Defines the text shadow preset used in typography text shadow controls across the site.',
									'blockera'
								)}
							</p>
							<p>
								{__(
									'Stored in theme.json as settings.textShadow.presets (items array per preset).',
									'blockera'
								)}
							</p>
						</>
					}
					defaultValue={repeaterItems}
					onChange={handleTextShadowChange}
				/>
			</BaseControl>
		</ControlContextProvider>
	);

	return (
		<VStack spacing={4}>
			<View>
				<Spacer paddingX={4} marginBottom={0} paddingBottom={6}>
					<VStack spacing={4}>
						<FlexItem>
							<TextShadowPresetPreview
								shadow={textShadowPresetItemsToCss(
									textShadowPreset.items
								)}
							/>
						</FlexItem>

						{'custom' === origin ? (
							<SharedPresetControls
								itemId={presetId}
								variable={textShadowPreset}
								name={textShadowPreset.name}
								slug={textShadowPreset.slug}
								allSlugs={getAllTextShadowSlugs(presets)}
							>
								{textShadowPresetValueControls}
							</SharedPresetControls>
						) : (
							textShadowPresetValueControls
						)}
					</VStack>
				</Spacer>
			</View>
		</VStack>
	);
}

export const TextShadowPresetSize = memo(TextShadowPresetSizeComponent);
