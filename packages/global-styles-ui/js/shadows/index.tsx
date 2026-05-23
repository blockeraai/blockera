/**
 * External dependencies
 */
import {
	createPortal,
	useCallback,
	useMemo,
	memo,
	useEffect,
} from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { Flex, PoweredBy } from '@blockera/controls';
import { isEquals } from '@blockera/utils';

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
import {
	BLOCKERA_SHADOWS_PRESET_INSPECTOR_ACTIVE_CLASS,
	disablePresetInspectorCleanup,
	enablePresetInspectorCleanup,
	useOverrideNavigator,
} from '../panel-override';
import { useGlobalSetting } from '../context/global-style-hooks';
import { type VariableType } from '../components/types';
import { ShadowPresetOpener } from './shadow-preset-opener';
import {
	ShadowPresetSize,
	type ShadowDefaultPresetValue,
} from './shadow-preset-size';
import {
	DEFAULT_SHADOW_ITEM,
	sanitizeShadowPresets,
	shadowPresetItemsToCss,
	type WpShadowPreset,
} from './utils';

const shadowPresetFieldsPropsResolver =
	createPresetFieldsPropsResolver('shadowPreset');

function ShadowPresetGroupComponent({
	sizes,
	origin,
	handleUpdateSizes,
	handleResetPresets,
}: {
	label: string;
	origin: string;
	sizes: WpShadowPreset[];
	handleUpdateSizes?: (newValue: Object) => void;
	handleResetPresets?: () => void;
}) {
	const { isResetDialogOpen, toggleResetDialog } =
		usePresetResetDialogState();

	const { dialogText: resetDialogText, confirmButtonText } =
		getOriginResetDialogCopy(origin, __('shadow', 'blockera'));

	const index = useMemo(
		() => getNewIndexFromPresets(sizes, 'shadow-'),
		[sizes]
	);

	const defaultPresetValue = useMemo((): ShadowDefaultPresetValue &
		VariableType & { slug: string; name: string } => {
		return {
			shadow: shadowPresetItemsToCss([{ ...DEFAULT_SHADOW_ITEM }]),
			isVisible: true,
			slug: `shadow-${index}`,
			deletable: !!('custom' === origin),
			cloneable: !!('custom' === origin),
			visibilitySupport: !!('custom' === origin),
			/* translators: %d: shadow preset index */
			name: sprintf(__('Shadow %d', 'blockera'), index) as string,
		};
	}, [origin, index]);

	const controlName = `shadow-preset-presets-${origin}`;

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
				repeaterItemHeader={ShadowPresetOpener}
				onChange={handleChange}
				controlName={controlName}
				defaultPresetValue={defaultPresetValue}
				origin={origin}
				variables={sizes}
				PresetFields={ShadowPresetSize}
				title={__('Shadow', 'blockera')}
				label={getOriginVariablesLabel(origin)}
				presetFieldsPropsResolver={shadowPresetFieldsPropsResolver}
			/>
		</>
	);
}

const ShadowPresetGroup = memo(ShadowPresetGroupComponent);

/**
 * Reads/writes `settings.shadow` in user theme.json — presets per origin using the core shape
 * `{ slug, name, shadow }` (CSS `box-shadow` value).
 */
export function ShadowsPresetContent() {
	const [rawThemePresets, setThemePresets] = useGlobalSetting(
		'shadow.presets.theme',
		''
	);

	const [baseThemePresets] = useGlobalSetting(
		'shadow.presets.theme',
		'',
		'base'
	);
	const [rawDefaultPresets, setDefaultPresets] = useGlobalSetting(
		'shadow.presets.default',
		''
	);

	const [baseDefaultPresets] = useGlobalSetting(
		'shadow.presets.default',
		'',
		'base'
	);

	const [rawCustomPresets = [], setCustomPresets] = useGlobalSetting(
		'shadow.presets.custom',
		''
	);

	const [defaultShadowPresetsEnabled = true] = useGlobalSetting(
		'shadow.defaultPresets',
		''
	);

	const themePresets = useMemo(
		() => sanitizeShadowPresets(rawThemePresets),
		[rawThemePresets]
	);
	const defaultPresets = useMemo(
		() => sanitizeShadowPresets(rawDefaultPresets),
		[rawDefaultPresets]
	);
	const customPresets = useMemo(
		() => sanitizeShadowPresets(rawCustomPresets),
		[rawCustomPresets]
	);

	const convertRepeaterValueToArray = useCallback(
		(newValue: Object): WpShadowPreset[] =>
			sanitizeShadowPresets(
				Object.values(
					newValue as Record<string, Record<string, unknown>>
				)
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
		setThemePresets(sanitizeShadowPresets(baseThemePresets));
	}, [setThemePresets, baseThemePresets]);

	const resetDefaultToBase = useCallback(() => {
		setDefaultPresets(sanitizeShadowPresets(baseDefaultPresets));
	}, [setDefaultPresets, baseDefaultPresets]);

	const clearCustomSizes = useCallback(() => {
		setCustomPresets([]);
	}, [setCustomPresets]);

	const themeResetHandler = useMemo(() => {
		if (!themePresets?.length) {
			return undefined;
		}
		const base = sanitizeShadowPresets(baseThemePresets ?? []);
		if (isEquals(themePresets, base)) {
			return undefined;
		}
		return resetThemeToBase;
	}, [themePresets, baseThemePresets, resetThemeToBase]);

	const defaultResetHandler = useMemo(() => {
		if (!defaultPresets?.length) {
			return undefined;
		}
		const base = sanitizeShadowPresets(baseDefaultPresets ?? []);
		if (isEquals(defaultPresets, base)) {
			return undefined;
		}
		return resetDefaultToBase;
	}, [defaultPresets, baseDefaultPresets, resetDefaultToBase]);

	const customResetHandler = useMemo(
		() => (customPresets.length > 0 ? clearCustomSizes : undefined),
		[customPresets.length, clearCustomSizes]
	);

	const defaultLayerOn = defaultShadowPresetsEnabled !== false;
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

	return (
		<Flex direction="column" gap="32px" style={{ width: '100%' }}>
			{showThemeOriginGroup && (
				<ShadowPresetGroup
					origin="theme"
					label={__('Theme', 'blockera')}
					sizes={themePresets}
					handleUpdateSizes={handleUpdateThemeSizes}
					handleResetPresets={themeResetHandler}
				/>
			)}

			{showDefaultGroup && (
				<ShadowPresetGroup
					origin="default"
					label={__('Default', 'blockera')}
					sizes={defaultPresets}
					handleUpdateSizes={handleUpdateDefaultSizes}
					handleResetPresets={defaultResetHandler}
				/>
			)}

			<ShadowPresetGroup
				origin="custom"
				label={__('Custom', 'blockera')}
				sizes={customPresets}
				handleUpdateSizes={handleUpdateCustomSizes}
				handleResetPresets={customResetHandler}
			/>
		</Flex>
	);
}

interface ShadowsProps {
	screenSelector: string;
}

function Shadows({ screenSelector }: ShadowsProps) {
	useOverrideNavigator({ panel: 'shadows' });

	useEffect(() => {
		enablePresetInspectorCleanup(
			BLOCKERA_SHADOWS_PRESET_INSPECTOR_ACTIVE_CLASS,
			undefined,
			'.blockera-shadows-presets-navigation'
		);

		return () => {
			disablePresetInspectorCleanup(
				BLOCKERA_SHADOWS_PRESET_INSPECTOR_ACTIVE_CLASS
			);
		};
	}, []);

	const target = document.querySelector(screenSelector);
	if (!target) {
		return null;
	}

	return createPortal(
		<div className="blockera-block-inspector-controls-wrapper blockera-shadows-presets-navigation">
			{/* We do not have access to the back button here, so we need to add the branding manually. */}
			<PoweredBy
				style={{
					position: 'absolute',
					right: '14px',
					top: '15px',
				}}
				linkTabIndex={-1}
			/>

			<Flex
				direction="column"
				gap="16px"
				className="blockera-shadows-presets"
				style={{
					width: '100%',
					marginTop: '10px',
					paddingBottom: '10px',
				}}
			>
				<GlobalStylesPanelDescription>
					{__(
						'Create and edit box shadow variables used for elevation and depth.',
						'blockera'
					)}
				</GlobalStylesPanelDescription>

				<Flex
					direction="column"
					style={{ padding: '0 16px', width: '100%' }}
				>
					<ShadowsPresetContent />
				</Flex>
			</Flex>
		</div>,
		target
	);
}

export default Shadows;
