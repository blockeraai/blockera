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
import { VariableNameEditor } from '../components';
import { type VariableType } from '../components/types';
import { getAllVariableSlugs as getAllBorderRadiusSlugs } from '../components/utils';

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

	const handleSizeChange = useCallback(
		(value: string | undefined) => {
			updatePresetViaRepeater('size', value);
		},
		[updatePresetViaRepeater]
	);

	if (!origin || !slug) {
		return null;
	}

	const sizeValue =
		typeof borderRadiusSize.size === 'number'
			? String(borderRadiusSize.size)
			: borderRadiusSize.size;

	return (
		<Flex
			direction="column"
			gap="16px"
			style={{ width: '100%', padding: '0 16px 24px' }}
		>
			{'custom' === origin && (
				<VariableNameEditor
					itemId={presetId}
					variable={borderRadiusSize}
					name={borderRadiusSize.name}
					slug={borderRadiusSize.slug}
					allSlugs={getAllBorderRadiusSlugs(sizes)}
				/>
			)}

			<ControlContextProvider
				value={{
					name: `border-radius-size-${slug}`,
					value: sizeValue,
					attribute: 'blockeraBorderRadiusSize',
					blockName: 'global-styles',
				}}
			>
				<InputControl
					label={__('Radius', 'blockera')}
					controlAddonTypes={[]}
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
									'You can use fixed lengths (px, rem), percentages, or fluid values such as clamp().',
									'blockera'
								)}
							</p>
						</>
					}
					columns="columns-2"
					unitType="general"
					min={0}
					onChange={(newValue: string | undefined) =>
						handleSizeChange(newValue)
					}
				/>
			</ControlContextProvider>
		</Flex>
	);
}

export const BorderRadiusSize = memo(BorderRadiusSizeComponent);
