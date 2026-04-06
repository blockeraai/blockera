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
import { TransitionPresetOpener } from './transition-preset-opener';
import {
	TransitionPresetSize,
	type TransitionDefaultPresetValue,
} from './transition-preset-size';
import { sanitizeTransitionPresets, type WpTransitionPreset } from './utils';
import ConfirmResetFontSizesDialog from '../font-sizes/confirm-reset-font-sizes-dialog';
import { NavItemBackButton } from '../../../../navigation/nav-item-back-button';

import './style.scss';

type TransitionPresetGroup = {
	defaultPresetValue: TransitionDefaultPresetValue & {
		slug: string;
		name: string;
	};
};

type TransitionPresetGroupProps = PresetGroupPropsType & TransitionPresetGroup;

const transitionPresetFieldsPropsResolver: PresetFieldsPropsResolver = (
	item,
	itemId,
	origin
) => ({
	origin,
	transitionPreset: item,
	presetId: itemId,
});

const TRANSITION_PRESET_ADD_MODAL_CONFIG = {
	headerTitle: __('Add Transition Preset', 'blockera'),
	description: __(
		'Name your new transition preset. The ID will be generated from the name and used in your styles.',
		'blockera'
	),
	duplicateSlugMessage: __(
		'This ID is already used by another transition preset.',
		'blockera'
	),
	controlNamePrefix: 'add-transition-preset',
};

function TransitionBoxPresetGroupComponent(props: TransitionPresetGroupProps) {
	return <PresetGroup {...props} />;
}

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
	const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

	const toggleResetDialog = useCallback(() => {
		setIsResetDialogOpen((open) => !open);
	}, []);

	const resetDialogText = useMemo(
		() =>
			origin === 'custom'
				? __(
						'Are you sure you want to remove all custom transition presets?',
						'blockera'
					)
				: __(
						'Are you sure you want to reset all transition presets to their default values?',
						'blockera'
					),
		[origin]
	);

	const index = useMemo(
		() => getNewIndexFromPresets(sizes, 'custom-'),
		[sizes]
	);

	const defaultPresetValue = useMemo((): TransitionDefaultPresetValue &
		VariableType & { slug: string; name: string } => {
		return {
			items: [
				{
					type: 'all',
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
			<TransitionBoxPresetGroupComponent
				repeaterItemHeader={TransitionPresetOpener}
				onChange={handleChange}
				controlName={controlName}
				defaultPresetValue={defaultPresetValue}
				origin={origin}
				variables={sizes}
				PresetFields={TransitionPresetSize}
				title={__('Transition', 'blockera')}
				label={sprintf(
					/* translators: %s: Origin name (Theme, Default, or Custom) */
					__('%s Variables', 'blockera'),
					pascalCase(origin)
				)}
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
				<Flex
					direction="column"
					gap="8px"
					style={{ padding: '12px 16px', width: '100%' }}
				>
					<p className="global-styles-ui-header__description">
						{__(
							'Create and edit transition presets used in transition controls (theme.json settings.transition.presets: slug, name, and items with type, duration, timing, delay per row).',
							'blockera'
						)}
					</p>
				</Flex>

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
