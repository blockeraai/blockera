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
import { TextShadowPresetOpener } from './text-shadow-preset-opener';
import {
	TextShadowPresetSize,
	type TextShadowDefaultPresetValue,
} from './text-shadow-preset-size';
import {
	DEFAULT_TEXT_SHADOW_ITEM,
	sanitizeTextShadowPresets,
	textShadowPresetItemsToCss,
	type WpTextShadowPreset,
} from './utils';
import { NavItemBackButton } from '../navigation/nav-item-back-button';

import './style.scss';

const textShadowPresetFieldsPropsResolver =
	createPresetFieldsPropsResolver('textShadowPreset');

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
	const { isResetDialogOpen, toggleResetDialog } =
		usePresetResetDialogState();

	const { dialogText: resetDialogText, confirmButtonText } =
		getOriginResetDialogCopy(origin, __('text shadow', 'blockera'));

	const index = useMemo(
		() => getNewIndexFromPresets(sizes, 'text-shadow-'),
		[sizes]
	);

	const defaultPresetValue = useMemo((): TextShadowDefaultPresetValue &
		VariableType & { slug: string; name: string } => {
		return {
			shadow: textShadowPresetItemsToCss([
				{ ...DEFAULT_TEXT_SHADOW_ITEM },
			]),
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
				<ConfirmResetPresetDialog
					text={resetDialogText}
					confirmButtonText={confirmButtonText}
					isOpen={isResetDialogOpen}
					toggleOpen={toggleResetDialog}
					onConfirm={handleResetPresets}
				/>
			)}
			<PresetGroup
				repeaterItemHeader={TextShadowPresetOpener}
				onChange={handleChange}
				controlName={controlName}
				defaultPresetValue={defaultPresetValue}
				origin={origin}
				variables={sizes}
				PresetFields={TextShadowPresetSize}
				title={__('Text shadow', 'blockera')}
				label={getOriginVariablesLabel(origin)}
				presetFieldsPropsResolver={textShadowPresetFieldsPropsResolver}
			/>
		</>
	);
}

const TextShadowPresetGroup = memo(TextShadowPresetGroupComponent);

/**
 * Reads/writes `settings.textShadow` in user theme.json — presets per origin (optional defaultPresets),
 * each preset `{ slug, name, shadow }` with CSS `text-shadow` (same value pattern as core shadow presets).
 */
export function TextShadowsPresetContent() {
	const [rawThemePresets, setThemePresets] = useGlobalSetting(
		'textShadow.presets.theme',
		''
	);

	const [baseThemePresets] = useGlobalSetting(
		'textShadow.presets.theme',
		'',
		'base'
	);
	const [rawDefaultPresets, setDefaultPresets] = useGlobalSetting(
		'textShadow.presets.default',
		''
	);

	const [baseDefaultPresets] = useGlobalSetting(
		'textShadow.presets.default',
		'',
		'base'
	);

	const [rawCustomPresets = [], setCustomPresets] = useGlobalSetting(
		'textShadow.presets.custom',
		''
	);

	const [defaultTextShadowPresetsEnabled = true] = useGlobalSetting(
		'textShadow.defaultPresets',
		''
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

	const defaultLayerOn = defaultTextShadowPresetsEnabled !== false;
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

export function TextShadows({ closeCallback }: { closeCallback?: () => void }) {
	return (
		<div
			className={classNames(
				'blockera-navigation-panel',
				'blockera-text-shadows-presets-navigation'
			)}
		>
			<NavItemBackButton
				backLabel={__('Text Shadow Variables', 'blockera')}
				closeCallback={closeCallback}
			/>

			<Flex
				direction="column"
				gap="16px"
				className="blockera-text-shadows-presets"
				style={{ width: '100%', marginTop: '10px' }}
			>
				<GlobalStylesPanelDescription>
					{__(
						'Create and edit text shadow variables used for typography depth and glow.',
						'blockera'
					)}
				</GlobalStylesPanelDescription>

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
