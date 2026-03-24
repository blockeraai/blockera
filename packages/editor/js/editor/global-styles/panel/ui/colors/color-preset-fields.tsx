/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalView as View,
	__experimentalSpacer as Spacer,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { useCallback, memo, useContext } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	ColorControl,
	GradientBarControl,
	ToggleSelectControl,
	InputControl,
	ControlContextProvider,
	useControlContext,
	RepeaterContext,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import {
	VariableNameEditor,
	getAllVariableSlugs as getAllColorSlugs,
} from '../components';
import { type VariableType } from '../components/types';

interface ColorPresetFieldsProps {
	colors: (VariableType & { color?: string; type?: string })[];
	colorItem: VariableType & { color?: string; type?: string };
	origin: string | string[];
	presetId: string | number;
}

const COLOR_GRADIENT_TYPES = [
	{
		label: __('Color', 'blockera'),
		value: 'color',
		icon: <Icon icon="background-color" iconSize="18" />,
	},
	{
		label: __('Linear Gradient', 'blockera'),
		value: 'linear-gradient',
		icon: <Icon icon="background-linear-gradient" iconSize="18" />,
	},
	{
		label: __('Radial Gradient', 'blockera'),
		value: 'radial-gradient',
		icon: <Icon icon="background-radial-gradient" iconSize="18" />,
	},
];

function getColorType(
	value: string | undefined
): 'color' | 'linear-gradient' | 'radial-gradient' {
	if (!value) {
		return 'color';
	}
	if (value.startsWith('linear-gradient')) {
		return 'linear-gradient';
	}
	if (value.startsWith('radial-gradient')) {
		return 'radial-gradient';
	}
	return 'color';
}

function ColorPresetFieldsComponent({
	colors,
	colorItem,
	origin,
	presetId,
}: ColorPresetFieldsProps) {
	const { slug } = colorItem;
	const type =
		(colorItem.type as 'color' | 'linear-gradient' | 'radial-gradient') ||
		getColorType(colorItem.color) ||
		'color';

	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();
	const { onChange, repeaterId, valueCleanup, getControlId } = useContext(
		RepeaterContext
	) as {
		onChange: (newValue: any) => void;
		valueCleanup: (value: any) => any;
		repeaterId: string | null | undefined;
		getControlId?: (itemId: string | number, key: string) => string;
	};

	const controlIdFn = (itemId: string | number, key: string) =>
		getControlId
			? getControlId(itemId, key)
			: `${controlId}-${itemId}-${key}`;

	const updateColorViaRepeater = useCallback(
		(updates: Record<string, any>) => {
			changeRepeaterItem({
				onChange,
				valueCleanup,
				controlId,
				repeaterId,
				itemId: presetId,
				value: { ...colorItem, ...updates },
			});
		},
		[
			changeRepeaterItem,
			onChange,
			valueCleanup,
			controlId,
			repeaterId,
			presetId,
			colorItem,
		]
	);

	const handleTypeChange = useCallback(
		(newType: string) => {
			const t = newType as
				| 'color'
				| 'linear-gradient'
				| 'radial-gradient';
			let newValue = colorItem.color;
			if (t === 'color') {
				newValue = newValue?.match(/^#|^rgb|^rgba/)
					? newValue
					: '#000000';
			} else if (t === 'linear-gradient') {
				newValue =
					newValue && newValue.startsWith('linear-gradient')
						? newValue
						: 'linear-gradient(90deg,#009efa 10%,#e52e00 90%)';
			} else {
				newValue =
					newValue && newValue.startsWith('radial-gradient')
						? newValue
						: 'radial-gradient(rgb(0,159,251) 0%,rgb(229,46,0) 100%)';
			}
			updateColorViaRepeater({ type: t, color: newValue });
		},
		[updateColorViaRepeater, colorItem.color]
	);

	const handleValueChange = useCallback(
		(newValue: string | undefined) => {
			updateColorViaRepeater({ color: newValue });
		},
		[updateColorViaRepeater]
	);

	if (!origin || !slug) {
		return null;
	}

	return (
		<VStack spacing={4}>
			<View>
				<Spacer paddingX={4} marginBottom={0} paddingBottom={6}>
					<VStack spacing={4}>
						{'custom' === origin ? (
							<VariableNameEditor
								itemId={presetId}
								variable={colorItem}
								name={colorItem.name}
								slug={colorItem.slug}
								allSlugs={getAllColorSlugs(colors as any)}
							/>
						) : (
							<>
								<ControlContextProvider
									value={{
										name: `color-name-${slug}`,
										value: colorItem.name,
										attribute: 'blockeraColor',
										blockName: 'global-styles',
									}}
								>
									<InputControl
										label={__('Name:', 'blockera')}
										columns="1fr 3fr"
										disabled
									/>
								</ControlContextProvider>
								<ControlContextProvider
									value={{
										name: `color-slug-${slug}`,
										value: colorItem.slug,
										attribute: 'blockeraColor',
										blockName: 'global-styles',
									}}
								>
									<InputControl
										label={__('ID:', 'blockera')}
										columns="1fr 3fr"
										disabled
									/>
								</ControlContextProvider>
							</>
						)}

						{'custom' !== origin && (
							<ToggleSelectControl
								repeaterItem={presetId}
								singularId="type"
								id={controlIdFn(presetId, 'type')}
								defaultValue="color"
								label={__('Type', 'blockera')}
								labelPopoverTitle={__('Color Type', 'blockera')}
								labelDescription={
									<p>
										{__(
											'Choose between solid color, linear gradient, or radial gradient.',
											'blockera'
										)}
									</p>
								}
								columns="columns-2"
								options={COLOR_GRADIENT_TYPES}
								onChange={handleTypeChange}
							/>
						)}

						{('custom' === origin || type === 'color') && (
							<ControlContextProvider
								value={{
									name: `color-value-${slug}`,
									value: colorItem.color,
									attribute: 'blockeraColor',
									blockName: 'global-styles',
								}}
							>
								<ColorControl
									label={__('Color', 'blockera')}
									field="color"
									columns="columns-2"
									onChange={handleValueChange}
								/>
							</ControlContextProvider>
						)}

						{'custom' !== origin &&
							(type === 'linear-gradient' ||
								type === 'radial-gradient') && (
								<ControlContextProvider
									value={{
										name: `color-gradient-${slug}`,
										value: colorItem.color,
										attribute: 'blockeraColor',
										blockName: 'global-styles',
									}}
								>
									<GradientBarControl
										label={
											type === 'linear-gradient'
												? __(
														'Linear Gradient',
														'blockera'
													)
												: __(
														'Radial Gradient',
														'blockera'
													)
										}
										field="gradient-bar"
										height={40}
										columns="columns-2"
										onChange={handleValueChange}
									/>
								</ControlContextProvider>
							)}
					</VStack>
				</Spacer>
			</View>
		</VStack>
	);
}

export const ColorPresetFields = memo(ColorPresetFieldsComponent);
