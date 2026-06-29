/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback, memo, useContext } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	Flex,
	BorderControl,
	RepeaterContext,
	useControlContext,
	ControlContextProvider,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import BorderPresetPreview from './border-preset-preview';
import { SharedPresetControls } from '../components';
import { type VariableType } from '../components/types';
import { getAllVariableSlugs as getAllBorderPresetSlugs } from '../components/utils';
import type { BorderPresetStoredSide } from './utils';
import { coerceBorderPresetSide, getDefaultStoredBorderSide } from './utils';

export type BorderBoxDefaultPresetValue = VariableType & {
	border: BorderPresetStoredSide;
	deletable: boolean;
	cloneable: boolean;
	isVisible: boolean;
	visibilitySupport: boolean;
};

function BorderPresetSizeComponent({
	origin,
	borderPreset,
	presetId,
}: {
	origin: string | string[];
	presetId: string | number;
	borderPreset: BorderBoxDefaultPresetValue;
}) {
	const { slug } = borderPreset;

	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();
	const {
		onChange,
		repeaterId,
		valueCleanup,
		repeaterItems: presets,
	} = useContext(RepeaterContext) as {
		disableRegenerateId?: boolean;
		onChange: (newValue: any) => void;
		valueCleanup: (value: any) => any;
		repeaterId: string | null | undefined;
		repeaterItems:
			| Record<string, Array<BorderBoxDefaultPresetValue>>
			| undefined;
		itemIdGenerator?: (itemId: string | number) => string;
	};

	const updatePresetViaRepeater = useCallback(
		(key: string, value: any) => {
			changeRepeaterItem({
				onChange,
				valueCleanup,
				controlId,
				repeaterId,
				itemId: presetId,
				value: { ...borderPreset, [key]: value },
			});
		},
		[
			changeRepeaterItem,
			onChange,
			valueCleanup,
			controlId,
			repeaterId,
			presetId,
			borderPreset,
		]
	);

	const handleBorderChange = useCallback(
		(newValue: BorderPresetStoredSide) => {
			updatePresetViaRepeater('border', newValue);
		},
		[updatePresetViaRepeater]
	);

	if (!origin || !slug) {
		return null;
	}

	const borderControlValue = coerceBorderPresetSide(borderPreset.border);

	const borderPresetValueControls = (
		<ControlContextProvider
			value={{
				name: `border-preset-${slug}`,
				value: borderControlValue,
				attribute: 'blockeraBorderPreset',
				blockName: 'global-styles',
			}}
		>
			<BorderControl
				columns="1.2fr 3fr"
				controlAddonTypes={[]}
				variableTypes={[]}
				label={__('Border', 'blockera')}
				labelDescription={
					<>
						<p>
							{__(
								'Defines this named border preset for use across the site.',
								'blockera'
							)}
						</p>
					</>
				}
				onChange={handleBorderChange}
				defaultValue={getDefaultStoredBorderSide()}
				customMenuPosition="top"
			/>
		</ControlContextProvider>
	);

	return (
		<Flex direction="column" gap="15px">
			<BorderPresetPreview border={borderPreset.border} />

			<SharedPresetControls
				itemId={presetId}
				variable={borderPreset}
				name={borderPreset.name}
				slug={borderPreset.slug}
				allSlugs={getAllBorderPresetSlugs(presets)}
			>
				{borderPresetValueControls}
			</SharedPresetControls>
		</Flex>
	);
}

export const BorderPresetSize = memo(BorderPresetSizeComponent);
