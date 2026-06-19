/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useCallback, useMemo, memo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/controls';
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
} from '../components';
import { useGlobalSetting } from '../context/global-style-hooks';
import { type VariableType } from '../components/types';
import { BorderPresetOpener } from './border-preset-opener';
import {
	BorderPresetSize,
	type BorderBoxDefaultPresetValue,
} from './border-preset-size';
import { NavItemBackButton } from '../navigation/nav-item-back-button';
import {
	sanitizeBorderBoxPresets,
	getDefaultStoredBorderSide,
	type BorderBoxPreset,
} from './utils';

const borderPresetFieldsPropsResolver =
	createPresetFieldsPropsResolver('borderPreset');

function BorderPresetGroupComponent({
	sizes,
	baseSizes,
	origin,
	persistSizes,
	convertRepeaterToItems,
	handleResetPresets,
}: {
	label: string;
	origin: string;
	sizes: BorderBoxPreset[];
	baseSizes?: BorderBoxPreset[];
	persistSizes?: (items: BorderBoxPreset[]) => void;
	convertRepeaterToItems: (
		newValue: object,
		baseline: BorderBoxPreset[]
	) => BorderBoxPreset[];
	handleResetPresets?: () => void;
}) {
	const { dialogText: resetDialogText, confirmButtonText } =
		getOriginResetDialogCopy(origin, __('border', 'blockera'));

	const index = useMemo(
		() => getNewIndexFromPresets(sizes, 'border-'),
		[sizes]
	);

	const defaultPresetValue = useMemo((): BorderBoxDefaultPresetValue &
		VariableType => {
		return {
			isVisible: true,
			slug: `border-${index}`,
			deletable: !!('custom' === origin),
			cloneable: !!('custom' === origin),
			border: getDefaultStoredBorderSide(),
			visibilitySupport: !!('custom' === origin),
			/* translators: %d: border preset index */
			name: sprintf(__('Border %d', 'blockera'), index) as string,
		};
	}, [origin, index]);

	const controlName = `border-preset-presets-${origin}`;

	const onPersistItems = useCallback(
		(next: BorderBoxPreset[]) => {
			persistSizes?.(next);
		},
		[persistSizes]
	);

	return (
		<PresetTaxonomyGroupLayout<BorderBoxPreset & Record<string, unknown>>
			origin={origin}
			items={sizes}
			baseItems={baseSizes}
			controlName={controlName}
			convertRepeaterToItems={convertRepeaterToItems}
			onPersistItems={onPersistItems}
			PresetFields={BorderPresetSize}
			repeaterItemHeader={BorderPresetOpener}
			presetFieldsPropsResolver={borderPresetFieldsPropsResolver}
			defaultPresetValue={defaultPresetValue}
			title={__('Border', 'blockera')}
			label={getOriginVariablesLabel(origin)}
			handleReset={handleResetPresets}
			resetDialogText={resetDialogText}
			resetConfirmButtonText={confirmButtonText}
		/>
	);
}

const BorderPresetGroup = memo(BorderPresetGroupComponent);

export function BordersPresetContent() {
	const [rawThemePresets, setThemePresets] = useGlobalSetting(
		'border.presets.theme'
	);

	const [baseThemePresets] = useGlobalSetting(
		'border.presets.theme',
		'',
		'base'
	);
	const [rawDefaultPresets, setDefaultPresets] = useGlobalSetting(
		'border.presets.default'
	);

	const [baseDefaultPresets] = useGlobalSetting(
		'border.presets.default',
		'',
		'base'
	);

	const [rawCustomPresets = [], setCustomPresets] = useGlobalSetting(
		'border.presets.custom'
	);

	const themePresets = useMemo(
		() => sanitizeBorderBoxPresets(rawThemePresets),
		[rawThemePresets]
	);
	const defaultPresets = useMemo(
		() => sanitizeBorderBoxPresets(rawDefaultPresets),
		[rawDefaultPresets]
	);
	const customPresets = useMemo(
		() => sanitizeBorderBoxPresets(rawCustomPresets),
		[rawCustomPresets]
	);

	const convertRepeaterValueToArray = useCallback(
		(newValue: Object): BorderBoxPreset[] =>
			sanitizeBorderBoxPresets(
				Object.values(
					newValue as Record<
						string,
						BorderBoxPreset & Record<string, unknown>
					>
				).map((value) => ({
					slug: value.slug,
					name: value.name,
					border: value.border,
					isVisible: value.isVisible,
				}))
			),
		[]
	);

	const persistThemeSizes = useCallback(
		(next: BorderBoxPreset[]) => {
			setThemePresets(next);
		},
		[setThemePresets]
	);

	const persistDefaultSizes = useCallback(
		(next: BorderBoxPreset[]) => {
			setDefaultPresets(next);
		},
		[setDefaultPresets]
	);

	const persistCustomSizes = useCallback(
		(next: BorderBoxPreset[]) => {
			setCustomPresets(next);
		},
		[setCustomPresets]
	);

	const resetThemeToBase = useCallback(() => {
		setThemePresets(sanitizeBorderBoxPresets(baseThemePresets));
	}, [setThemePresets, baseThemePresets]);

	const resetDefaultToBase = useCallback(() => {
		setDefaultPresets(sanitizeBorderBoxPresets(baseDefaultPresets));
	}, [setDefaultPresets, baseDefaultPresets]);

	const clearCustomSizes = useCallback(() => {
		setCustomPresets([]);
	}, [setCustomPresets]);

	const themeResetHandler = useMemo(() => {
		if (!themePresets?.length) {
			return undefined;
		}
		const base = sanitizeBorderBoxPresets(baseThemePresets ?? []);
		if (isEquals(themePresets, base)) {
			return undefined;
		}
		return resetThemeToBase;
	}, [themePresets, baseThemePresets, resetThemeToBase]);

	const defaultResetHandler = useMemo(() => {
		if (!defaultPresets?.length) {
			return undefined;
		}
		const base = sanitizeBorderBoxPresets(baseDefaultPresets ?? []);
		if (isEquals(defaultPresets, base)) {
			return undefined;
		}
		return resetDefaultToBase;
	}, [defaultPresets, baseDefaultPresets, resetDefaultToBase]);

	const customResetHandler = useMemo(
		() => (customPresets.length > 0 ? clearCustomSizes : undefined),
		[customPresets.length, clearCustomSizes]
	);

	const showDefaultOriginGroup = shouldShowDefaultPresetGroup(
		true,
		themePresets.length,
		defaultPresets.length
	);
	const showThemeOriginGroup = shouldShowThemePresetGroup(
		true,
		themePresets.length,
		defaultPresets.length
	);

	const baseThemeSizes = useMemo(
		() => sanitizeBorderBoxPresets(baseThemePresets),
		[baseThemePresets]
	);

	return (
		<Flex direction="column" gap="20px" style={{ width: '100%' }}>
			{showThemeOriginGroup && (
				<BorderPresetGroup
					origin="theme"
					label={__('Theme', 'blockera')}
					sizes={themePresets}
					baseSizes={baseThemeSizes}
					persistSizes={persistThemeSizes}
					convertRepeaterToItems={convertRepeaterValueToArray}
					handleResetPresets={themeResetHandler}
				/>
			)}

			{showDefaultOriginGroup && (
				<BorderPresetGroup
					origin="default"
					label={__('Default', 'blockera')}
					sizes={defaultPresets}
					persistSizes={persistDefaultSizes}
					convertRepeaterToItems={convertRepeaterValueToArray}
					handleResetPresets={defaultResetHandler}
				/>
			)}

			<BorderPresetGroup
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

export function Borders({ closeCallback }: { closeCallback?: () => void }) {
	return (
		<div
			className={classNames(
				'blockera-navigation-panel',
				'blockera-borders-presets-navigation'
			)}
		>
			<NavItemBackButton
				backLabel={__('Border Variables', 'blockera')}
				closeCallback={closeCallback}
			/>

			<Flex
				direction="column"
				gap="16px"
				className="blockera-borders-presets"
				style={{
					width: '100%',
					marginTop: '10px',
					paddingBottom: '10px',
				}}
			>
				<GlobalStylesPanelDescription>
					{__(
						'Create and edit border variables used for width, style, and color on boxes.',
						'blockera'
					)}
				</GlobalStylesPanelDescription>

				<Flex
					direction="column"
					style={{ padding: '0 16px', width: '100%' }}
				>
					<BordersPresetContent />
				</Flex>
			</Flex>
		</div>
	);
}

export default Borders;
