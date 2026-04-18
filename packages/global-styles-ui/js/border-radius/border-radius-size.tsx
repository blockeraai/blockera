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
	InputControl,
	RepeaterContext,
	useControlContext,
	ControlContextProvider,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import BorderRadiusPresetPreview from './border-radius-preset-preview';
import { SharedPresetControls } from '../components';
import { type VariableType } from '../components/types';
import { getAllVariableSlugs as getAllBorderRadiusSlugs } from '../components/utils';

export type BorderRadiusDefaultPresetValue = {
	size: string;
	deletable: boolean;
	cloneable: boolean;
	isVisible: boolean;
	visibilitySupport: boolean;
};

function BorderRadiusSizeComponent({
	origin,
	borderRadiusSize,
	presetId,
}: {
	origin: string | string[];
	presetId: string | number;
	borderRadiusSize: VariableType & BorderRadiusDefaultPresetValue;
}) {
	const { slug } = borderRadiusSize;

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
			| Record<
					string,
					Array<VariableType & BorderRadiusDefaultPresetValue>
			  >
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
				value: { ...borderRadiusSize, [key]: value },
			});
		},
		[
			changeRepeaterItem,
			onChange,
			valueCleanup,
			controlId,
			repeaterId,
			presetId,
			borderRadiusSize,
		]
	);

	const radiusInputValue =
		typeof borderRadiusSize.size === 'number'
			? String(borderRadiusSize.size)
			: borderRadiusSize.size;

	const handleRadiusChange = useCallback(
		(newValue: string | undefined) => {
			updatePresetViaRepeater('size', newValue ?? '');
		},
		[updatePresetViaRepeater]
	);

	if (!origin || !slug) {
		return null;
	}

	const sizeForPreview =
		typeof borderRadiusSize.size === 'number'
			? borderRadiusSize.size
			: (borderRadiusSize.size ?? '');

	const borderRadiusValueControls = (
		<ControlContextProvider
			value={{
				name: `border-radius-size-${slug}`,
				value: radiusInputValue,
				attribute: 'blockeraBorderRadiusSize',
				blockName: 'global-styles',
			}}
		>
			<InputControl
				label={__('Radius', 'blockera')}
				controlAddonTypes={[]}
				columns="1fr 3fr"
				min={0}
				unitType="essential"
				placeholder="0"
				labelDescription={
					<>
						<p>
							{__(
								'Sets the border radius preset value used in border controls across the site.',
								'blockera'
							)}
						</p>
						<p>
							{__(
								'Stored in theme.json as border.radiusSizes (size field). Use lengths such as px, rem, %, or fluid values like clamp().',
								'blockera'
							)}
						</p>
					</>
				}
				onChange={(newValue: string | undefined) =>
					handleRadiusChange(newValue)
				}
			/>
		</ControlContextProvider>
	);

	return (
		<Flex direction="column" gap="15px">
			<BorderRadiusPresetPreview size={sizeForPreview} />

			<SharedPresetControls
				itemId={presetId}
				variable={borderRadiusSize}
				name={borderRadiusSize.name}
				slug={borderRadiusSize.slug}
				allSlugs={getAllBorderRadiusSlugs(sizes)}
			>
				{borderRadiusValueControls}
			</SharedPresetControls>
		</Flex>
	);
}

export const BorderRadiusSize = memo(BorderRadiusSizeComponent);
