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
import { SpacingPresetOpener } from './spacing-preset-opener';
import { SpacingSize, type SpacingDefaultPresetValue } from './spacing-size';
import { NavItemBackButton } from '../navigation/nav-item-back-button';

export type { SpacingDefaultPresetValue };

type SpacingSizePreset = {
	slug: string;
	name: string;
	size: string;
};

const spacingPresetFieldsPropsResolver =
	createPresetFieldsPropsResolver('spacingSize');

function SpacingSizeGroupComponent({
	sizes,
	origin,
	handleUpdateSizes,
	handleResetSpacingSizes,
}: {
	label: string;
	origin: string;
	sizes: SpacingSizePreset[];
	handleUpdateSizes?: (newValue: Object) => void;
	handleResetSpacingSizes?: () => void;
}) {
	const { isResetDialogOpen, toggleResetDialog } =
		usePresetResetDialogState();

	const { dialogText: resetDialogText, confirmButtonText } =
		getOriginResetDialogCopy(origin, __('spacing size', 'blockera'));

	const index = useMemo(
		() => getNewIndexFromPresets(sizes, 'spacing-'),
		[sizes]
	);

	const defaultPresetValue = useMemo((): SpacingDefaultPresetValue &
		VariableType => {
		return {
			size: '20px',
			slug: `spacing-${index}`,
			deletable: !!('custom' === origin),
			cloneable: !!('custom' === origin),
			visibilitySupport: !!('custom' === origin),
			/* translators: %d: spacing preset index */
			name: sprintf(__('Spacing %d', 'blockera'), index) as string,
		};
	}, [origin, index]);

	const controlName = `spacing-size-presets-${origin}`;

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
			{handleResetSpacingSizes && isResetDialogOpen && (
				<ConfirmResetPresetDialog
					text={resetDialogText}
					confirmButtonText={confirmButtonText}
					isOpen={isResetDialogOpen}
					toggleOpen={toggleResetDialog}
					onConfirm={handleResetSpacingSizes}
				/>
			)}
			<PresetGroup
				repeaterItemHeader={SpacingPresetOpener}
				onChange={handleChange}
				controlName={controlName}
				defaultPresetValue={defaultPresetValue}
				origin={origin}
				variables={sizes}
				PresetFields={SpacingSize}
				title={__('Spacing Size', 'blockera')}
				label={getOriginVariablesLabel(origin)}
				presetFieldsPropsResolver={spacingPresetFieldsPropsResolver}
			/>
		</>
	);
}

const SpacingSizeGroup = memo(SpacingSizeGroupComponent);

export function SpacingPresetContent() {
	const [themeSpacingSizes, setThemeSpacingSizes] = useGlobalSetting(
		'spacing.spacingSizes.theme'
	);

	const [baseThemeSpacingSizes] = useGlobalSetting(
		'spacing.spacingSizes.theme',
		'',
		'base'
	);
	const [defaultSpacingSizes, setDefaultSpacingSizes] = useGlobalSetting(
		'spacing.spacingSizes.default'
	);

	const [baseDefaultSpacingSizes] = useGlobalSetting(
		'spacing.spacingSizes.default',
		'',
		'base'
	);

	const [customSpacingSizes = [], setCustomSpacingSizes] = useGlobalSetting(
		'spacing.spacingSizes.custom'
	);

	const [defaultSpacingSizesEnabled] = useGlobalSetting(
		'spacing.defaultSpacingSizes'
	);

	const convertRepeaterValueToArray = useCallback(
		(newValue: Object): SpacingSizePreset[] =>
			Object.values(
				newValue as Record<
					string,
					SpacingSizePreset & Record<string, unknown>
				>
			).map((value) => ({
				slug: value.slug,
				name: value.name,
				size: value.size,
			})),
		[]
	);

	const handleUpdateCustomSizes = useCallback(
		(newValue: Object) => {
			setCustomSpacingSizes(convertRepeaterValueToArray(newValue));
		},
		[convertRepeaterValueToArray, setCustomSpacingSizes]
	);

	const handleUpdateThemeSizes = useCallback(
		(newValue: Object) => {
			setThemeSpacingSizes(convertRepeaterValueToArray(newValue));
		},
		[convertRepeaterValueToArray, setThemeSpacingSizes]
	);

	const handleUpdateDefaultSizes = useCallback(
		(newValue: Object) => {
			setDefaultSpacingSizes(convertRepeaterValueToArray(newValue));
		},
		[convertRepeaterValueToArray, setDefaultSpacingSizes]
	);

	const resetThemeToBase = useCallback(() => {
		setThemeSpacingSizes(baseThemeSpacingSizes);
	}, [setThemeSpacingSizes, baseThemeSpacingSizes]);

	const resetDefaultToBase = useCallback(() => {
		setDefaultSpacingSizes(baseDefaultSpacingSizes);
	}, [setDefaultSpacingSizes, baseDefaultSpacingSizes]);

	const clearCustomSizes = useCallback(() => {
		setCustomSpacingSizes([]);
	}, [setCustomSpacingSizes]);

	const themeResetHandler = useMemo(() => {
		if (!themeSpacingSizes?.length) {
			return undefined;
		}
		const base = baseThemeSpacingSizes ?? [];
		if (isEquals(themeSpacingSizes, base)) {
			return undefined;
		}
		return resetThemeToBase;
	}, [themeSpacingSizes, baseThemeSpacingSizes, resetThemeToBase]);

	const defaultResetHandler = useMemo(() => {
		if (!defaultSpacingSizes?.length) {
			return undefined;
		}
		const base = baseDefaultSpacingSizes ?? [];
		if (isEquals(defaultSpacingSizes, base)) {
			return undefined;
		}
		return resetDefaultToBase;
	}, [defaultSpacingSizes, baseDefaultSpacingSizes, resetDefaultToBase]);

	const customResetHandler = useMemo(
		() => (customSpacingSizes.length > 0 ? clearCustomSizes : undefined),
		[customSpacingSizes.length, clearCustomSizes]
	);

	const themeSizes = (themeSpacingSizes ?? []) as SpacingSizePreset[];
	const defaultSizes = (defaultSpacingSizes ?? []) as SpacingSizePreset[];
	const showDefaultOriginGroup = shouldShowDefaultPresetGroup(
		!!defaultSpacingSizesEnabled,
		themeSizes.length,
		defaultSizes.length
	);
	const showThemeOriginGroup = shouldShowThemePresetGroup(
		!!defaultSpacingSizesEnabled,
		themeSizes.length,
		defaultSizes.length
	);

	return (
		<Flex direction="column" gap="32px" style={{ width: '100%' }}>
			{showThemeOriginGroup && (
				<SpacingSizeGroup
					origin="theme"
					label={__('Theme', 'blockera')}
					sizes={themeSizes}
					handleUpdateSizes={handleUpdateThemeSizes}
					handleResetSpacingSizes={themeResetHandler}
				/>
			)}

			{showDefaultOriginGroup && (
				<SpacingSizeGroup
					origin="default"
					label={__('Default', 'blockera')}
					sizes={defaultSizes}
					handleUpdateSizes={handleUpdateDefaultSizes}
					handleResetSpacingSizes={defaultResetHandler}
				/>
			)}

			<SpacingSizeGroup
				origin="custom"
				label={__('Custom', 'blockera')}
				sizes={customSpacingSizes as SpacingSizePreset[]}
				handleUpdateSizes={handleUpdateCustomSizes}
				handleResetSpacingSizes={customResetHandler}
			/>
		</Flex>
	);
}

export function Spacing({ closeCallback }: { closeCallback?: () => void }) {
	return (
		<div
			className={classNames(
				'blockera-navigation-panel',
				'blockera-spacing-presets-navigation'
			)}
		>
			<NavItemBackButton
				backLabel={__('Spacing Variables', 'blockera')}
				closeCallback={closeCallback}
			/>

			<Flex
				direction="column"
				gap="16px"
				className="blockera-spacing-presets"
				style={{ width: '100%', marginTop: '10px' }}
			>
				<GlobalStylesPanelDescription>
					{__(
						'Create and edit spacing variables used for margin, padding, and gap.',
						'blockera'
					)}
				</GlobalStylesPanelDescription>

				<Flex
					direction="column"
					style={{ padding: '0 16px', width: '100%' }}
				>
					<SpacingPresetContent />
				</Flex>
			</Flex>
		</div>
	);
}

export default Spacing;
