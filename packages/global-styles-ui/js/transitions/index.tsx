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
	buildPresetAddModalConfig,
	createPresetFieldsPropsResolver,
	ConfirmResetPresetDialog,
	getOriginResetDialogCopy,
	getOriginVariablesLabel,
	GlobalStylesPanelDescription,
	usePresetResetDialogState,
} from '../components';
import { useGlobalSetting } from '../context/global-style-hooks';
import { type VariableType } from '../components/types';
import { TransitionPresetOpener } from './transition-preset-opener';
import {
	TransitionPresetSize,
	type TransitionDefaultPresetValue,
} from './transition-preset-size';
import { sanitizeTransitionPresets, type WpTransitionPreset } from './utils';
import { NavItemBackButton } from '../navigation/nav-item-back-button';

import './style.scss';

const transitionPresetFieldsPropsResolver =
	createPresetFieldsPropsResolver('transitionPreset');

const TRANSITION_PRESET_ADD_MODAL_CONFIG = buildPresetAddModalConfig({
	headerTitle: __('Add Transition Preset', 'blockera'),
	newPresetTypeLabel: __('transition', 'blockera'),
	controlNamePrefix: 'add-transition-preset',
});

function TransitionPresetGroupComponent({
	sizes,
	origin,
	handleUpdateSizes,
	handleResetPresets,
}: {
	label: string;
	origin: string;
	sizes: WpTransitionPreset[];
	handleUpdateSizes?: (newValue: Object) => void;
	handleResetPresets?: () => void;
}) {
	const { isResetDialogOpen, toggleResetDialog } =
		usePresetResetDialogState();

	const { dialogText: resetDialogText, confirmButtonText } =
		getOriginResetDialogCopy(origin, __('transition', 'blockera'));

	const index = useMemo(
		() => getNewIndexFromPresets(sizes, 'transition-'),
		[sizes]
	);

	const defaultPresetValue = useMemo((): TransitionDefaultPresetValue &
		VariableType & { slug: string; name: string } => {
		return {
			isVisible: true,
			items: [
				{
					type: 'all',
					isVisible: true,
					duration: '500ms',
					timing: 'ease',
					delay: '0ms',
				},
			],
			slug: `transition-${index}`,
			deletable: !!('custom' === origin),
			cloneable: !!('custom' === origin),
			visibilitySupport: !!('custom' === origin),
			/* translators: %d: transition preset index */
			name: sprintf(__('Transition %d', 'blockera'), index) as string,
		};
	}, [origin, index]);

	const controlName = `transition-preset-presets-${origin}`;

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
				repeaterItemHeader={TransitionPresetOpener}
				onChange={handleChange}
				controlName={controlName}
				defaultPresetValue={defaultPresetValue}
				origin={origin}
				variables={sizes}
				PresetFields={TransitionPresetSize}
				title={__('Transition', 'blockera')}
				label={getOriginVariablesLabel(origin)}
				addVariableModalConfig={TRANSITION_PRESET_ADD_MODAL_CONFIG}
				presetFieldsPropsResolver={transitionPresetFieldsPropsResolver}
			/>
		</>
	);
}

const TransitionPresetGroup = memo(TransitionPresetGroupComponent);

/**
 * Reads/writes `settings.transition` in user theme.json — same layout as `settings.textShadow`
 * (presets.theme | default | custom, optional defaultPresets), with each preset’s `items`
 * array storing transition rows (type, duration, timing, delay).
 */
function TransitionsPresetContent() {
	const [rawThemePresets, setThemePresets] = useGlobalSetting(
		'transition.presets.theme'
	);

	const [baseThemePresets] = useGlobalSetting(
		'transition.presets.theme',
		'',
		'base'
	);
	const [rawDefaultPresets, setDefaultPresets] = useGlobalSetting(
		'transition.presets.default'
	);

	const [baseDefaultPresets] = useGlobalSetting(
		'transition.presets.default',
		'',
		'base'
	);

	const [rawCustomPresets = [], setCustomPresets] = useGlobalSetting(
		'transition.presets.custom'
	);

	const [defaultTransitionPresetsEnabled = true] = useGlobalSetting(
		'transition.defaultPresets'
	);

	const themePresets = useMemo(
		() => sanitizeTransitionPresets(rawThemePresets),
		[rawThemePresets]
	);
	const defaultPresets = useMemo(
		() => sanitizeTransitionPresets(rawDefaultPresets),
		[rawDefaultPresets]
	);
	const customPresets = useMemo(
		() => sanitizeTransitionPresets(rawCustomPresets),
		[rawCustomPresets]
	);

	const convertRepeaterValueToArray = useCallback(
		(newValue: Object): WpTransitionPreset[] =>
			sanitizeTransitionPresets(
				Object.values(
					newValue as Record<
						string,
						WpTransitionPreset & Record<string, unknown>
					>
				).map((value) => ({
					slug: value.slug,
					name: value.name,
					items: value.items,
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
		setThemePresets(sanitizeTransitionPresets(baseThemePresets));
	}, [setThemePresets, baseThemePresets]);

	const resetDefaultToBase = useCallback(() => {
		setDefaultPresets(sanitizeTransitionPresets(baseDefaultPresets));
	}, [setDefaultPresets, baseDefaultPresets]);

	const clearCustomSizes = useCallback(() => {
		setCustomPresets([]);
	}, [setCustomPresets]);

	const themeResetHandler = useMemo(() => {
		if (!themePresets?.length) {
			return undefined;
		}
		const base = sanitizeTransitionPresets(baseThemePresets ?? []);
		if (isEquals(themePresets, base)) {
			return undefined;
		}
		return resetThemeToBase;
	}, [themePresets, baseThemePresets, resetThemeToBase]);

	const defaultResetHandler = useMemo(() => {
		if (!defaultPresets?.length) {
			return undefined;
		}
		const base = sanitizeTransitionPresets(baseDefaultPresets ?? []);
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
		defaultTransitionPresetsEnabled !== false && !!defaultPresets?.length;

	return (
		<Flex direction="column" gap="32px" style={{ width: '100%' }}>
			{!!themePresets?.length && (
				<TransitionPresetGroup
					origin="theme"
					label={__('Theme', 'blockera')}
					sizes={themePresets}
					handleUpdateSizes={handleUpdateThemeSizes}
					handleResetPresets={themeResetHandler}
				/>
			)}

			{showDefaultGroup && (
				<TransitionPresetGroup
					origin="default"
					label={__('Default', 'blockera')}
					sizes={defaultPresets}
					handleUpdateSizes={handleUpdateDefaultSizes}
					handleResetPresets={defaultResetHandler}
				/>
			)}

			<TransitionPresetGroup
				origin="custom"
				label={__('Custom', 'blockera')}
				sizes={customPresets}
				handleUpdateSizes={handleUpdateCustomSizes}
				handleResetPresets={customResetHandler}
			/>
		</Flex>
	);
}

export function Transitions({
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
				'blockera-transitions-presets-navigation'
			)}
		>
			<NavItemBackButton
				backLabel={backLabel}
				closeCallback={closeCallback}
			/>
			<Flex
				direction="column"
				gap="8px"
				className="blockera-transitions-presets"
				style={{ width: '100%' }}
			>
				<GlobalStylesPanelDescription>
					{__(
						'Create and edit transition presets used for duration, timing, and delay on property changes.',
						'blockera'
					)}
				</GlobalStylesPanelDescription>

				<Flex
					direction="column"
					style={{ padding: '0 16px', width: '100%' }}
				>
					<TransitionsPresetContent />
				</Flex>
			</Flex>
		</div>
	);
}

export default Transitions;
