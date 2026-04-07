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
	InputControl,
	ControlContextProvider,
	useControlContext,
	RepeaterContext,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import {
	VariableNameEditor,
	getAllVariableSlugs as getAllColorSlugs,
} from '../components';
import { type VariableType } from '../components/types';

interface ColorPresetFieldsProps {
	origin: string | string[];
	presetId: string | number;
	colorItem: VariableType & { color?: string };
}

function ColorPresetFieldsComponent({
	origin,
	presetId,
	colorItem,
}: ColorPresetFieldsProps) {
	const { slug } = colorItem;

	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();
	const {
		onChange,
		repeaterId,
		valueCleanup,
		repeaterItems: colors,
	} = useContext(RepeaterContext) as {
		repeaterItems:
			| Record<string, Array<{ color?: string; type?: string }>>
			| undefined;
		onChange: (newValue: any) => void;
		valueCleanup: (value: any) => any;
		repeaterId: string | null | undefined;
		getControlId?: (itemId: string | number, key: string) => string;
	};

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
								allSlugs={getAllColorSlugs(colors)}
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
					</VStack>
				</Spacer>
			</View>
		</VStack>
	);
}

export const ColorPresetFields = memo(ColorPresetFieldsComponent);
