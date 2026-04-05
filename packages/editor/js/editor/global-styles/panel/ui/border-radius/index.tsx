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
import { BorderRadiusPresetOpener } from './border-radius-preset-opener';
import {
	BorderRadiusSize,
	type BorderRadiusDefaultPresetValue,
} from './border-radius-size';
import { NavItemBackButton } from '../../../../navigation/nav-item-back-button';
import ConfirmResetFontSizesDialog from '../font-sizes/confirm-reset-font-sizes-dialog';
import { sanitizeRadiusSizes, type BorderRadiusSizePreset } from './utils';

export type { BorderRadiusDefaultPresetValue };

type BorderRadiusPresetGroup = {
	defaultPresetValue: BorderRadiusDefaultPresetValue;
};

type BorderRadiusPresetGroupProps = PresetGroupPropsType &
	BorderRadiusPresetGroup;

const borderRadiusPresetFieldsPropsResolver: PresetFieldsPropsResolver = (
	item,
	itemId,
	origin
) => ({
	origin,
	borderRadiusSize: item,
	presetId: itemId,
});

const BORDER_RADIUS_ADD_MODAL_CONFIG = {
	headerTitle: __('Add Border Radius', 'blockera'),
	description: __(
		'Name your new border radius preset. The ID will be generated from the name and used in your styles.',
		'blockera'
	),
	duplicateSlugMessage: __(
		'This ID is already used by another border radius preset.',
		'blockera'
	),
	controlNamePrefix: 'add-border-radius',
};

function BorderRadiusPresetGroupComponent(props: BorderRadiusPresetGroupProps) {
	return <PresetGroup {...props} />;
}

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
	const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

	const toggleResetDialog = () => setIsResetDialogOpen(!isResetDialogOpen);

	const resetDialogText =
		origin === 'custom'
			? __(
					'Are you sure you want to remove all custom border radius presets?',
					'blockera'
				)
			: __(
					'Are you sure you want to reset all border radius presets to their default values?',
					'blockera'
				);

	const index = useMemo(
		() => getNewIndexFromPresets(sizes, 'custom-'),
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
			<BorderRadiusPresetGroupComponent
				repeaterItemHeader={BorderRadiusPresetOpener}
				onChange={handleChange}
				controlName={controlName}
				defaultPresetValue={defaultPresetValue}
				origin={origin}
				variables={sizes}
				PresetFields={BorderRadiusSize}
				title={__('Border radius', 'blockera')}
				label={sprintf(
					/* translators: %s: Origin name (Theme, Default, or Custom) */
					__('%s Variables', 'blockera'),
					pascalCase(origin)
				)}
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
				<Flex
					direction="column"
					gap="8px"
					style={{ padding: '12px 16px', width: '100%' }}
				>
					<p className="global-styles-ui-header__description">
						{__(
							'Create and edit border radius presets used in the editor (theme.json border.radiusSizes).',
							'blockera'
						)}
					</p>
				</Flex>

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
