// @flow

/**
 * Blockera dependencies
 */
import { isEquals } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { arrayEquals } from '../utils';
import { isActiveField } from '../../api/utils';
import {
	OutlineGenerator,
	BoxShadowGenerator,
	BoxBorderGenerator,
	BorderRadiusGenerator,
} from './css-generators';
import type { StylesProps } from '../types';
import type { CssRule } from '../../../style-engine/types';
import {
	computedCssDeclarations,
	getCompatibleBlockCssSelector,
} from '../../../style-engine';
import { getBlockSupportCategory, getBlockSupportFallback } from '../../utils';

const supports = getBlockSupportCategory('border');

export const BorderAndShadowStyles = ({
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
		blockeraBorder: currentBlockAttributes.blockeraBorder,
		blockeraOutline: currentBlockAttributes.blockeraOutline,
		blockeraBoxShadow: currentBlockAttributes.blockeraBoxShadow,
		blockeraBorderRadius: currentBlockAttributes.blockeraBorderRadius,
		state,
		clientId,
		blockName,
		masterState,
		activeDeviceType,
		blockSelectors,
		className: currentBlockAttributes?.className,
	});

	// Check if we have cached result
	if ((BorderAndShadowStyles: any).cache?.[cacheKey]) {
		return (BorderAndShadowStyles: any).cache[cacheKey];
	}

	const {
		blockeraBorder,
		blockeraOutline,
		blockeraBoxShadow,
		blockeraBorderRadius,
	} = config.borderAndShadowConfig;

	const blockProps = {
		state,
		clientId,
		supports,
		blockName,
		attributes: currentBlockAttributes,
		blockeraStyleEngineConfig: blockSupports?.blockeraStyleEngineConfig,
		currentBlock,
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
		isActiveField(blockeraBoxShadow) &&
		!arrayEquals(
			attributes.blockeraBoxShadow.default,
			blockProps.attributes.blockeraBoxShadow
		)
	) {
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraBoxShadow',
			support: 'blockeraBoxShadow',
			fallbackSupportId: getBlockSupportFallback(
				getBlockSupportCategory('boxShadow'),
				'blockeraBoxShadow'
			),
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraBoxShadow: [
						{
							type: 'function',
							function: BoxShadowGenerator,
						},
					],
				},
				blockProps,
				pickedSelector
			),
		});
	}

	if (isActiveField(blockeraOutline)) {
		const blockeraOutline = blockProps.attributes.blockeraOutline;

		if (blockeraOutline !== attributes.blockeraOutline.default) {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraOutline',
				support: 'blockeraOutline',
				fallbackSupportId: getBlockSupportFallback(
					getBlockSupportCategory('outline'),
					'blockeraOutline'
				),
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraOutline: [
							{
								type: 'function',
								function: OutlineGenerator,
							},
						],
					},
					blockProps,
					pickedSelector
				),
			});
		}
	}

	if (isActiveField(blockeraBorder)) {
		const blockeraBorder = blockProps.attributes.blockeraBorder;

		if (blockeraBorder !== attributes.blockeraBorder.default) {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraBorder',
				support: 'blockeraBorder',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraBorder'
				),
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraBorder: [
							{
								type: 'function',
								function: BoxBorderGenerator,
							},
						],
					},
					blockProps,
					pickedSelector
				),
			});
		}
	}

	if (isActiveField(blockeraBorderRadius)) {
		const blockeraBorderRadius = blockProps.attributes.blockeraBorderRadius;

		if (
			!isEquals(
				blockeraBorderRadius,
				attributes.blockeraBorderRadius.default
			)
		) {
			const pickedSelector = getCompatibleBlockCssSelector({
				...sharedParams,
				query: 'blockeraBorderRadius',
				support: 'blockeraBorderRadius',
				fallbackSupportId: getBlockSupportFallback(
					supports,
					'blockeraBorderRadius'
				),
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraBorderRadius: [
							{
								type: 'function',
								function: BorderRadiusGenerator,
							},
						],
					},
					blockProps,
					pickedSelector
				),
			});
		}
	}

	// Cache the result
	if (!(BorderAndShadowStyles: any).cache) {
		(BorderAndShadowStyles: any).cache = {};
	}
	(BorderAndShadowStyles: any).cache[cacheKey] = styleGroup;

	return styleGroup;
};
