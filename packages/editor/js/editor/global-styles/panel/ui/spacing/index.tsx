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
import { SpacingPresetOpener } from './spacing-preset-opener';
import { SpacingSize, type SpacingDefaultPresetValue } from './spacing-size';
import { NavItemBackButton } from '../../../../navigation/nav-item-back-button';
import ConfirmResetFontSizesDialog from '../font-sizes/confirm-reset-font-sizes-dialog';

export type { SpacingDefaultPresetValue };

type SpacingSizePreset = {
	slug: string;
	name: string;
	size: string;
};

type SpacingPresetGroup = {
	defaultPresetValue: SpacingDefaultPresetValue;
};

type SpacingPresetGroupProps = PresetGroupPropsType & SpacingPresetGroup;

const spacingPresetFieldsPropsResolver: PresetFieldsPropsResolver = (
	item,
	itemId,
	origin
) => ({
	origin,
	spacingSize: item,
	presetId: itemId,
});

const SPACING_ADD_MODAL_CONFIG = {
	headerTitle: __('Add Spacing Size', 'blockera'),
	description: __(
		'Name your new spacing size preset. The ID will be generated from the name and used in your styles.',
		'blockera'
	),
	duplicateSlugMessage: __(
		'This ID is already used by another spacing size preset.',
		'blockera'
	),
	controlNamePrefix: 'add-spacing-size',
};

function SpacingSizePresetGroup(props: SpacingPresetGroupProps) {
	return <PresetGroup {...props} />;
}

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
	const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

	const toggleResetDialog = () => setIsResetDialogOpen(!isResetDialogOpen);

	const resetDialogText =
		origin === 'custom'
			? __(
					'Are you sure you want to remove all custom spacing size presets?',
					'blockera'
				)
			: __(
					'Are you sure you want to reset all spacing size presets to their default values?',
					'blockera'
				);

	const index = useMemo(
		() => getNewIndexFromPresets(sizes, 'custom-'),
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
				<ConfirmResetFontSizesDialog
					text={resetDialogText}
					confirmButtonText={
						origin === 'custom'
							? __('Remove', 'blockera')
							: __('Reset', 'blockera')
					}
					isOpen={isResetDialogOpen}
					toggleOpen={toggleResetDialog}
					onConfirm={handleResetSpacingSizes}
				/>
			)}
			<SpacingSizePresetGroup
				repeaterItemHeader={SpacingPresetOpener}
				onChange={handleChange}
				controlName={controlName}
				defaultPresetValue={defaultPresetValue}
				origin={origin}
				variables={sizes}
				PresetFields={SpacingSize}
				title={__('Spacing Size', 'blockera')}
				label={sprintf(
					/* translators: %s: Origin name (Theme, Default, or Custom) */
					__('%s Variables', 'blockera'),
					pascalCase(origin)
				)}
				addVariableModalConfig={SPACING_ADD_MODAL_CONFIG}
				presetFieldsPropsResolver={spacingPresetFieldsPropsResolver}
			/>
		</>
	);
}

const SpacingSizeGroup = memo(SpacingSizeGroupComponent);

function SpacingPresetContent() {
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

	return (
		<Flex direction="column" gap="32px" style={{ width: '100%' }}>
			{!!themeSpacingSizes?.length && (
				<SpacingSizeGroup
					origin="theme"
					label={__('Theme', 'blockera')}
					sizes={themeSpacingSizes}
					handleUpdateSizes={handleUpdateThemeSizes}
					handleResetSpacingSizes={themeResetHandler}
				/>
			)}

			{defaultSpacingSizesEnabled && !!defaultSpacingSizes?.length && (
				<SpacingSizeGroup
					origin="default"
					label={__('Default', 'blockera')}
					sizes={defaultSpacingSizes}
					handleUpdateSizes={handleUpdateDefaultSizes}
					handleResetSpacingSizes={defaultResetHandler}
				/>
			)}

			<SpacingSizeGroup
				origin="custom"
				label={__('Custom', 'blockera')}
				sizes={customSpacingSizes}
				handleUpdateSizes={handleUpdateCustomSizes}
				handleResetSpacingSizes={customResetHandler}
			/>
		</Flex>
	);
}

export function Spacing({
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
				'blockera-spacing-presets-navigation'
			)}
		>
			<NavItemBackButton
				backLabel={backLabel}
				closeCallback={closeCallback}
			/>
			<Flex
				direction="column"
				gap="8px"
				className="blockera-spacing-presets"
				style={{ width: '100%' }}
			>
				<Flex
					direction="column"
					gap="8px"
					style={{ padding: '12px 16px', width: '100%' }}
				>
					<p className="global-styles-ui-header__description">
						{__(
							'Create and edit spacing scale presets used for margin, padding, and gap (theme.json spacing.spacingSizes).',
							'blockera'
						)}
					</p>
				</Flex>

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
