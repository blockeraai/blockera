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
		null !== blockProps.attributes?.blockeraBlockStates?.[state]?.content &&
		undefined !==
			blockProps.attributes?.blockeraBlockStates?.[state]?.content
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

		let content = blockProps.attributes.blockeraBlockStates[state]?.content;

		// Check if content includes CSS functions: attr(), counter(), counters(), url()
		const hasCssFunction =
			typeof content === 'string' &&
			(content.includes('attr(') ||
				content.includes('counter(') ||
				content.includes('counters(') ||
				content.includes('url('));

		if (hasCssFunction) {
			// Regex to match CSS functions, including nested ones like counter(attr(...))
			// This matches the outermost function and its entire content
			const cssFunctionRegex =
				/^['"]?(attr|counter|counters|url)\([^)]*(?:\([^)]*\))*[^)]*\)['"]?$/;

			if (cssFunctionRegex.test(content)) {
				// If it's only a CSS function (possibly nested) with or without quotes, remove quotes.
				content = content.replace(/^['"]?(.+?)['"]?$/, '$1');
			} else {
				// Replace each unquoted CSS function with "function(...)"
				// This regex handles nested functions by matching balanced parentheses
				content = content.replace(
					/(attr|counter|counters|url)\((?:[^()]+|\([^()]*\))*\)/g,
					(match) => {
						// Already quoted?
						if (/^".*"$/.test(match)) {
							return match;
						}

						return `"${match}"`;
					}
				);

				content = `"${content}"`;
			}
		} else {
			content = `"${content}"`;
		}

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					content: [
						{
							type: 'static',
							properties: {
								content,
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
