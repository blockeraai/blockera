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
	TransitionControl,
	RepeaterContext,
	useControlContext,
	ControlContextProvider,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import TransitionPresetPreview from './transition-preset-preview';
import { VariableNameEditor } from '../components';
import { type VariableType } from '../components/types';
import { getAllVariableSlugs as getAllTransitionSlugs } from '../components/utils';
import {
	itemsToRepeaterRecord,
	repeaterRecordToItems,
	type WpTransitionPreset,
	type TransitionPresetItem,
} from './utils';

export type TransitionDefaultPresetValue = {
	items: TransitionPresetItem[];
	deletable: boolean;
	cloneable: boolean;
	isVisible: boolean;
	visibilitySupport: boolean;
};

function TransitionPresetSizeComponent({
	origin,
	transitionPreset,
	presetId,
}: {
	origin: string | string[];
	transitionPreset: VariableType &
		TransitionDefaultPresetValue &
		WpTransitionPreset;
	presetId: string | number;
}) {
	const { slug } = transitionPreset;

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
							TransitionDefaultPresetValue &
							WpTransitionPreset
					>
			  >
			| undefined;
		itemIdGenerator?: (itemId: string | number) => string;
	};

	const repeaterItems = useMemo(
		() => itemsToRepeaterRecord(transitionPreset.items || []),
		[transitionPreset.items]
	);

	const handleTransitionChange = useCallback(
		(newValue: Record<string, Record<string, unknown>>) => {
			const items = repeaterRecordToItems(newValue);
			// Defer: inner repeater may dispatch during the same tick; updating the preset list
			// synchronously triggers Redux “getState during reducer” (#3). Same pattern as text-shadow presets.
			queueMicrotask(() => {
				changeRepeaterItem({
					onChange,
					valueCleanup,
					controlId,
					repeaterId,
					itemId: presetId,
					value: { ...transitionPreset, items },
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
			transitionPreset,
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
							<TransitionPresetPreview
								items={transitionPreset.items}
							/>
						</FlexItem>

						{'custom' === origin && (
							<VariableNameEditor
								itemId={presetId}
								variable={transitionPreset}
								name={transitionPreset.name}
								slug={transitionPreset.slug}
								allSlugs={getAllTransitionSlugs(presets)}
							/>
						)}

						<ControlContextProvider
							value={{
								name: `transition-preset-${slug}`,
								value: repeaterItems,
								attribute: 'blockeraTransitionPreset',
								blockName: 'global-styles-transitions',
							}}
							storeName="blockera/controls/repeater"
						>
							<BaseControl
								controlName={`transition-preset-${slug}`}
								columns="columns-1"
							>
								<TransitionControl
									key={slug}
									PromoComponent={null}
									id={`transition-preset-${slug}`}
									label={__('Transitions', 'blockera')}
									labelDescription={
										<>
											<p>
												{__(
													'Defines the transition preset used in effects transition controls across the site.',
													'blockera'
												)}
											</p>
											<p>
												{__(
													'Stored in theme.json as settings.transition.presets (items array per preset).',
													'blockera'
												)}
											</p>
										</>
									}
									defaultRepeaterItemValue={{
										type: 'all',
										duration: '500ms',
										timing: 'ease',
										delay: '0ms',
										isVisible: true,
									}}
									defaultValue={repeaterItems}
									onChange={handleTransitionChange}
								/>
							</BaseControl>
						</ControlContextProvider>
					</VStack>
				</Spacer>
			</View>
		</VStack>
	);
}

export const TransitionPresetSize = memo(TransitionPresetSizeComponent);
