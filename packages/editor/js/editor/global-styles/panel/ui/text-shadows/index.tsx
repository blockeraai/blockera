/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useState, useCallback, useMemo, memo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/controls';
import { isEquals, pascalCase } from '@blockera/utils';
import { classNames } from '@blockera/classnames';

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
import { TextShadowPresetOpener } from './text-shadow-preset-opener';
import {
	TextShadowPresetSize,
	type TextShadowDefaultPresetValue,
} from './text-shadow-preset-size';
import { sanitizeTextShadowPresets, type WpTextShadowPreset } from './utils';
import ConfirmResetFontSizesDialog from '../font-sizes/confirm-reset-font-sizes-dialog';
import { NavItemBackButton } from '../../../../navigation/nav-item-back-button';

import './style.scss';

type TextShadowPresetGroup = {
	defaultPresetValue: TextShadowDefaultPresetValue & {
		slug: string;
		name: string;
	};
};

type TextShadowPresetGroupProps = PresetGroupPropsType & TextShadowPresetGroup;

const textShadowPresetFieldsPropsResolver: PresetFieldsPropsResolver = (
	item,
	itemId,
	origin
) => ({
	origin,
	textShadowPreset: item,
	presetId: itemId,
});

const TEXT_SHADOW_PRESET_ADD_MODAL_CONFIG = {
	headerTitle: __('Add Text Shadow Preset', 'blockera'),
	description: __(
		'Name your new text shadow preset. The ID will be generated from the name and used in your styles.',
		'blockera'
	),
	duplicateSlugMessage: __(
		'This ID is already used by another text shadow preset.',
		'blockera'
	),
	controlNamePrefix: 'add-text-shadow-preset',
};

function TextShadowBoxPresetGroupComponent(props: TextShadowPresetGroupProps) {
	return <PresetGroup {...props} />;
}

function TextShadowPresetGroupComponent({
	sizes,
	origin,
	handleUpdateSizes,
	handleResetPresets,
}: {
	label: string;
	origin: string;
	sizes: WpTextShadowPreset[];
	handleUpdateSizes?: (newValue: Object) => void;
	handleResetPresets?: () => void;
}) {
	const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

	const toggleResetDialog = () => setIsResetDialogOpen(!isResetDialogOpen);

	const resetDialogText =
		origin === 'custom'
			? __(
					'Are you sure you want to remove all custom text shadow presets?',
					'blockera'
				)
			: __(
					'Are you sure you want to reset all text shadow presets to their default values?',
					'blockera'
				);

	const index = useMemo(
		() => getNewIndexFromPresets(sizes, 'custom-'),
		[sizes]
	);

	const defaultPresetValue = useMemo((): TextShadowDefaultPresetValue &
		VariableType & { slug: string; name: string } => {
		return {
			shadow: '1px 1px 2px rgba(0, 0, 0, 0.25)',
			slug: `text-shadow-${index}`,
			deletable: !!('custom' === origin),
			cloneable: !!('custom' === origin),
			visibilitySupport: !!('custom' === origin),
			/* translators: %d: text shadow preset index */
			name: sprintf(__('Text shadow %d', 'blockera'), index) as string,
		};
	}, [origin, index]);

	const controlName = `text-shadow-preset-presets-${origin}`;

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
			<TextShadowBoxPresetGroupComponent
				repeaterItemHeader={TextShadowPresetOpener}
				onChange={handleChange}
				controlName={controlName}
				defaultPresetValue={defaultPresetValue}
				origin={origin}
				variables={sizes}
				PresetFields={TextShadowPresetSize}
				title={__('Text shadow', 'blockera')}
				label={sprintf(
					/* translators: %s: Origin name (Theme, Default, or Custom) */
					__('%s Variables', 'blockera'),
					pascalCase(origin)
				)}
				addVariableModalConfig={TEXT_SHADOW_PRESET_ADD_MODAL_CONFIG}
				presetFieldsPropsResolver={textShadowPresetFieldsPropsResolver}
			/>
		</>
	);
}

const TextShadowPresetGroup = memo(TextShadowPresetGroupComponent);

/**
 * Reads/writes `settings.textShadow` in user theme.json — same layout as box `settings.shadow`
 * (presets.theme | default | custom, optional defaultPresets), with each preset’s `shadow`
 * field storing a CSS `text-shadow` value.
 */
function TextShadowsPresetContent() {
	const [rawThemePresets, setThemePresets] = useGlobalSetting(
		'textShadow.presets.theme'
	);

	const [baseThemePresets] = useGlobalSetting(
		'textShadow.presets.theme',
		'',
		'base'
	);
	const [rawDefaultPresets, setDefaultPresets] = useGlobalSetting(
		'textShadow.presets.default'
	);

	const [baseDefaultPresets] = useGlobalSetting(
		'textShadow.presets.default',
		'',
		'base'
	);

	const [rawCustomPresets = [], setCustomPresets] = useGlobalSetting(
		'textShadow.presets.custom'
	);

	const [defaultTextShadowPresetsEnabled = true] = useGlobalSetting(
		'textShadow.defaultPresets'
	);

	const themePresets = useMemo(
		() => sanitizeTextShadowPresets(rawThemePresets),
		[rawThemePresets]
	);
	const defaultPresets = useMemo(
		() => sanitizeTextShadowPresets(rawDefaultPresets),
		[rawDefaultPresets]
	);
	const customPresets = useMemo(
		() => sanitizeTextShadowPresets(rawCustomPresets),
		[rawCustomPresets]
	);

	const convertRepeaterValueToArray = useCallback(
		(newValue: Object): WpTextShadowPreset[] =>
			sanitizeTextShadowPresets(
				Object.values(
					newValue as Record<
						string,
						WpTextShadowPreset & Record<string, unknown>
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
		setThemePresets(sanitizeTextShadowPresets(baseThemePresets));
	}, [setThemePresets, baseThemePresets]);

	const resetDefaultToBase = useCallback(() => {
		setDefaultPresets(sanitizeTextShadowPresets(baseDefaultPresets));
	}, [setDefaultPresets, baseDefaultPresets]);

	const clearCustomSizes = useCallback(() => {
		setCustomPresets([]);
	}, [setCustomPresets]);

	const themeResetHandler = useMemo(() => {
		if (!themePresets?.length) {
			return undefined;
		}
		const base = sanitizeTextShadowPresets(baseThemePresets ?? []);
		if (isEquals(themePresets, base)) {
			return undefined;
		}
		return resetThemeToBase;
	}, [themePresets, baseThemePresets, resetThemeToBase]);

	const defaultResetHandler = useMemo(() => {
		if (!defaultPresets?.length) {
			return undefined;
		}
		const base = sanitizeTextShadowPresets(baseDefaultPresets ?? []);
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
		defaultTextShadowPresetsEnabled !== false && !!defaultPresets?.length;

	return (
		<Flex direction="column" gap="32px" style={{ width: '100%' }}>
			{!!themePresets?.length && (
				<TextShadowPresetGroup
					origin="theme"
					label={__('Theme', 'blockera')}
					sizes={themePresets}
					handleUpdateSizes={handleUpdateThemeSizes}
					handleResetPresets={themeResetHandler}
				/>
			)}

			{showDefaultGroup && (
				<TextShadowPresetGroup
					origin="default"
					label={__('Default', 'blockera')}
					sizes={defaultPresets}
					handleUpdateSizes={handleUpdateDefaultSizes}
					handleResetPresets={defaultResetHandler}
				/>
			)}

			<TextShadowPresetGroup
				origin="custom"
				label={__('Custom', 'blockera')}
				sizes={customPresets}
				handleUpdateSizes={handleUpdateCustomSizes}
				handleResetPresets={customResetHandler}
			/>
		</Flex>
	);
}

export function TextShadows({
	backLabel,
	closeCallback,
}: {
	backLabel: string;
	closeCallback?: () => void;
}) {
	return (
		<div
			className={classNames(
				'blockera-navigation-panel',
				'blockera-text-shadows-presets-navigation'
			)}
		>
			<NavItemBackButton
				backLabel={backLabel}
				closeCallback={closeCallback}
			/>
			<Flex
				direction="column"
				gap="8px"
				className="blockera-text-shadows-presets"
				style={{ width: '100%' }}
			>
				<Flex
					direction="column"
					gap="8px"
					style={{ padding: '12px 16px', width: '100%' }}
				>
					<p className="global-styles-ui-header__description">
						{__(
							'Create and edit text shadow presets used in typography controls (theme.json settings.textShadow.presets, same shape as shadow presets: slug, name, shadow).',
							'blockera'
						)}
					</p>
				</Flex>

				<Flex
					direction="column"
					style={{ padding: '0 16px', width: '100%' }}
				>
					<TextShadowsPresetContent />
				</Flex>
			</Flex>
		</div>
	);
}

export default TextShadows;
