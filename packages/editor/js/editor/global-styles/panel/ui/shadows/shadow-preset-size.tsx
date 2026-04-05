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
	BoxShadowControl,
	RepeaterContext,
	useControlContext,
	ControlContextProvider,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import ShadowPresetPreview from './shadow-preset-preview';
import { VariableNameEditor } from '../components';
import { type VariableType } from '../components/types';
import { getAllVariableSlugs as getAllShadowSlugs } from '../components/utils';
import type { WpShadowPreset } from './utils';
import {
	parseCssBoxShadowToRepeaterValue,
	formatControlItemsToCssBoxShadow,
} from '../../../../../extensions/libs/border-and-shadow/compatibilities/shadow.js';

export type ShadowDefaultPresetValue = {
	shadow: string;
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
		() => parseCssBoxShadowToRepeaterValue(shadowPreset.shadow || ''),
		[shadowPreset.shadow]
	);

	const handleBoxShadowChange = useCallback(
		(newValue: Object | Array<Record<string, unknown>>) => {
			const css = formatControlItemsToCssBoxShadow(newValue);
			// Defer: BoxShadow onChange runs synchronously from the inner repeater reducer;
			// updating the preset list in the same tick hits Redux error #3 (getState during reducer).
			queueMicrotask(() => {
				changeRepeaterItem({
					onChange,
					valueCleanup,
					controlId,
					repeaterId,
					itemId: presetId,
					value: { ...shadowPreset, shadow: css },
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

	return (
		<VStack spacing={4}>
			<View>
				<Spacer paddingX={4} marginBottom={0} paddingBottom={6}>
					<VStack spacing={4}>
						<FlexItem>
							<ShadowPresetPreview shadow={shadowPreset.shadow} />
						</FlexItem>

						{'custom' === origin && (
							<VariableNameEditor
								itemId={presetId}
								variable={shadowPreset}
								name={shadowPreset.name}
								slug={shadowPreset.slug}
								allSlugs={getAllShadowSlugs(presets)}
							/>
						)}

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
									PromoComponent={null}
									id={`shadow-preset-box-${slug}`}
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
													'Stored in theme.json as settings.shadow.presets (CSS box-shadow value).',
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
					</VStack>
				</Spacer>
			</View>
		</VStack>
	);
}

export const ShadowPresetSize = memo(ShadowPresetSizeComponent);
