// @flow
/**
 * Blockera dependencies
 */
import { getValueAddonRealValue } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { arrayEquals } from '../utils';
import type { StylesProps } from '../types';
import { isActiveField } from '../../api/utils';
import type { CssRule } from '../../../style-engine/types';
import {
	computedCssDeclarations,
	getCompatibleBlockCssSelector,
} from '../../../style-engine';
import { backgroundGenerator, backgroundClipGenerator } from './css-generators';
import { getBlockSupportCategory, getBlockSupportFallback } from '../../utils';

const supports = getBlockSupportCategory('background');

export const BackgroundStyles = ({
	state,
	config,
	clientId,
	blockName,
	masterState,
	currentBlock,
	activeDeviceType,
	supports: blockSupports,
	selectors: blockSelectors,
	defaultAttributes: attributes,
	attributes: currentBlockAttributes,
	...props
}: StylesProps): Array<CssRule> => {
	// Create cache key from inputs that affect output
	const cacheKey = JSON.stringify({
		blockeraBackground: currentBlockAttributes.blockeraBackground,
		blockeraBackgroundColor: currentBlockAttributes.blockeraBackgroundColor,
		blockeraBackgroundClip: currentBlockAttributes.blockeraBackgroundClip,
		state,
		clientId,
		blockName,
		masterState,
		activeDeviceType,
		blockSelectors,
		className: currentBlockAttributes?.className,
	});

	// Check if we have cached result
	if ((BackgroundStyles: any).cache?.[cacheKey]) {
		return (BackgroundStyles: any).cache[cacheKey];
	}

	const {
		blockeraBackground,
		blockeraBackgroundColor,
		blockeraBackgroundClip,
	} = config.backgroundConfig;
	const blockProps = {
		state,
		clientId,
		blockName,
		currentBlock,
		attributes: currentBlockAttributes,
	};
	const sharedParams = {
		...props,
		state,
		clientId,
		blockName,
		masterState,
		currentBlock,
		blockSelectors,
		activeDeviceType,
		supports: blockSupports,
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
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraBackground',
			support: 'blockeraBackground',
			fallbackSupportId: getBlockSupportFallback(
				supports,
				'blockeraBackground'
			),
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
				blockProps,
				pickedSelector
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
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraBackgroundColor',
				support: 'blockeraBackgroundColor',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraBackgroundColor'
				),
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraBackgroundColor: [
							{
								type: 'static',
								properties: {
									'background-color':
										blockeraBackgroundColor + ' !important',
								},
							},
						],
					},
					blockProps,
					pickedSelector
				),
			});
		}
	}

	if (
		isActiveField(blockeraBackgroundClip) &&
		blockProps.attributes.blockeraBackgroundClip !==
			attributes.blockeraBackgroundClip.default
	) {
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraBackgroundClip',
			support: 'blockeraBackgroundClip',
			fallbackSupportId: getBlockSupportFallback(
				supports,
				'blockeraBackgroundClip'
			),
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
				blockProps,
				pickedSelector
			),
		});
	}

	// Cache the result
	if (!(BackgroundStyles: any).cache) {
		(BackgroundStyles: any).cache = {};
	}
	(BackgroundStyles: any).cache[cacheKey] = styleGroup;

	return styleGroup;
};
