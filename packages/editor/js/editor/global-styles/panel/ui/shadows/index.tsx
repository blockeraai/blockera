/**
 * External dependencies
 */
import {
	createPortal,
	useState,
	useCallback,
	useMemo,
	memo,
} from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/controls';
import { isEquals, pascalCase } from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	PresetGroup,
	getNewIndexFromPresets,
	type PresetGroupPropsType,
	type PresetFieldsPropsResolver,
} from '../components';
import { useGlobalSetting } from '../../context/hooks';
import { type VariableType } from '../components/types';
import { ShadowPresetOpener } from './shadow-preset-opener';
import {
	ShadowPresetSize,
	type ShadowDefaultPresetValue,
} from './shadow-preset-size';
import { sanitizeShadowPresets, type WpShadowPreset } from './utils';
import ConfirmResetFontSizesDialog from '../font-sizes/confirm-reset-font-sizes-dialog';

import './style.scss';

type ShadowPresetGroup = {
	defaultPresetValue: ShadowDefaultPresetValue & {
		slug: string;
		name: string;
	};
};

type ShadowPresetGroupProps = PresetGroupPropsType & ShadowPresetGroup;

const shadowPresetFieldsPropsResolver: PresetFieldsPropsResolver = (
	item,
	itemId,
	origin
) => ({
	origin,
	shadowPreset: item,
	presetId: itemId,
});

const SHADOW_PRESET_ADD_MODAL_CONFIG = {
	headerTitle: __('Add Shadow Preset', 'blockera'),
	description: __(
		'Name your new shadow preset. The ID will be generated from the name and used in your styles.',
		'blockera'
	),
	duplicateSlugMessage: __(
		'This ID is already used by another shadow preset.',
		'blockera'
	),
	controlNamePrefix: 'add-shadow-preset',
};

function ShadowBoxPresetGroupComponent(props: ShadowPresetGroupProps) {
	return <PresetGroup {...props} />;
}

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
	const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

	const toggleResetDialog = () => setIsResetDialogOpen(!isResetDialogOpen);

	const resetDialogText =
		origin === 'custom'
			? __(
					'Are you sure you want to remove all custom shadow presets?',
					'blockera'
				)
			: __(
					'Are you sure you want to reset all shadow presets to their default values?',
					'blockera'
				);

	const index = useMemo(
		() => getNewIndexFromPresets(sizes, 'custom-'),
		[sizes]
	);

	const defaultPresetValue = useMemo((): ShadowDefaultPresetValue &
		VariableType & { slug: string; name: string } => {
		return {
			shadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
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
				<ConfirmResetFontSizesDialog
					text={resetDialogText}
					confirmButtonText={
						origin === 'custom'
							? __('Remove', 'blockera')
							: __('Reset', 'blockera')
					}
					isOpen={isResetDialogOpen}
					toggleOpen={toggleResetDialog}
					onConfirm={handleResetPresets}
				/>
			)}
			<ShadowBoxPresetGroupComponent
				repeaterItemHeader={ShadowPresetOpener}
				onChange={handleChange}
				controlName={controlName}
				defaultPresetValue={defaultPresetValue}
				origin={origin}
				variables={sizes}
				PresetFields={ShadowPresetSize}
				title={__('Shadow', 'blockera')}
				label={sprintf(
					/* translators: %s: Origin name (Theme, Default, or Custom) */
					__('%s Variables', 'blockera'),
					pascalCase(origin)
				)}
				addVariableModalConfig={SHADOW_PRESET_ADD_MODAL_CONFIG}
				presetFieldsPropsResolver={shadowPresetFieldsPropsResolver}
			/>
		</>
	);
}

const ShadowPresetGroup = memo(ShadowPresetGroupComponent);

function ShadowsPresetContent() {
	const [rawThemePresets, setThemePresets] = useGlobalSetting(
		'shadow.presets.theme'
	);

	const [baseThemePresets] = useGlobalSetting(
		'shadow.presets.theme',
		'',
		'base'
	);
	const [rawDefaultPresets, setDefaultPresets] = useGlobalSetting(
		'shadow.presets.default'
	);

	const [baseDefaultPresets] = useGlobalSetting(
		'shadow.presets.default',
		'',
		'base'
	);

	const [rawCustomPresets = [], setCustomPresets] = useGlobalSetting(
		'shadow.presets.custom'
	);

	const [defaultShadowPresetsEnabled = true] = useGlobalSetting(
		'shadow.defaultPresets'
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
					newValue as Record<
						string,
						WpShadowPreset & Record<string, unknown>
					>
				).map((value) => ({
					slug: value.slug,
					name: value.name,
					shadow: value.shadow,
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

	const showDefaultGroup =
		defaultShadowPresetsEnabled !== false && !!defaultPresets?.length;

	return (
		<Flex direction="column" gap="32px" style={{ width: '100%' }}>
			{!!themePresets?.length && (
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
	const target = document.querySelector(screenSelector);
	if (!target) {
		return null;
	}

	return createPortal(
		<div className="blockera-shadows-presets-navigation">
			<ShadowsPresetContent />
		</div>,
		target
	);
}

export default Shadows;
