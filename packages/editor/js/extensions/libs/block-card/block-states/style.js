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

const supports = getBlockSupportCategory('background');

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

	return styleGroup;
};
