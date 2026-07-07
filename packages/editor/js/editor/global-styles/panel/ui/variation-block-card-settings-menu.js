// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useMemo, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { StyleItemBlockCardMenu } from './style-item-block-card-menu';
import { useBlockStylesPickerValue } from './use-block-styles-picker-value';
import { BlockStylesPickerContextProvider } from '../context';
import { PromoteGlobalStylesPremiumFeature } from './promote-global-styles-premium-feature';

export const VariationBlockCardSettingsMenu = ({
	blockName,
	pickerVariationSurface,
	currentBlockStyleVariation,
	variationsProps,
}: {
	blockName: string,
	pickerVariationSurface?: string,
	currentBlockStyleVariation?: Object,
	variationsProps: Object,
}): MixedElement | null => {
	const [isPromotionPopoverOpen, setIsPromotionPopoverOpen] = useState(false);

	const pickerValue = useBlockStylesPickerValue({
		blockName,
		context: 'global-styles-panel',
		pickerVariationSurface,
		styles: variationsProps.memoizedStyles,
		isNotActive: false,
		hasChangesets: variationsProps.hasChangesets,
		setChangesets: variationsProps.setChangesets,
		originDefaultAttributes: variationsProps.originDefaultAttributes,
		onPromotionBlocked: () => setIsPromotionPopoverOpen(true),
	});

	const style = useMemo(() => {
		const variationName = currentBlockStyleVariation?.name;

		if (!variationName) {
			return null;
		}

		const fromList = pickerValue.blockStyles.find(
			(item) => item.name === variationName
		);

		return fromList || currentBlockStyleVariation;
	}, [pickerValue.blockStyles, currentBlockStyleVariation]);

	if (!style) {
		return null;
	}

	return (
		<BlockStylesPickerContextProvider value={pickerValue}>
			<StyleItemBlockCardMenu style={style} />

			{isPromotionPopoverOpen && (
				<PromoteGlobalStylesPremiumFeature
					onClose={() => setIsPromotionPopoverOpen(false)}
					isOpen={isPromotionPopoverOpen}
					variationSurface={pickerValue.variationSurface}
				/>
			)}
		</BlockStylesPickerContextProvider>
	);
};
