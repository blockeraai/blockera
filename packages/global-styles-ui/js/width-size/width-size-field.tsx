/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useCallback, useContext } from '@wordpress/element';

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
import { SharedPresetControls, useCanEditGlobalStyles } from '../components';
import { type VariableType } from '../components/types';
import { getAllVariableSlugs as getAllWidthSizeSlugs } from '../components/utils';

export type WidthSizeDefaultPresetValue = {
	size: string;
	isVisible: boolean;
	deletable: boolean;
	cloneable: boolean;
	visibilitySupport: boolean;
};

function WidthSizeFieldComponent({
	origin,
	widthSize,
	presetId,
}: {
	origin: string | string[];
	presetId: string | number;
	widthSize: VariableType & WidthSizeDefaultPresetValue;
}) {
	const { slug } = widthSize;
	const canEditGlobalStyles = useCanEditGlobalStyles();

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
		onChange: (newValue: unknown) => void;
		valueCleanup: (value: unknown) => unknown;
		repeaterId: string | null | undefined;
		repeaterItems:
			| Record<string, VariableType & WidthSizeDefaultPresetValue>
			| undefined;
	};

	const updateWidthSizeViaRepeater = useCallback(
		(key: string, value: unknown) => {
			changeRepeaterItem({
				onChange,
				valueCleanup,
				controlId,
				repeaterId,
				itemId: presetId,
				value: { ...widthSize, [key]: value },
			});
		},
		[
			changeRepeaterItem,
			onChange,
			valueCleanup,
			controlId,
			repeaterId,
			presetId,
			widthSize,
		]
	);

	const handleSizeChange = useCallback(
		(value: string | undefined) => {
			updateWidthSizeViaRepeater('size', value ?? '');
		},
		[updateWidthSizeViaRepeater]
	);

	if (!origin || !slug) {
		return null;
	}

	const widthSizeValueControls = (
		<ControlContextProvider
			value={{
				name: `width-size-${slug}`,
				value: widthSize.size,
				attribute: 'blockeraWidthSize',
				blockName: 'global-styles',
			}}
		>
			<InputControl
				data-test="width-size-input"
				label={__('Size', 'blockera')}
				readOnly={!canEditGlobalStyles}
				controlAddonTypes={[]}
				labelDescription={
					<>
						<p>
							{__(
								'Sets the width size preset value used for width and height controls across the site.',
								'blockera'
							)}
						</p>
						<p>
							{__(
								'Stored in theme.json as layout.widthSizes (size field). Use lengths such as px, rem, %, or clamp().',
								'blockera'
							)}
						</p>
					</>
				}
				columns="1fr 3fr"
				unitType="general"
				min={0}
				onChange={(newValue: string | undefined) =>
					handleSizeChange(newValue)
				}
			/>
		</ControlContextProvider>
	);

	return (
		<Flex direction="column" gap="15px">
			<SharedPresetControls
				itemId={presetId}
				variable={widthSize}
				name={widthSize.name}
				slug={widthSize.slug}
				allSlugs={getAllWidthSizeSlugs(sizes)}
			>
				{widthSizeValueControls}
			</SharedPresetControls>
		</Flex>
	);
}

export const WidthSizeField = memo(WidthSizeFieldComponent);
