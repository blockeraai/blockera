/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import {
	Navigator,
	__experimentalView as View,
	__experimentalVStack as VStack,
	__experimentalSpacer as Spacer,
} from '@wordpress/components';
import { createPortal, useState, useCallback } from '@wordpress/element';
import type { FontSize as FontSizeType } from '@wordpress/global-styles-engine';

/**
 * Blockera dependencies
 */
import { pascalCase } from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	PresetGroup,
	ScreenHeader,
	getNewIndexFromPresets,
	type PresetGroupPropsType,
} from '../components';
import { FontSize } from './font-size';
import FontSizesScreen from './font-sizes-screen';
import { useGlobalSetting } from '../../context/hooks';
import { type VariableType } from '../components/types';
import { FontSizePresetOpener } from './font-size-preset-opener';
import { NavItemScreen } from '../../../../navigation/nav-item-screen';
import ConfirmResetFontSizesDialog from './confirm-reset-font-sizes-dialog';

interface FontSizeGroupProps {
	label: string;
	origin: string;
	sizes: FontSizeType[];
	handleResetFontSizes?: () => void;
	handleUpdateSizes?: (newValue: Object) => void;
}

export type DefaultPresetValue = {
	size: string;
	deletable: boolean;
	cloneable: boolean;
	visibilitySupport: boolean;
	fluid: boolean | { min: string; max: string };
};

type FontSizePresetGroup = {
	defaultPresetValue: DefaultPresetValue;
};

type FontSizePresetGroupProps = PresetGroupPropsType & FontSizePresetGroup;

function FontSizeGroup({
	sizes,
	origin,
	handleUpdateSizes,
	handleResetFontSizes,
}: FontSizeGroupProps) {
	const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

	const toggleResetDialog = () => setIsResetDialogOpen(!isResetDialogOpen);

	const resetDialogText =
		origin === 'custom'
			? __(
					'Are you sure you want to remove all custom font size presets?',
					'blockera'
				)
			: __(
					'Are you sure you want to reset all font size presets to their default values?',
					'blockera'
				);

	const index = getNewIndexFromPresets(sizes, 'custom-');
	const defaultPresetValue: DefaultPresetValue & VariableType = {
		size: '16px',
		fluid: false,
		slug: `font-size-${index}`,
		deletable: !!('custom' === origin),
		cloneable: !!('custom' === origin),
		visibilitySupport: !!('custom' === origin),
		/* translators: %d: font size index */
		name: sprintf(__('Font Size %d', 'blockera'), index) as string,
	};

	return (
		<>
			{handleResetFontSizes && isResetDialogOpen && (
				<ConfirmResetFontSizesDialog
					text={resetDialogText}
					confirmButtonText={
						origin === 'custom'
							? __('Remove', 'blockera')
							: __('Reset', 'blockera')
					}
					isOpen={isResetDialogOpen}
					toggleOpen={toggleResetDialog}
					onConfirm={handleResetFontSizes}
				/>
			)}
			<FontSizePresetGroup
				repeaterItemHeader={FontSizePresetOpener}
				onChange={(newValue: Object) => {
					if (!handleUpdateSizes) {
						return;
					}
					handleUpdateSizes(newValue);
				}}
				controlName="font-size-presets"
				defaultPresetValue={defaultPresetValue}
				origin={origin}
				variables={sizes}
				PresetFields={FontSize}
				title={__('Font Size', 'blockera')}
				label={sprintf(
					/* translators: %s: Origin name (Theme, Default, or Custom) */
					__('%s Variables', 'blockera'),
					pascalCase(origin)
				)}
			/>
		</>
	);
}

function FontSizePresetGroup(props: FontSizePresetGroupProps) {
	return <PresetGroup {...props} />;
}

function FontSizes({ screenSelector }: { screenSelector: string }) {
	const [themeFontSizes, setThemeFontSizes] = useGlobalSetting(
		'typography.fontSizes.theme'
	);

	const [baseThemeFontSizes] = useGlobalSetting(
		'typography.fontSizes.theme',
		'base'
	);
	const [defaultFontSizes, setDefaultFontSizes] = useGlobalSetting(
		'typography.fontSizes.default'
	);

	const [baseDefaultFontSizes] = useGlobalSetting(
		'typography.fontSizes.default',
		'base'
	);

	const [customFontSizes = [], setCustomFontSizes] = useGlobalSetting(
		'typography.fontSizes.custom'
	);

	const [defaultFontSizesEnabled] = useGlobalSetting(
		'typography.defaultFontSizes'
	);

	const convertRepeaterValueToArray = useCallback(
		(newValue: Object): FontSizeType[] =>
			Object.values(newValue).map((value) => ({
				slug: value.slug,
				name: value.name,
				size: value.size,
				fluid: value.fluid,
			})),
		[]
	);

	const handleUpdateCustomSizes = useCallback(
		(newValue: Object) => {
			setCustomFontSizes(convertRepeaterValueToArray(newValue));
		},
		[convertRepeaterValueToArray, setCustomFontSizes]
	);

	const handleUpdateThemeSizes = useCallback(
		(newValue: Object) => {
			setThemeFontSizes(convertRepeaterValueToArray(newValue));
		},
		[convertRepeaterValueToArray, setThemeFontSizes]
	);

	const handleUpdateDefaultSizes = useCallback(
		(newValue: Object) => {
			setDefaultFontSizes(convertRepeaterValueToArray(newValue));
		},
		[convertRepeaterValueToArray, setDefaultFontSizes]
	);

	const hasSameSizeValues = (
		arr1: FontSizeType[],
		arr2: FontSizeType[]
	): boolean =>
		arr1.map((item) => item.size).join('') ===
		arr2.map((item) => item.size).join('');

	return createPortal(
		<Navigator initialPath="/">
			<NavItemScreen path="/">
				<FontSizesScreen />
			</NavItemScreen>
			<NavItemScreen path="/typography/font-sizes">
				<VStack spacing={2} className="blockera-font-size-presets">
					<ScreenHeader
						onBack={() => {
							const parent = document.querySelector(
								'.blockera-font-size-presets-count-active'
							);
							if (parent && parent instanceof HTMLElement) {
								parent.classList.remove(
									'blockera-font-size-presets-count-active'
								);
								(
									parent.previousElementSibling as HTMLElement
								).style.removeProperty('display');
							}
						}}
						title={__('Font size presets', 'blockera')}
						description={__(
							'Create and edit the presets used for font sizes across the site.',
							'blockera'
						)}
					/>

					<View>
						<Spacer paddingX={4}>
							<VStack spacing={8}>
								{!!themeFontSizes?.length && (
									<FontSizeGroup
										origin="theme"
										label={__('Theme', 'blockera')}
										sizes={themeFontSizes}
										handleUpdateSizes={
											handleUpdateThemeSizes
										}
										handleResetFontSizes={
											hasSameSizeValues(
												themeFontSizes,
												baseThemeFontSizes
											)
												? undefined
												: () =>
														setThemeFontSizes(
															baseThemeFontSizes
														)
										}
									/>
								)}

								{defaultFontSizesEnabled &&
									!!defaultFontSizes?.length && (
										<FontSizeGroup
											origin="default"
											label={__('Default', 'blockera')}
											sizes={defaultFontSizes}
											handleUpdateSizes={
												handleUpdateDefaultSizes
											}
											handleResetFontSizes={
												hasSameSizeValues(
													defaultFontSizes,
													baseDefaultFontSizes
												)
													? undefined
													: () =>
															setDefaultFontSizes(
																baseDefaultFontSizes
															)
											}
										/>
									)}

								<FontSizeGroup
									origin="custom"
									label={__('Custom', 'blockera')}
									sizes={customFontSizes}
									handleUpdateSizes={handleUpdateCustomSizes}
									handleResetFontSizes={
										customFontSizes.length > 0
											? () => setCustomFontSizes([])
											: undefined
									}
								/>
							</VStack>
						</Spacer>
					</View>
				</VStack>
			</NavItemScreen>
		</Navigator>,
		document.querySelector(screenSelector)
	);
}

export default FontSizes;
