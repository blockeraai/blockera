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

const supports = getBlockSupportCategory('pseudoElements');

export const BlockeraInnerBlocksStyles = ({
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
	const { contentField } = config.contentConfig;
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
		null !== blockProps.attributes?.blockeraContentPseudoElement &&
		undefined !== blockProps.attributes?.blockeraContentPseudoElement
	) {
		if (
			!supports?.blockeraContentPseudoElement?.allowedInners.includes(
				currentBlock
			) &&
			'' === blockProps.attributes?.blockeraContentPseudoElement
		) {
			return styleGroup;
		}

		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockera/elements/' + currentBlock,
			support: 'blockera/elements/' + currentBlock,
			fallbackSupportId: getBlockSupportFallback(
				supports,
				'blockera/elements/' + currentBlock
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
								content: `"${blockProps.attributes.blockeraContentPseudoElement}"`,
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
