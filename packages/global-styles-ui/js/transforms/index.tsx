/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useCallback, useMemo, memo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	Flex,
	PresetVariablesViewModeProvider,
	PRESET_VARIABLES_SECTION_GAP,
} from '@blockera/controls';
import { isEquals } from '@blockera/utils';
import { classNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import {
	getNewIndexFromPresets,
	createPresetFieldsPropsResolver,
	getOriginResetDialogCopy,
	getOriginVariablesLabel,
	GlobalStylesPanelDescription,
	shouldShowDefaultPresetGroup,
	shouldShowThemePresetGroup,
	PresetTaxonomyGroupLayout,
	PresetVariablesScreenToolbar,
	buildVisiblePresetOriginSets,
} from '../components';
import { useGlobalSetting } from '../context/global-style-hooks';
import { type VariableType } from '../components/types';
import { TransformPresetOpener } from './transform-preset-opener';
import {
	TransformPresetSize,
	type TransformDefaultPresetValue,
} from './transform-preset-size';
import { sanitizeTransformPresets, type WpTransformPreset } from './utils';
import { NavItemBackButton } from '../navigation/nav-item-back-button';

const transformPresetFieldsPropsResolver =
	createPresetFieldsPropsResolver('transformPreset');

function TransformPresetGroupComponent({
	sizes,
	baseSizes,
	origin,
	persistSizes,
	convertRepeaterToItems,
	handleResetPresets,
}: {
	label: string;
	origin: string;
	sizes: WpTransformPreset[];
	baseSizes?: WpTransformPreset[];
	persistSizes?: (items: WpTransformPreset[]) => void;
	convertRepeaterToItems: (
		newValue: object,
		baseline: WpTransformPreset[]
	) => WpTransformPreset[];
	handleResetPresets?: () => void;
}) {
	const { dialogText: resetDialogText, confirmButtonText } =
		getOriginResetDialogCopy(origin, __('transform', 'blockera'));

	const index = useMemo(
		() => getNewIndexFromPresets(sizes, 'transform-'),
		[sizes]
	);

	const defaultPresetValue = useMemo((): TransformDefaultPresetValue &
		VariableType & { slug: string; name: string } => {
		return {
			isVisible: true,
			items: [
				{
					type: 'move',
					isVisible: true,
					'move-x': '0px',
					'move-y': '0px',
					'move-z': '0px',
				},
			],
			slug: `transform-${index}`,
			deletable: !!('custom' === origin),
			cloneable: !!('custom' === origin),
			visibilitySupport: !!('custom' === origin),
			/* translators: %d: transform preset index */
			name: sprintf(__('Transform %d', 'blockera'), index) as string,
		};
	}, [origin, index]);

	const controlName = `transform-preset-presets-${origin}`;

	const onPersistItems = useCallback(
		(next: WpTransformPreset[]) => {
			persistSizes?.(next);
		},
		[persistSizes]
	);

	return (
		<PresetTaxonomyGroupLayout<WpTransformPreset & Record<string, unknown>>
			origin={origin}
			items={sizes}
			baseItems={baseSizes}
			controlName={controlName}
			convertRepeaterToItems={convertRepeaterToItems}
			onPersistItems={onPersistItems}
			PresetFields={TransformPresetSize}
			repeaterItemHeader={TransformPresetOpener}
			presetFieldsPropsResolver={transformPresetFieldsPropsResolver}
			defaultPresetValue={defaultPresetValue}
			title={__('2D & 3D Transforms', 'blockera')}
			label={getOriginVariablesLabel(origin)}
			handleReset={handleResetPresets}
			resetDialogText={resetDialogText}
			resetConfirmButtonText={confirmButtonText}
		/>
	);
}

// Memo: each origin group is independent; avoids re-rendering all groups when one dialog or list updates.
const TransformPresetGroup = memo(TransformPresetGroupComponent);

/**
 * Reads/writes `settings.transform` in user theme.json — same layout as `settings.transition`
 * (presets.theme | default | custom, optional defaultPresets), with each preset’s `items`
 * array storing transform rows (move, scale, rotate, skew fields per row).
 */
export function TransformsPresetContent() {
	const [rawThemePresets, setThemePresets] = useGlobalSetting(
		'transform.presets.theme'
	);

	const [baseThemePresets] = useGlobalSetting(
		'transform.presets.theme',
		'',
		'base'
	);
	const [rawDefaultPresets, setDefaultPresets] = useGlobalSetting(
		'transform.presets.default'
	);

	const [baseDefaultPresets] = useGlobalSetting(
		'transform.presets.default',
		'',
		'base'
	);

	const [rawCustomPresets = [], setCustomPresets] = useGlobalSetting(
		'transform.presets.custom'
	);

	const [defaultTransformPresetsEnabled = true] = useGlobalSetting(
		'transform.defaultPresets'
	);

	const themePresets = useMemo(
		() => sanitizeTransformPresets(rawThemePresets),
		[rawThemePresets]
	);
	const defaultPresets = useMemo(
		() => sanitizeTransformPresets(rawDefaultPresets),
		[rawDefaultPresets]
	);
	const customPresets = useMemo(
		() => sanitizeTransformPresets(rawCustomPresets),
		[rawCustomPresets]
	);

	const convertRepeaterValueToArray = useCallback(
		(newValue: Object): WpTransformPreset[] =>
			sanitizeTransformPresets(
				Object.values(
					newValue as Record<
						string,
						WpTransformPreset & Record<string, unknown>
					>
				).map((value) => ({
					slug: value.slug,
					name: value.name,
					items: value.items,
					isVisible: value.isVisible,
				}))
			),
		[]
	);

	const persistThemeSizes = useCallback(
		(next: WpTransformPreset[]) => {
			setThemePresets(next);
		},
		[setThemePresets]
	);

	const persistDefaultSizes = useCallback(
		(next: WpTransformPreset[]) => {
			setDefaultPresets(next);
		},
		[setDefaultPresets]
	);

	const persistCustomSizes = useCallback(
		(next: WpTransformPreset[]) => {
			setCustomPresets(next);
		},
		[setCustomPresets]
	);

	const resetThemeToBase = useCallback(() => {
		setThemePresets(sanitizeTransformPresets(baseThemePresets));
	}, [setThemePresets, baseThemePresets]);

	const resetDefaultToBase = useCallback(() => {
		setDefaultPresets(sanitizeTransformPresets(baseDefaultPresets));
	}, [setDefaultPresets, baseDefaultPresets]);

	const clearCustomSizes = useCallback(() => {
		setCustomPresets([]);
	}, [setCustomPresets]);

	const themeResetHandler = useMemo(() => {
		if (!themePresets?.length) {
			return undefined;
		}
		const base = sanitizeTransformPresets(baseThemePresets ?? []);
		if (isEquals(themePresets, base)) {
			return undefined;
		}
		return resetThemeToBase;
	}, [themePresets, baseThemePresets, resetThemeToBase]);

	const defaultResetHandler = useMemo(() => {
		if (!defaultPresets?.length) {
			return undefined;
		}
		const base = sanitizeTransformPresets(baseDefaultPresets ?? []);
		if (isEquals(defaultPresets, base)) {
			return undefined;
		}
		return resetDefaultToBase;
	}, [defaultPresets, baseDefaultPresets, resetDefaultToBase]);

	const customResetHandler = useMemo(
		() => (customPresets.length > 0 ? clearCustomSizes : undefined),
		[customPresets.length, clearCustomSizes]
	);

	const defaultLayerOn = defaultTransformPresetsEnabled !== false;
	const showDefaultGroup = shouldShowDefaultPresetGroup(
		defaultLayerOn,
		themePresets.length,
		defaultPresets.length
	);
	const showThemeOriginGroup = shouldShowThemePresetGroup(
		defaultLayerOn,
		themePresets.length,
		defaultPresets.length
	);

	const baseThemeSizes = useMemo(
		() => sanitizeTransformPresets(baseThemePresets),
		[baseThemePresets]
	);

	const baseDefaultSizes = useMemo(
		() => sanitizeTransformPresets(baseDefaultPresets),
		[baseDefaultPresets]
	);

	const originSets = useMemo(
		() =>
			buildVisiblePresetOriginSets({
				showThemeOriginGroup,
				showDefaultOriginGroup: showDefaultGroup,
				themeItems: themePresets,
				themeBaseItems: baseThemeSizes,
				defaultItems: defaultPresets,
				defaultBaseItems: baseDefaultSizes,
				customItems: customPresets,
			}),
		[
			showThemeOriginGroup,
			showDefaultGroup,
			themePresets,
			baseThemeSizes,
			defaultPresets,
			baseDefaultSizes,
			customPresets,
		]
	);

	return (
		<Flex
			direction="column"
			gap={PRESET_VARIABLES_SECTION_GAP}
			style={{ width: '100%' }}
		>
			<PresetVariablesScreenToolbar originSets={originSets} />
			{showThemeOriginGroup && (
				<TransformPresetGroup
					origin="theme"
					label={__('Theme', 'blockera')}
					sizes={themePresets}
					baseSizes={baseThemeSizes}
					persistSizes={persistThemeSizes}
					convertRepeaterToItems={convertRepeaterValueToArray}
					handleResetPresets={themeResetHandler}
				/>
			)}

			{showDefaultGroup && (
				<TransformPresetGroup
					origin="default"
					label={__('Default', 'blockera')}
					sizes={defaultPresets}
					persistSizes={persistDefaultSizes}
					convertRepeaterToItems={convertRepeaterValueToArray}
					handleResetPresets={defaultResetHandler}
				/>
			)}

			<TransformPresetGroup
				origin="custom"
				label={__('Custom', 'blockera')}
				sizes={customPresets}
				persistSizes={persistCustomSizes}
				convertRepeaterToItems={convertRepeaterValueToArray}
				handleResetPresets={customResetHandler}
			/>
		</Flex>
	);
}

export function Transforms({ closeCallback }: { closeCallback?: () => void }) {
	return (
		<div
			className={classNames(
				'blockera-navigation-panel',
				'blockera-transforms-presets-navigation'
			)}
		>
			<NavItemBackButton
				backLabel={__('2D & 3D Transforms Variables', 'blockera')}
				closeCallback={closeCallback}
			/>

			<Flex
				direction="column"
				gap="16px"
				className="blockera-transforms-presets"
				style={{
					width: '100%',
					marginTop: '10px',
					paddingBottom: '10px',
				}}
			>
				<GlobalStylesPanelDescription>
					{__(
						'Create and edit transform variables used for move, scale, rotate, and skew.',
						'blockera'
					)}
				</GlobalStylesPanelDescription>

				<Flex
					direction="column"
					style={{ padding: '0 16px', width: '100%' }}
				>
					<PresetVariablesViewModeProvider>
						<TransformsPresetContent />
					</PresetVariablesViewModeProvider>
				</Flex>
			</Flex>
		</div>
	);
}

export default Transforms;
