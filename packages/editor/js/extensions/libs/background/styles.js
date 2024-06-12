// @flow
/**
 * Blockera dependencies
 */
import { getValueAddonRealValue } from '@blockera/value-addons';

/**
 * Internal dependencies
 */
import { arrayEquals } from '../utils';
import * as config from '../base/config';
import { attributes } from './attributes';
import type { StylesProps } from '../types';
import { isActiveField } from '../../api/utils';
import type { CssRule } from '../../../style-engine/types';
import { computedCssDeclarations, getCssSelector } from '../../../style-engine';
import { backgroundGenerator, backgroundClipGenerator } from './css-generators';

export const BackgroundStyles = ({
	state,
	clientId,
	blockName,
	currentBlock,
	// supports,
	// activeDeviceType,
	selectors: blockSelectors,
	attributes: currentBlockAttributes,
}: StylesProps): Array<CssRule> => {
	const {
		blockeraBackground,
		blockeraBackgroundColor,
		blockeraBackgroundClip,
	} = config.backgroundConfig;
	const blockProps = {
		clientId,
		blockName,
		attributes: currentBlockAttributes,
	};
	const sharedParams = {
		state,
		clientId,
		currentBlock,
		blockSelectors,
		className: currentBlockAttributes?.className,
	};
	const styleGroup: Array<CssRule> = [];

	if (
		isActiveField(blockeraBackground) &&
		!arrayEquals(
			attributes.blockeraBackground.default,
			blockProps.attributes.blockeraBackground
		)
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'blockeraBackground',
			support: 'blockeraBackground',
			fallbackSupportId: 'background',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraBackground: [
						{
							type: 'function',
							function: backgroundGenerator,
						},
					],
				},
				blockProps
			),
		});
	}

	if (isActiveField(blockeraBackgroundColor)) {
		const blockeraBackgroundColor = getValueAddonRealValue(
			blockProps.attributes.blockeraBackgroundColor
		);

		if (
			blockeraBackgroundColor !==
			attributes.blockeraBackgroundColor.default
		) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraBackgroundColor',
				support: 'blockeraBackgroundColor',
				fallbackSupportId: 'backgroundColor',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraBackgroundColor: [
							{
								type: 'static',
								properties: {
									'background-color': blockeraBackgroundColor,
								},
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (
		isActiveField(blockeraBackgroundClip) &&
		blockProps.attributes.blockeraBackgroundClip !==
			attributes.blockeraBackgroundClip.default
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'blockeraBackgroundClip',
			support: 'blockeraBackgroundClip',
			fallbackSupportId: 'backgroundClip',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraBackgroundClip: [
						{
							type: 'function',
							function: backgroundClipGenerator,
						},
					],
				},
				blockProps
			),
		});
	}

	return styleGroup;
};
