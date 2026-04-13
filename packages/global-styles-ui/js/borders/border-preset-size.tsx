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
	BoxBorderControl,
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
import type { BoxBorderValue } from './utils';
import { getDefaultBoxBorderValue } from './utils';

export type BorderBoxDefaultPresetValue = VariableType & {
	border: BoxBorderValue;
	deletable: boolean;
	cloneable: boolean;
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
		(newValue: Object) => {
			updatePresetViaRepeater('border', newValue);
		},
		[updatePresetViaRepeater]
	);

	if (!origin || !slug) {
		return null;
	}

	const borderValue =
		borderPreset.border && typeof borderPreset.border === 'object'
			? borderPreset.border
			: getDefaultBoxBorderValue();

	const borderPresetValueControls = (
		<ControlContextProvider
			value={{
				name: `border-preset-box-${slug}`,
				value: borderValue,
				attribute: 'blockeraBorderPreset',
				blockName: 'global-styles',
			}}
		>
			<BoxBorderControl
				columns="columns-1"
				withoutValueAddons
				showLinkedSidesToggle={false}
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
				onChange={(newValue: Object) => handleBorderChange(newValue)}
				defaultValue={getDefaultBoxBorderValue()}
			/>
		</ControlContextProvider>
	);

	return (
		<Flex direction="column" gap="15px">
			<BorderPresetPreview border={borderValue} />

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
