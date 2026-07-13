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
import type { DefaultPresetValue } from '.';
import LineHeightPreview from './line-height-preview';
import { SharedPresetControls } from '../../components';
import { type VariableType } from '../../components/types';
import { getAllVariableSlugs as getAllLineHeightSlugs } from '../../components/utils';

function LineHeightComponent({
	origin,
	lineHeight,
	presetId,
}: {
	origin: string | string[];
	presetId: string | number;
	lineHeight: VariableType & DefaultPresetValue;
}) {
	const { slug } = lineHeight;

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
		onChange: (newValue: any) => void;
		valueCleanup: (value: any) => any;
		repeaterId: string | null | undefined;
		repeaterItems:
			| Record<string, Array<VariableType & DefaultPresetValue>>
			| undefined;
	};

	const updateLineHeightViaRepeater = useCallback(
		(key: string, value: any) => {
			changeRepeaterItem({
				onChange,
				valueCleanup,
				controlId,
				repeaterId,
				itemId: presetId,
				value: { ...lineHeight, [key]: value },
			});
		},
		[
			changeRepeaterItem,
			onChange,
			valueCleanup,
			controlId,
			repeaterId,
			presetId,
			lineHeight,
		]
	);

	const handleLineHeightChange = useCallback(
		(value: string | undefined) => {
			updateLineHeightViaRepeater('size', value);
		},
		[updateLineHeightViaRepeater]
	);

	if (!origin || !slug) {
		return null;
	}

	const lineHeightValueControls = (
		<ControlContextProvider
			value={{
				name: `line-height-size-${slug}`,
				value: lineHeight.size,
				attribute: 'blockeraLineHeight',
				blockName: 'global-styles',
			}}
		>
			<InputControl
				label={__('Line Height', 'blockera')}
				controlAddonTypes={[]}
				labelDescription={
					<>
						<p>
							{__(
								'It sets the height of a line box, crucial for determining the vertical spacing within text content, enhancing readability and text flow.',
								'blockera'
							)}
						</p>
						<p>
							{__(
								'Line height can be specified without a unit, as a multiplier of the font size (1.5), or with length units like pixels (px), ems (em).',
								'blockera'
							)}
						</p>
					</>
				}
				columns="1.2fr 3fr"
				unitType="line-height"
				min={0}
				onChange={(newValue: string | undefined) =>
					handleLineHeightChange(newValue)
				}
			/>
		</ControlContextProvider>
	);

	return (
		<Flex direction="column" gap={15}>
			<LineHeightPreview lineHeight={lineHeight} />

			<SharedPresetControls
				itemId={presetId}
				variable={lineHeight}
				name={lineHeight.name}
				slug={lineHeight.slug}
				allSlugs={getAllLineHeightSlugs(sizes)}
			>
				{lineHeightValueControls}
			</SharedPresetControls>
		</Flex>
	);
}

export const LineHeight = memo(LineHeightComponent);
