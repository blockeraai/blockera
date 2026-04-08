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
	usePresetResetDialogState,
} from '../components';
import { useGlobalSetting } from '../context/global-style-hooks';
import { type VariableType } from '../components/types';
import { TransformPresetOpener } from './transform-preset-opener';
import {
	TransformPresetSize,
	type TransformDefaultPresetValue,
} from './transform-preset-size';
import { sanitizeTransformPresets, type WpTransformPreset } from './utils';
import { NavItemBackButton } from '../navigation/nav-item-back-button';

const transformPresetFieldsPropsResolver =
	createPresetFieldsPropsResolver('transformPreset');

function TransformPresetGroupComponent({
	sizes,
	origin,
	handleUpdateSizes,
	handleResetPresets,
}: {
	label: string;
	origin: string;
	sizes: WpTransformPreset[];
	handleUpdateSizes?: (newValue: Object) => void;
	handleResetPresets?: () => void;
}) {
	const { isResetDialogOpen, toggleResetDialog } =
		usePresetResetDialogState();

	const { dialogText: resetDialogText, confirmButtonText } =
		getOriginResetDialogCopy(origin, __('transform', 'blockera'));

	const index = useMemo(
		() => getNewIndexFromPresets(sizes, 'transform-'),
		[sizes]
	);

	const defaultPresetValue = useMemo((): TransformDefaultPresetValue &
		VariableType & { slug: string; name: string } => {
		return {
			isVisible: true,
			items: [
				{
					type: 'move',
					isVisible: true,
					'move-x': '0px',
					'move-y': '0px',
					'move-z': '0px',
				},
			],
			slug: `transform-${index}`,
			deletable: !!('custom' === origin),
			cloneable: !!('custom' === origin),
			visibilitySupport: !!('custom' === origin),
			/* translators: %d: transform preset index */
			name: sprintf(__('Transform %d', 'blockera'), index) as string,
		};
	}, [origin, index]);

	const controlName = `transform-preset-presets-${origin}`;

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
				repeaterItemHeader={TransformPresetOpener}
				onChange={handleChange}
				controlName={controlName}
				defaultPresetValue={defaultPresetValue}
				origin={origin}
				variables={sizes}
				PresetFields={TransformPresetSize}
				title={__('2D & 3D Transforms', 'blockera')}
				label={getOriginVariablesLabel(origin)}
				presetFieldsPropsResolver={transformPresetFieldsPropsResolver}
			/>
		</>
	);
}

// Memo: each origin group is independent; avoids re-rendering all groups when one dialog or list updates.
const TransformPresetGroup = memo(TransformPresetGroupComponent);

/**
 * Reads/writes `settings.transform` in user theme.json — same layout as `settings.transition`
 * (presets.theme | default | custom, optional defaultPresets), with each preset’s `items`
 * array storing transform rows (move, scale, rotate, skew fields per row).
 */
function TransformsPresetContent() {
	const [rawThemePresets, setThemePresets] = useGlobalSetting(
		'transform.presets.theme'
	);

	const [baseThemePresets] = useGlobalSetting(
		'transform.presets.theme',
		'',
		'base'
	);
	const [rawDefaultPresets, setDefaultPresets] = useGlobalSetting(
		'transform.presets.default'
	);

	const [baseDefaultPresets] = useGlobalSetting(
		'transform.presets.default',
		'',
		'base'
	);

	const [rawCustomPresets = [], setCustomPresets] = useGlobalSetting(
		'transform.presets.custom'
	);

	const [defaultTransformPresetsEnabled = true] = useGlobalSetting(
		'transform.defaultPresets'
	);

	const themePresets = useMemo(
		() => sanitizeTransformPresets(rawThemePresets),
		[rawThemePresets]
	);
	const defaultPresets = useMemo(
		() => sanitizeTransformPresets(rawDefaultPresets),
		[rawDefaultPresets]
	);
	const customPresets = useMemo(
		() => sanitizeTransformPresets(rawCustomPresets),
		[rawCustomPresets]
	);

	const convertRepeaterValueToArray = useCallback(
		(newValue: Object): WpTransformPreset[] =>
			sanitizeTransformPresets(
				Object.values(
					newValue as Record<
						string,
						WpTransformPreset & Record<string, unknown>
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
		setThemePresets(sanitizeTransformPresets(baseThemePresets));
	}, [setThemePresets, baseThemePresets]);

	const resetDefaultToBase = useCallback(() => {
		setDefaultPresets(sanitizeTransformPresets(baseDefaultPresets));
	}, [setDefaultPresets, baseDefaultPresets]);

	const clearCustomSizes = useCallback(() => {
		setCustomPresets([]);
	}, [setCustomPresets]);

	const themeResetHandler = useMemo(() => {
		if (!themePresets?.length) {
			return undefined;
		}
		const base = sanitizeTransformPresets(baseThemePresets ?? []);
		if (isEquals(themePresets, base)) {
			return undefined;
		}
		return resetThemeToBase;
	}, [themePresets, baseThemePresets, resetThemeToBase]);

	const defaultResetHandler = useMemo(() => {
		if (!defaultPresets?.length) {
			return undefined;
		}
		const base = sanitizeTransformPresets(baseDefaultPresets ?? []);
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
		defaultTransformPresetsEnabled !== false && !!defaultPresets?.length;

	return (
		<Flex direction="column" gap="32px" style={{ width: '100%' }}>
			{!!themePresets?.length && (
				<TransformPresetGroup
					origin="theme"
					label={__('Theme', 'blockera')}
					sizes={themePresets}
					handleUpdateSizes={handleUpdateThemeSizes}
					handleResetPresets={themeResetHandler}
				/>
			)}

			{showDefaultGroup && (
				<TransformPresetGroup
					origin="default"
					label={__('Default', 'blockera')}
					sizes={defaultPresets}
					handleUpdateSizes={handleUpdateDefaultSizes}
					handleResetPresets={defaultResetHandler}
				/>
			)}

			<TransformPresetGroup
				origin="custom"
				label={__('Custom', 'blockera')}
				sizes={customPresets}
				handleUpdateSizes={handleUpdateCustomSizes}
				handleResetPresets={customResetHandler}
			/>
		</Flex>
	);
}

export function Transforms({
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
				'blockera-transforms-presets-navigation'
			)}
		>
			<NavItemBackButton
				backLabel={backLabel}
				closeCallback={closeCallback}
			/>
			<Flex
				direction="column"
				gap="8px"
				className="blockera-transforms-presets"
				style={{ width: '100%' }}
			>
				<GlobalStylesPanelDescription>
					{__(
						'Create and edit transform presets used for move, scale, rotate, and skew.',
						'blockera'
					)}
				</GlobalStylesPanelDescription>

				<Flex
					direction="column"
					style={{ padding: '0 16px', width: '100%' }}
				>
					<TransformsPresetContent />
				</Flex>
			</Flex>
		</div>
	);
}

export default Transforms;
