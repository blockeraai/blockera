/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalView as View,
	__experimentalSpacer as Spacer,
	__experimentalVStack as VStack,
	FlexItem,
} from '@wordpress/components';
import { useCallback, memo, useContext, useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	BorderRadiusControl,
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
import {
	parseRadiusSizeToControlValue,
	serializeControlValueToRadiusSize,
	type BorderRadiusControlValue,
} from './utils';

export type BorderRadiusDefaultPresetValue = {
	size: string;
	deletable: boolean;
	cloneable: boolean;
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

	const radiusControlValue = useMemo((): BorderRadiusControlValue => {
		const raw =
			typeof borderRadiusSize.size === 'number'
				? String(borderRadiusSize.size)
				: borderRadiusSize.size;
		return parseRadiusSizeToControlValue(raw);
	}, [borderRadiusSize.size]);

	const handleRadiusChange = useCallback(
		(newValue: BorderRadiusControlValue) => {
			updatePresetViaRepeater(
				'size',
				serializeControlValueToRadiusSize(newValue)
			);
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
				value: radiusControlValue,
				attribute: 'blockeraBorderRadiusSize',
				blockName: 'global-styles',
			}}
		>
			<BorderRadiusControl
				withoutValueAddons
				label={__('Radius', 'blockera')}
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
								'Stored in theme.json as border.radiusSizes (size field). Four values are saved as a CSS shorthand list.',
								'blockera'
							)}
						</p>
					</>
				}
				onChange={(newValue: BorderRadiusControlValue) =>
					handleRadiusChange(newValue)
				}
				defaultValue={radiusControlValue}
			/>
		</ControlContextProvider>
	);

	return (
		<VStack spacing={4}>
			<View>
				<Spacer paddingX={4} marginBottom={0} paddingBottom={6}>
					<VStack spacing={4}>
						<FlexItem>
							<BorderRadiusPresetPreview size={sizeForPreview} />
						</FlexItem>

						<SharedPresetControls
							itemId={presetId}
							variable={borderRadiusSize}
							name={borderRadiusSize.name}
							slug={borderRadiusSize.slug}
							allSlugs={getAllBorderRadiusSlugs(sizes)}
						>
							{borderRadiusValueControls}
						</SharedPresetControls>
					</VStack>
				</Spacer>
			</View>
		</VStack>
	);
}

export const BorderRadiusSize = memo(BorderRadiusSizeComponent);
