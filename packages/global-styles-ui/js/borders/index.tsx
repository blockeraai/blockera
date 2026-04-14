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
	PresetGroup,
	getNewIndexFromPresets,
	createPresetFieldsPropsResolver,
	ConfirmResetPresetDialog,
	getOriginResetDialogCopy,
	getOriginVariablesLabel,
	GlobalStylesPanelDescription,
	shouldShowDefaultPresetGroup,
	shouldShowThemePresetGroup,
	usePresetResetDialogState,
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
	origin,
	handleUpdateSizes,
	handleResetPresets,
}: {
	label: string;
	origin: string;
	sizes: BorderBoxPreset[];
	handleUpdateSizes?: (newValue: Object) => void;
	handleResetPresets?: () => void;
}) {
	const { isResetDialogOpen, toggleResetDialog } =
		usePresetResetDialogState();

	const { dialogText: resetDialogText, confirmButtonText } =
		getOriginResetDialogCopy(origin, __('border', 'blockera'));

	const index = useMemo(
		() => getNewIndexFromPresets(sizes, 'border-'),
		[sizes]
	);

	const defaultPresetValue = useMemo((): BorderBoxDefaultPresetValue &
		VariableType => {
		return {
			border: getDefaultStoredBorderSide(),
			slug: `border-${index}`,
			deletable: !!('custom' === origin),
			cloneable: !!('custom' === origin),
			visibilitySupport: !!('custom' === origin),
			/* translators: %d: border preset index */
			name: sprintf(__('Border %d', 'blockera'), index) as string,
		};
	}, [origin, index]);

	const controlName = `border-preset-presets-${origin}`;

	const handleChange = useCallback(
		(newValue: Object) => {
			if (!handleUpdateSizes) {
				return;
			}
			handleUpdateSizes(newValue);
		},
		[handleUpdateSizes]
	);

	return (
		<>
			{handleResetPresets && isResetDialogOpen && (
				<ConfirmResetPresetDialog
					text={resetDialogText}
					confirmButtonText={confirmButtonText}
					isOpen={isResetDialogOpen}
					toggleOpen={toggleResetDialog}
					onConfirm={handleResetPresets}
				/>
			)}
			<PresetGroup
				repeaterItemHeader={BorderPresetOpener}
				onChange={handleChange}
				controlName={controlName}
				defaultPresetValue={defaultPresetValue}
				origin={origin}
				variables={sizes}
				PresetFields={BorderPresetSize}
				title={__('Border', 'blockera')}
				label={getOriginVariablesLabel(origin)}
				presetFieldsPropsResolver={borderPresetFieldsPropsResolver}
			/>
		</>
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
				}))
			),
		[]
	);

	const handleUpdateCustomSizes = useCallback(
		(newValue: Object) => {
			setCustomPresets(convertRepeaterValueToArray(newValue));
		},
		[convertRepeaterValueToArray, setCustomPresets]
	);

	const handleUpdateThemeSizes = useCallback(
		(newValue: Object) => {
			setThemePresets(convertRepeaterValueToArray(newValue));
		},
		[convertRepeaterValueToArray, setThemePresets]
	);

	const handleUpdateDefaultSizes = useCallback(
		(newValue: Object) => {
			setDefaultPresets(convertRepeaterValueToArray(newValue));
		},
		[convertRepeaterValueToArray, setDefaultPresets]
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

	return (
		<Flex direction="column" gap="32px" style={{ width: '100%' }}>
			{showThemeOriginGroup && (
				<BorderPresetGroup
					origin="theme"
					label={__('Theme', 'blockera')}
					sizes={themePresets}
					handleUpdateSizes={handleUpdateThemeSizes}
					handleResetPresets={themeResetHandler}
				/>
			)}

			{showDefaultOriginGroup && (
				<BorderPresetGroup
					origin="default"
					label={__('Default', 'blockera')}
					sizes={defaultPresets}
					handleUpdateSizes={handleUpdateDefaultSizes}
					handleResetPresets={defaultResetHandler}
				/>
			)}

			<BorderPresetGroup
				origin="custom"
				label={__('Custom', 'blockera')}
				sizes={customPresets}
				handleUpdateSizes={handleUpdateCustomSizes}
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
				style={{ width: '100%', marginTop: '10px' }}
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
