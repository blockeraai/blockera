/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type {
	FluidTypographySettings,
	FluidTypographyConfig,
} from '@wordpress/global-styles-engine';
import { useCallback, memo, useContext } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	Flex,
	InputControl,
	ToggleControl,
	RepeaterContext,
	useControlContext,
	ControlContextProvider,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import type { DefaultPresetValue } from '.';
import FontSizePreview from './font-size-preview';
import { SharedPresetControls } from '../components';
import { useGlobalSetting } from '../context/global-style-hooks';
import { type VariableType } from '../components/types';
import { getAllVariableSlugs as getAllFontSizeSlugs } from '../components/utils';

function FontSizeComponent({
	origin,
	fontSize,
	presetId,
}: {
	origin: string | string[];
	presetId: string | number;
	fontSize: VariableType & DefaultPresetValue;
}) {
	const { slug } = fontSize;

	const [globalFluid] = useGlobalSetting<
		boolean | FluidTypographySettings | undefined
	>('typography.fluid');

	// Whether the font size is fluid. If not defined, use the global fluid value of the theme.
	const isFluid =
		fontSize?.fluid !== undefined ? !!fontSize.fluid : !!globalFluid;

	// Whether custom fluid values are used.
	const isCustomFluid = typeof fontSize?.fluid === 'object';

	// Use RepeaterContext and changeRepeaterItem for updates (single source of truth via repeater store).
	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();
	const {
		onChange,
		repeaterId,
		valueCleanup,
		repeaterItems: sizes,
	} = useContext(RepeaterContext) as {
		disableRegenerateId?: boolean;
		onChange: (newValue: any) => void;
		valueCleanup: (value: any) => any;
		repeaterId: string | null | undefined;
		repeaterItems:
			| Record<string, Array<VariableType & DefaultPresetValue>>
			| undefined;
		itemIdGenerator?: (itemId: string | number) => string;
	};

	const updateFontSizeViaRepeater = useCallback(
		(key: string, value: any) => {
			changeRepeaterItem({
				onChange,
				valueCleanup,
				controlId,
				repeaterId,
				itemId: presetId,
				value: { ...fontSize, [key]: value },
			});
		},
		[
			changeRepeaterItem,
			onChange,
			valueCleanup,
			controlId,
			repeaterId,
			presetId,
			fontSize,
		]
	);

	const handleFontSizeChange = useCallback(
		(value: string | undefined) => {
			updateFontSizeViaRepeater('size', value);
		},
		[updateFontSizeViaRepeater]
	);

	const handleFluidChange = useCallback(
		(value: boolean) => {
			updateFontSizeViaRepeater('fluid', value);
		},
		[updateFontSizeViaRepeater]
	);

	const handleCustomFluidValues = useCallback(
		(value: boolean) => {
			if (value) {
				updateFontSizeViaRepeater('fluid', {
					min: fontSize.size,
					max: fontSize.size,
				});
			} else {
				updateFontSizeViaRepeater('fluid', true);
			}
		},
		[updateFontSizeViaRepeater, fontSize.size]
	);

	const handleMinChange = useCallback(
		(value: string | undefined) => {
			const fluid: FluidTypographyConfig =
				typeof fontSize.fluid === 'object' ? fontSize.fluid : {};
			updateFontSizeViaRepeater('fluid', { ...fluid, min: value });
		},
		[updateFontSizeViaRepeater, fontSize.fluid]
	);

	const handleMaxChange = useCallback(
		(value: string | undefined) => {
			const fluid: FluidTypographyConfig =
				typeof fontSize.fluid === 'object' ? fontSize.fluid : {};
			updateFontSizeViaRepeater('fluid', { ...fluid, max: value });
		},
		[updateFontSizeViaRepeater, fontSize.fluid]
	);

	if (!origin || !slug) {
		return null;
	}

	const fontSizeValueControls = (
		<>
			<ControlContextProvider
				value={{
					name: `font-size-size-${slug}`,
					value: !isCustomFluid ? fontSize.size : undefined,
					attribute: 'blockeraFontSize',
					blockName: 'global-styles',
				}}
			>
				<InputControl
					label={__('Font Size', 'blockera')}
					controlAddonTypes={[]}
					labelDescription={
						<>
							<p>
								{__(
									'It sets the size of the font for text content, allowing customization of text appearance for readability and aesthetic appeal in various contexts.',
									'blockera'
								)}
							</p>
							<p>
								{__(
									'Relative units like "em" and "rem" are recommended for responsive designs as they adjust based on parent font size or root font size, respectively.',
									'blockera'
								)}
							</p>
						</>
					}
					columns="1fr 3fr"
					unitType="essential"
					min={0}
					onChange={(newValue: string | undefined) =>
						handleFontSizeChange(newValue)
					}
					disabled={isCustomFluid}
				>
					<ControlContextProvider
						value={{
							name: `font-size-is-fluid-${slug}`,
							value: isFluid,
							attribute: 'blockeraFontSizeIsFluid',
							blockName: 'global-styles',
						}}
					>
						<ToggleControl
							label={__('Fluid', 'blockera')}
							columns="2fr 2fr"
							onChange={handleFluidChange}
						/>
					</ControlContextProvider>

					{isFluid && (
						<ControlContextProvider
							value={{
								name: `font-size-${slug}-custom-fluid`,
								value: isCustomFluid,
								attribute: 'blockeraFontSizeCustomFluid',
								blockName: 'global-styles',
							}}
						>
							<ToggleControl
								label={__('Custom Fluid', 'blockera')}
								columns="2fr 2fr"
								onChange={handleCustomFluidValues}
							/>
						</ControlContextProvider>
					)}

					{isCustomFluid && (
						<>
							<ControlContextProvider
								value={{
									name: `font-size-min-${slug}`,
									value:
										typeof fontSize?.fluid === 'object'
											? fontSize.fluid?.min
											: undefined,
									attribute: 'blockeraFontSize',
									blockName: 'global-styles',
								}}
							>
								<InputControl
									label={__('Min Size', 'blockera')}
									columns="2fr 2fr"
									controlAddonTypes={[]}
									unitType="essential"
									min={0}
									onChange={(newValue: string | undefined) =>
										handleMinChange(newValue)
									}
									style={{ margin: '0px' }}
								/>
							</ControlContextProvider>

							<ControlContextProvider
								value={{
									name: `font-size-max-${slug}`,
									value:
										typeof fontSize?.fluid === 'object'
											? fontSize.fluid?.max
											: undefined,
									attribute: 'blockeraFontSize',
									blockName: 'global-styles',
								}}
							>
								<InputControl
									label={__('Max Size', 'blockera')}
									columns="2fr 2fr"
									unitType="essential"
									min={0}
									onChange={(newValue: string | undefined) =>
										handleMaxChange(newValue)
									}
									controlAddonTypes={[]}
									style={{ margin: '0px' }}
								/>
							</ControlContextProvider>
						</>
					)}
				</InputControl>
			</ControlContextProvider>
		</>
	);

	return (
		<Flex direction="column" gap={15}>
			<FontSizePreview fontSize={fontSize} />

			<SharedPresetControls
				itemId={presetId}
				variable={fontSize}
				name={fontSize.name}
				slug={fontSize.slug}
				allSlugs={getAllFontSizeSlugs(sizes)}
			>
				{fontSizeValueControls}
			</SharedPresetControls>
		</Flex>
	);
}

export const FontSize = memo(FontSizeComponent);
