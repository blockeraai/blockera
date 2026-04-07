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

const BORDER_RADIUS_ADD_MODAL_CONFIG = buildPresetAddModalConfig({
	headerTitle: __('Add Border Radius', 'blockera'),
	newPresetTypeLabel: __('border radius', 'blockera'),
	controlNamePrefix: 'add-border-radius',
});

function BorderRadiusSizeGroupComponent({
	sizes,
	origin,
	handleUpdateSizes,
	handleResetPresets,
}: {
	label: string;
	origin: string;
	sizes: BorderRadiusSizePreset[];
	handleUpdateSizes?: (newValue: Object) => void;
	handleResetPresets?: () => void;
}) {
	const { isResetDialogOpen, toggleResetDialog } =
		usePresetResetDialogState();

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
			slug: `border-radius-${index}`,
			deletable: !!('custom' === origin),
			cloneable: !!('custom' === origin),
			visibilitySupport: !!('custom' === origin),
			/* translators: %d: border radius preset index */
			name: sprintf(__('Border radius %d', 'blockera'), index) as string,
		};
	}, [origin, index]);

	const controlName = `border-radius-presets-${origin}`;

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
				repeaterItemHeader={BorderRadiusPresetOpener}
				onChange={handleChange}
				controlName={controlName}
				defaultPresetValue={defaultPresetValue}
				origin={origin}
				variables={sizes}
				PresetFields={BorderRadiusSize}
				title={__('Border radius', 'blockera')}
				label={getOriginVariablesLabel(origin)}
				addVariableModalConfig={BORDER_RADIUS_ADD_MODAL_CONFIG}
				presetFieldsPropsResolver={
					borderRadiusPresetFieldsPropsResolver
				}
			/>
		</>
	);
}

const BorderRadiusSizeGroup = memo(BorderRadiusSizeGroupComponent);

function BorderRadiusPresetContent() {
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
				).map((value) => ({
					slug: value.slug,
					name: value.name,
					size: value.size,
				}))
			),
		[]
	);

	const handleUpdateCustomSizes = useCallback(
		(newValue: Object) => {
			setCustomRadiusSizes(convertRepeaterValueToArray(newValue));
		},
		[convertRepeaterValueToArray, setCustomRadiusSizes]
	);

	const handleUpdateThemeSizes = useCallback(
		(newValue: Object) => {
			setThemeRadiusSizes(convertRepeaterValueToArray(newValue));
		},
		[convertRepeaterValueToArray, setThemeRadiusSizes]
	);

	const handleUpdateDefaultSizes = useCallback(
		(newValue: Object) => {
			setDefaultRadiusSizes(convertRepeaterValueToArray(newValue));
		},
		[convertRepeaterValueToArray, setDefaultRadiusSizes]
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

	return (
		<Flex direction="column" gap="32px" style={{ width: '100%' }}>
			{!!themeRadiusSizes?.length && (
				<BorderRadiusSizeGroup
					origin="theme"
					label={__('Theme', 'blockera')}
					sizes={themeRadiusSizes}
					handleUpdateSizes={handleUpdateThemeSizes}
					handleResetPresets={themeResetHandler}
				/>
			)}

			{!!defaultRadiusSizes?.length && (
				<BorderRadiusSizeGroup
					origin="default"
					label={__('Default', 'blockera')}
					sizes={defaultRadiusSizes}
					handleUpdateSizes={handleUpdateDefaultSizes}
					handleResetPresets={defaultResetHandler}
				/>
			)}

			<BorderRadiusSizeGroup
				origin="custom"
				label={__('Custom', 'blockera')}
				sizes={customRadiusSizes}
				handleUpdateSizes={handleUpdateCustomSizes}
				handleResetPresets={customResetHandler}
			/>
		</Flex>
	);
}

export function BorderRadius({
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
				'blockera-border-radius-presets-navigation'
			)}
		>
			<NavItemBackButton
				backLabel={backLabel}
				closeCallback={closeCallback}
			/>
			<Flex
				direction="column"
				gap="8px"
				className="blockera-border-radius-presets"
				style={{ width: '100%' }}
			>
				<GlobalStylesPanelDescription>
					{__(
						'Create and edit border radius scale presets used for rounded corners.',
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
