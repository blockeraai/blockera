// @flow

/**
 * Internal dependencies
 */
import type { StylesProps } from '../../types';
import { isActiveField } from '../../../api/utils';
import type { CssRule } from '../../../../style-engine/types';
import {
	computedCssDeclarations,
	getCompatibleBlockCssSelector,
} from '../../../../style-engine';
import {
	getBlockSupportCategory,
	getBlockSupportFallback,
} from '../../../utils';

const supports = getBlockSupportCategory('state');

export const BlockStatesStyles = ({
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
		blockeraBlockStates: currentBlockAttributes.blockeraBlockStates,
		state,
		clientId,
		blockName,
		masterState,
		activeDeviceType,
		blockSelectors,
		className: currentBlockAttributes?.className,
	});

	// Check if we have cached result
	if (BlockStatesStyles.cache?.[cacheKey]) {
		return BlockStatesStyles.cache[cacheKey];
	}

	const { contentField } = config.statesConfig;
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
		isActiveField(contentField) &&
		null !== blockProps.attributes.blockeraBlockStates[state]?.content &&
		undefined !== blockProps.attributes.blockeraBlockStates[state]?.content
	) {
		if (
			!supports?.blockeraContentPseudoElement?.hasDefaultValueInStates.includes(
				state
			) &&
			'' === blockProps.attributes.blockeraBlockStates[state].content
		) {
			return styleGroup;
		}

		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockera/states/before',
			support: 'blockera/states/before',
			fallbackSupportId: getBlockSupportFallback(
				supports,
				'blockera/states/before'
			),
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					content: [
						{
							type: 'static',
							properties: {
								content: `"${blockProps.attributes.blockeraBlockStates[state]?.content}"`,
							},
						},
					],
				},
				blockProps,
				pickedSelector
			),
		});
	}

	// Cache the result
	if (!BlockStatesStyles.cache) {
		BlockStatesStyles.cache = {};
	}
	BlockStatesStyles.cache[cacheKey] = styleGroup;

	return styleGroup;
};
