/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback, memo, useContext } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	ColorControl,
	ControlContextProvider,
	useControlContext,
	RepeaterContext,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import {
	SharedPresetControls,
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

	const colorValueControls = (
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
				columns="1fr 3fr"
				onChange={handleValueChange}
			/>
		</ControlContextProvider>
	);

	return (
		<SharedPresetControls
			itemId={presetId}
			variable={colorItem}
			name={colorItem.name}
			slug={colorItem.slug}
			allSlugs={getAllColorSlugs(colors)}
		>
			{colorValueControls}
		</SharedPresetControls>
	);
}

export const ColorPresetFields = memo(ColorPresetFieldsComponent);
