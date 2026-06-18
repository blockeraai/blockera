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
	withPresetMetaFromRepeaterRow,
	PresetTaxonomyGroupLayout,
} from '../components';
import { useGlobalSetting } from '../context/global-style-hooks';
import { type VariableType } from '../components/types';
import { BorderRadiusPresetOpener } from './border-radius-preset-opener';
import {
	BorderRadiusSize,
	type BorderRadiusDefaultPresetValue,
} from './border-radius-size';
import { NavItemBackButton } from '../navigation/nav-item-back-button';
import { sanitizeRadiusSizes, type BorderRadiusSizePreset } from './utils';

export type { BorderRadiusDefaultPresetValue };

const borderRadiusPresetFieldsPropsResolver =
	createPresetFieldsPropsResolver('borderRadiusSize');

function BorderRadiusSizeGroupComponent({
	sizes,
	baseSizes,
	origin,
	persistSizes,
	convertRepeaterToItems,
	handleResetPresets,
}: {
	label: string;
	origin: string;
	sizes: BorderRadiusSizePreset[];
	baseSizes?: BorderRadiusSizePreset[];
	persistSizes?: (items: BorderRadiusSizePreset[]) => void;
	convertRepeaterToItems: (
		newValue: object,
		baseline: BorderRadiusSizePreset[]
	) => BorderRadiusSizePreset[];
	handleResetPresets?: () => void;
}) {
	const { dialogText: resetDialogText, confirmButtonText } =
		getOriginResetDialogCopy(origin, __('border radius', 'blockera'));

	const index = useMemo(
		() => getNewIndexFromPresets(sizes, 'border-radius-'),
		[sizes]
	);

	const defaultPresetValue = useMemo((): BorderRadiusDefaultPresetValue &
		VariableType => {
		return {
			size: '4px',
			isVisible: true,
			slug: `border-radius-${index}`,
			deletable: !!('custom' === origin),
			cloneable: !!('custom' === origin),
			visibilitySupport: !!('custom' === origin),
			/* translators: %d: border radius preset index */
			name: sprintf(__('Border radius %d', 'blockera'), index) as string,
		};
	}, [origin, index]);

	const controlName = `border-radius-presets-${origin}`;

	const onPersistItems = useCallback(
		(next: BorderRadiusSizePreset[]) => {
			persistSizes?.(next);
		},
		[persistSizes]
	);

	return (
		<PresetTaxonomyGroupLayout<
			BorderRadiusSizePreset & Record<string, unknown>
		>
			origin={origin}
			items={sizes}
			baseItems={baseSizes}
			controlName={controlName}
			convertRepeaterToItems={convertRepeaterToItems}
			onPersistItems={onPersistItems}
			PresetFields={BorderRadiusSize}
			repeaterItemHeader={BorderRadiusPresetOpener}
			presetFieldsPropsResolver={borderRadiusPresetFieldsPropsResolver}
			defaultPresetValue={defaultPresetValue}
			title={__('Border radius', 'blockera')}
			label={getOriginVariablesLabel(origin)}
			handleReset={handleResetPresets}
			resetDialogText={resetDialogText}
			resetConfirmButtonText={confirmButtonText}
		/>
	);
}

const BorderRadiusSizeGroup = memo(BorderRadiusSizeGroupComponent);

export function BorderRadiusPresetContent() {
	const [rawThemeRadiusSizes, setThemeRadiusSizes] = useGlobalSetting(
		'border.radiusSizes.theme'
	);

	const [baseThemeRadiusSizes] = useGlobalSetting(
		'border.radiusSizes.theme',
		'',
		'base'
	);
	const [rawDefaultRadiusSizes, setDefaultRadiusSizes] = useGlobalSetting(
		'border.radiusSizes.default'
	);

	const [baseDefaultRadiusSizes] = useGlobalSetting(
		'border.radiusSizes.default',
		'',
		'base'
	);

	const [rawCustomRadiusSizes = [], setCustomRadiusSizes] = useGlobalSetting(
		'border.radiusSizes.custom'
	);

	const themeRadiusSizes = useMemo(
		() => sanitizeRadiusSizes(rawThemeRadiusSizes),
		[rawThemeRadiusSizes]
	);
	const defaultRadiusSizes = useMemo(
		() => sanitizeRadiusSizes(rawDefaultRadiusSizes),
		[rawDefaultRadiusSizes]
	);
	const customRadiusSizes = useMemo(
		() => sanitizeRadiusSizes(rawCustomRadiusSizes),
		[rawCustomRadiusSizes]
	);

	const convertRepeaterValueToArray = useCallback(
		(newValue: Object): BorderRadiusSizePreset[] =>
			sanitizeRadiusSizes(
				Object.values(
					newValue as Record<
						string,
						BorderRadiusSizePreset & Record<string, unknown>
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

	const persistThemeSizes = useCallback(
		(next: BorderRadiusSizePreset[]) => {
			setThemeRadiusSizes(next);
		},
		[setThemeRadiusSizes]
	);

	const persistDefaultSizes = useCallback(
		(next: BorderRadiusSizePreset[]) => {
			setDefaultRadiusSizes(next);
		},
		[setDefaultRadiusSizes]
	);

	const persistCustomSizes = useCallback(
		(next: BorderRadiusSizePreset[]) => {
			setCustomRadiusSizes(next);
		},
		[setCustomRadiusSizes]
	);

	const resetThemeToBase = useCallback(() => {
		setThemeRadiusSizes(sanitizeRadiusSizes(baseThemeRadiusSizes));
	}, [setThemeRadiusSizes, baseThemeRadiusSizes]);

	const resetDefaultToBase = useCallback(() => {
		setDefaultRadiusSizes(sanitizeRadiusSizes(baseDefaultRadiusSizes));
	}, [setDefaultRadiusSizes, baseDefaultRadiusSizes]);

	const clearCustomSizes = useCallback(() => {
		setCustomRadiusSizes([]);
	}, [setCustomRadiusSizes]);

	const themeResetHandler = useMemo(() => {
		if (!themeRadiusSizes?.length) {
			return undefined;
		}
		const base = sanitizeRadiusSizes(baseThemeRadiusSizes ?? []);
		if (isEquals(themeRadiusSizes, base)) {
			return undefined;
		}
		return resetThemeToBase;
	}, [themeRadiusSizes, baseThemeRadiusSizes, resetThemeToBase]);

	const defaultResetHandler = useMemo(() => {
		if (!defaultRadiusSizes?.length) {
			return undefined;
		}
		const base = sanitizeRadiusSizes(baseDefaultRadiusSizes ?? []);
		if (isEquals(defaultRadiusSizes, base)) {
			return undefined;
		}
		return resetDefaultToBase;
	}, [defaultRadiusSizes, baseDefaultRadiusSizes, resetDefaultToBase]);

	const customResetHandler = useMemo(
		() => (customRadiusSizes.length > 0 ? clearCustomSizes : undefined),
		[customRadiusSizes.length, clearCustomSizes]
	);

	const showDefaultOriginGroup = shouldShowDefaultPresetGroup(
		true,
		themeRadiusSizes.length,
		defaultRadiusSizes.length
	);
	const showThemeOriginGroup = shouldShowThemePresetGroup(
		true,
		themeRadiusSizes.length,
		defaultRadiusSizes.length
	);

	const baseThemeSizes = useMemo(
		() => sanitizeRadiusSizes(baseThemeRadiusSizes),
		[baseThemeRadiusSizes]
	);

	return (
		<Flex direction="column" gap="32px" style={{ width: '100%' }}>
			{showThemeOriginGroup && (
				<BorderRadiusSizeGroup
					origin="theme"
					label={__('Theme', 'blockera')}
					sizes={themeRadiusSizes}
					baseSizes={baseThemeSizes}
					persistSizes={persistThemeSizes}
					convertRepeaterToItems={convertRepeaterValueToArray}
					handleResetPresets={themeResetHandler}
				/>
			)}

			{showDefaultOriginGroup && (
				<BorderRadiusSizeGroup
					origin="default"
					label={__('Default', 'blockera')}
					sizes={defaultRadiusSizes}
					persistSizes={persistDefaultSizes}
					convertRepeaterToItems={convertRepeaterValueToArray}
					handleResetPresets={defaultResetHandler}
				/>
			)}

			<BorderRadiusSizeGroup
				origin="custom"
				label={__('Custom', 'blockera')}
				sizes={customRadiusSizes}
				persistSizes={persistCustomSizes}
				convertRepeaterToItems={convertRepeaterValueToArray}
				handleResetPresets={customResetHandler}
			/>
		</Flex>
	);
}

export function BorderRadius({
	closeCallback,
}: {
	closeCallback?: () => void;
}) {
	return (
		<div
			className={classNames(
				'blockera-navigation-panel',
				'blockera-border-radius-presets-navigation'
			)}
		>
			<NavItemBackButton
				backLabel={__('Border Radius Variables', 'blockera')}
				closeCallback={closeCallback}
			/>

			<Flex
				direction="column"
				gap="16px"
				className="blockera-border-radius-presets"
				style={{
					width: '100%',
					marginTop: '10px',
					paddingBottom: '10px',
				}}
			>
				<GlobalStylesPanelDescription>
					{__(
						'Create and edit border radius variables used for rounded corners.',
						'blockera'
					)}
				</GlobalStylesPanelDescription>

				<Flex
					direction="column"
					style={{ padding: '0 16px', width: '100%' }}
				>
					<BorderRadiusPresetContent />
				</Flex>
			</Flex>
		</div>
	);
}

export default BorderRadius;
