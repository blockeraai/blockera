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
import { TransitionPresetOpener } from './transition-preset-opener';
import {
	TransitionPresetSize,
	type TransitionDefaultPresetValue,
} from './transition-preset-size';
import { sanitizeTransitionPresets, type WpTransitionPreset } from './utils';
import { NavItemBackButton } from '../navigation/nav-item-back-button';

const transitionPresetFieldsPropsResolver =
	createPresetFieldsPropsResolver('transitionPreset');

function TransitionPresetGroupComponent({
	sizes,
	baseSizes,
	origin,
	persistSizes,
	convertRepeaterToItems,
	handleResetPresets,
}: {
	label: string;
	origin: string;
	sizes: WpTransitionPreset[];
	baseSizes?: WpTransitionPreset[];
	persistSizes?: (items: WpTransitionPreset[]) => void;
	convertRepeaterToItems: (
		newValue: object,
		baseline: WpTransitionPreset[]
	) => WpTransitionPreset[];
	handleResetPresets?: () => void;
}) {
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

	const onPersistItems = useCallback(
		(next: WpTransitionPreset[]) => {
			persistSizes?.(next);
		},
		[persistSizes]
	);

	return (
		<PresetTaxonomyGroupLayout<WpTransitionPreset & Record<string, unknown>>
			origin={origin}
			items={sizes}
			baseItems={baseSizes}
			controlName={controlName}
			convertRepeaterToItems={convertRepeaterToItems}
			onPersistItems={onPersistItems}
			PresetFields={TransitionPresetSize}
			repeaterItemHeader={TransitionPresetOpener}
			presetFieldsPropsResolver={transitionPresetFieldsPropsResolver}
			defaultPresetValue={defaultPresetValue}
			title={__('Transition', 'blockera')}
			label={getOriginVariablesLabel(origin)}
			handleReset={handleResetPresets}
			resetDialogText={resetDialogText}
			resetConfirmButtonText={confirmButtonText}
		/>
	);
}

const TransitionPresetGroup = memo(TransitionPresetGroupComponent);

/**
 * Reads/writes `settings.transition` in user theme.json — same layout as `settings.textShadow`
 * (presets.theme | default | custom, optional defaultPresets), with each preset’s `items`
 * array storing transition rows (type, duration, timing, delay).
 */
export function TransitionsPresetContent() {
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
					isVisible: value.isVisible,
				}))
			),
		[]
	);

	const persistThemeSizes = useCallback(
		(next: WpTransitionPreset[]) => {
			setThemePresets(next);
		},
		[setThemePresets]
	);

	const persistDefaultSizes = useCallback(
		(next: WpTransitionPreset[]) => {
			setDefaultPresets(next);
		},
		[setDefaultPresets]
	);

	const persistCustomSizes = useCallback(
		(next: WpTransitionPreset[]) => {
			setCustomPresets(next);
		},
		[setCustomPresets]
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

	const defaultLayerOn = defaultTransitionPresetsEnabled !== false;
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
		() => sanitizeTransitionPresets(baseThemePresets),
		[baseThemePresets]
	);

	return (
		<Flex direction="column" gap="32px" style={{ width: '100%' }}>
			{showThemeOriginGroup && (
				<TransitionPresetGroup
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
				<TransitionPresetGroup
					origin="default"
					label={__('Default', 'blockera')}
					sizes={defaultPresets}
					persistSizes={persistDefaultSizes}
					convertRepeaterToItems={convertRepeaterValueToArray}
					handleResetPresets={defaultResetHandler}
				/>
			)}

			<TransitionPresetGroup
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

export function Transitions({ closeCallback }: { closeCallback?: () => void }) {
	return (
		<div
			className={classNames(
				'blockera-navigation-panel',
				'blockera-transitions-presets-navigation'
			)}
		>
			<NavItemBackButton
				backLabel={__('Transitions Variables', 'blockera')}
				closeCallback={closeCallback}
			/>

			<Flex
				direction="column"
				gap="16px"
				className="blockera-transitions-presets"
				style={{
					width: '100%',
					marginTop: '10px',
					paddingBottom: '10px',
				}}
			>
				<GlobalStylesPanelDescription>
					{__(
						'Create and edit transition variables used for duration, timing, and delay on property changes.',
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
