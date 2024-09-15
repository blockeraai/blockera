// @flow

/**
 * Internal dependencies
 */
import {
	SizeStyles,
	MouseStyles,
	LayoutStyles,
	SpacingStyles,
	EffectsStyles,
	PositionStyles,
	FlexChildStyles,
	BackgroundStyles,
	TypographyStyles,
	BorderAndShadowStyles,
} from '../../extensions';
import { useStoreSelectors } from '../../hooks';
import {
	isNormalState,
	prepareAttributesDefaultValues,
} from '../../extensions/components';
import type { CssRule } from '../types';
import type {
	TBreakpoint,
	TStates,
} from '../../extensions/libs/block-states/types';
import { appendBlockeraPrefix } from '../utils';
import type { InnerBlockType } from '../../extensions/libs/inner-blocks/types';
import { getBaseBreakpoint, isBaseBreakpoint } from '../../canvas-editor';

export const useComputedCssProps = ({
	states,
	selectors,
	blockName,
	currentBlock,
	currentBreakpoint,
	currentInnerBlockState,
	...params
}: Object): Array<CssRule> => {
	const {
		blocks: { getBlockType },
	} = useStoreSelectors();

	const stylesStack = [];

	states.forEach((state: TStates | string): void => {
		const calculatedProps = {
			...params,
			state,
			selectors,
			blockName,
		};

		// eslint-disable-next-line @wordpress/no-unused-vars-before-return,react-hooks/exhaustive-deps
		const defaultAttributes = prepareAttributesDefaultValues(
			getBlockType(blockName)?.attributes || {}
		);

		const appendStyles = (settings: Object): void => {
			stylesStack.push(
				[
					...SizeStyles(settings),
					...MouseStyles(settings),
					...LayoutStyles(settings),
					...SpacingStyles(settings),
					...EffectsStyles(settings),
					...PositionStyles(settings),
					...FlexChildStyles(settings),
					...TypographyStyles(settings),
					...BackgroundStyles(settings),
					// ...CustomStyleStyles(settings),
					...BorderAndShadowStyles(settings),
				].flat()
			);
		};
		const validateBlockStates = (state: Object): boolean => {
			return state?.isVisible && !!state?.breakpoints;
		};

		const generateCssStyleForInnerBlocksInPseudoStates = ({
			blockType,
			attributes,
			masterState,
		}: Object) => {
			for (const stateType in attributes?.blockeraBlockStates || {}) {
				const stateItem = attributes?.blockeraBlockStates[stateType];

				if (!validateBlockStates(stateItem)) {
					continue;
				}

				const breakpoints = stateItem.breakpoints;

				for (const breakpointType in breakpoints) {
					if (breakpointType !== currentBreakpoint) {
						continue;
					}

					const breakpointItem = breakpoints[breakpointType];

					if (!Object.keys(breakpointItem?.attributes || {}).length) {
						continue;
					}

					appendStyles({
						...calculatedProps,
						state: stateType,
						masterState,
						selectors:
							selectors[appendBlockeraPrefix(blockType)] || {},
						attributes: {
							...defaultAttributes,
							...breakpointItem?.attributes,
						},
						currentBlock: blockType,
						device: breakpointType,
					});
				}
			}
		};

		const generateCssStyleForInnerBlocks = (
			[blockType, { attributes }]: [InnerBlockType | string, Object],
			device: TBreakpoint | string,
			masterState: TStates | string
		): void => {
			// Assume attributes hasn't any values.
			if (!Object.keys(attributes).length) {
				return;
			}

			generateCssStyleForInnerBlocksInPseudoStates({
				blockType,
				attributes,
				masterState,
			});

			appendStyles({
				...calculatedProps,
				state: 'normal',
				masterState,
				selectors: selectors[appendBlockeraPrefix(blockType)] || {},
				attributes: {
					...defaultAttributes,
					...attributes,
				},
				currentBlock: blockType,
				device,
			});
		};

		// TODO: please implemented custom special pseudo-states for all blocks.
		if (['custom-class', 'parent-class', 'parent-hover'].includes(state)) {
			return;
		}

		if (isBaseBreakpoint(currentBreakpoint) && isNormalState(state)) {
			// 1- create css styles for master blocks with root attributes.
			appendStyles({
				...calculatedProps,
				state: 'normal',
				currentBlock: 'master',
				device: getBaseBreakpoint(),
			});

			// 2- create css styles for inner blocks inside master normal state on base breakpoint.
			Object.entries(params?.attributes?.blockeraInnerBlocks).forEach(
				(innerBlock: [InnerBlockType | string, Object]): void =>
					generateCssStyleForInnerBlocks(
						innerBlock,
						getBaseBreakpoint(),
						'normal'
					)
			);
		}

		// 3- validate saved block-states to creating css styles for all states of blocks.
		const states = params?.attributes?.blockeraBlockStates;
		const stateItem = states[state];

		if (validateBlockStates(stateItem)) {
			for (const breakpointType in stateItem?.breakpoints || {}) {
				if (breakpointType !== currentBreakpoint) {
					continue;
				}

				const breakpoint = stateItem?.breakpoints[breakpointType];

				if (!Object.keys(breakpoint?.attributes || {}).length) {
					continue;
				}

				appendStyles({
					...calculatedProps,
					attributes: {
						...defaultAttributes,
						...breakpoint?.attributes,
					},
					currentBlock: 'master',
					device: breakpointType,
				});

				// creating css styles for inner blocks inside master pseudo-states ...
				for (const innerBlockType in breakpoint?.attributes
					?.blockeraInnerBlocks || {}) {
					const innerBlock =
						breakpoint?.attributes?.blockeraInnerBlocks[
							innerBlockType
						];

					generateCssStyleForInnerBlocks(
						[innerBlockType, innerBlock],
						breakpointType,
						state
					);
				}
			}
		}
	});

	return stylesStack.flat();
};
