// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';

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
	BlockStatesStyles,
	BorderAndShadowStyles,
} from '../extensions';
import {
	isNormalState,
	prepareBlockeraDefaultAttributesValues,
} from '../extensions/components';
import type { CssRule } from './types';
import type {
	TBreakpoint,
	TStates,
} from '../extensions/libs/block-card/block-states/types';
import { appendBlockeraPrefix } from './utils';
import type { InnerBlockType } from '../extensions/libs/block-card/inner-blocks/types';
import { getBaseBreakpoint, isBaseBreakpoint } from '../canvas-editor';

const appendStyles = ({
	settings,
	disabledStyles,
}: {
	settings: Object,
	disabledStyles: Array<string>,
}): Array<CssRule> => {
	// Extendable style generators by other developers.
	const styleGenerators = applyFilters(
		'blockera.editor.styleEngine.generators',
		{
			SizeStyles,
			MouseStyles,
			LayoutStyles,
			SpacingStyles,
			EffectsStyles,
			PositionStyles,
			FlexChildStyles,
			TypographyStyles,
			BackgroundStyles,
			BlockStatesStyles,
			BorderAndShadowStyles,
		}
	);

	const enabledStyles = Object.entries(styleGenerators)
		.filter(([name]) => !disabledStyles?.includes(name))
		.map(([, generator]: [any, Function]) => generator(settings));

	return enabledStyles.flat();
};

export const getComputedCssProps = ({
	states,
	selectors,
	blockName,
	currentBlock,
	disabledStyles = [],
	currentBreakpoint,
	currentInnerBlockState,
	...params
}: Object): Array<CssRule> => {
	const stylesStack = [];
	const { getState, getInnerState } = select('blockera/editor');
	const defaultAttributes = prepareBlockeraDefaultAttributesValues(
		params.defaultAttributes
	);

	states.forEach((state: TStates | string): void => {
		const calculatedProps = {
			...params,
			state,
			selectors,
			blockName,
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

				const {
					settings: { hasContent },
				} = getState(stateType) ||
					getInnerState(stateType) || {
						settings: { hasContent: false },
					};

				let currentStateHasSelectors = false;
				let calculatedSelectors =
					selectors[appendBlockeraPrefix(blockType)] || {};

				if (
					!isNormalState(stateType) &&
					selectors[appendBlockeraPrefix(`states/${stateType}`)]
				) {
					calculatedSelectors =
						selectors[appendBlockeraPrefix(`states/${stateType}`)];
					currentStateHasSelectors = true;
				}

				if (
					hasContent &&
					!Object.keys(breakpoints || {})?.length &&
					isBaseBreakpoint(currentBreakpoint)
				) {
					stylesStack.push(
						appendStyles({
							settings: {
								...calculatedProps,
								state: stateType,
								currentBlock: blockType,
								masterState,
								currentStateHasSelectors,
								selectors: calculatedSelectors,
								attributes: {
									...defaultAttributes,
									blockeraBlockStates: {
										[stateType]: {
											content: stateItem?.content || '',
										},
									},
								},
							},
							disabledStyles,
						})
					);
				}

				for (const breakpointType in breakpoints) {
					if (breakpointType !== currentBreakpoint) {
						continue;
					}

					const breakpointItem = breakpoints[breakpointType];

					if (!Object.keys(breakpointItem?.attributes || {}).length) {
						continue;
					}

					stylesStack.push(
						appendStyles({
							settings: {
								...calculatedProps,
								state: stateType,
								masterState,
								currentStateHasSelectors,
								selectors: calculatedSelectors,
								attributes: {
									...defaultAttributes,
									...breakpointItem?.attributes,
									...(hasContent
										? {
												blockeraBlockStates: {
													[stateType]: {
														content:
															stateItem?.content ||
															'',
													},
												},
										  }
										: {}),
								},
								currentBlock: blockType,
								device: breakpointType,
							},
							disabledStyles,
						})
					);
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

			stylesStack.push(
				appendStyles({
					settings: {
						...calculatedProps,
						state: 'normal',
						masterState,
						selectors:
							selectors[appendBlockeraPrefix(blockType)] || {},
						attributes: {
							...defaultAttributes,
							...attributes,
						},
						currentBlock: blockType,
						device,
					},
					disabledStyles,
				})
			);
		};

		// TODO: please implemented custom special pseudo-states for all blocks.
		if (['custom-class', 'parent-class', 'parent-hover'].includes(state)) {
			return;
		}

		if (isBaseBreakpoint(currentBreakpoint) && isNormalState(state)) {
			// 1- create css styles for master blocks with root attributes.
			stylesStack.push(
				appendStyles({
					settings: {
						...calculatedProps,
						state: 'normal',
						currentBlock: 'master',
						device: getBaseBreakpoint(),
					},
					disabledStyles,
				})
			);

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
		let calculatedSelectors = calculatedProps.selectors;
		let currentStateHasSelectors = false;

		if (
			!isNormalState(state) &&
			calculatedProps.selectors[appendBlockeraPrefix(`states/${state}`)]
		) {
			calculatedSelectors =
				calculatedProps.selectors[
					appendBlockeraPrefix(`states/${state}`)
				];
			currentStateHasSelectors = true;
		}

		if (validateBlockStates(stateItem)) {
			const {
				settings: { hasContent },
			} = getState(state) ||
				getInnerState(state) || {
					settings: { hasContent: false },
				};

			if (
				hasContent &&
				!Object.keys(stateItem?.breakpoints || {})?.length &&
				isBaseBreakpoint(currentBreakpoint)
			) {
				stylesStack.push(
					appendStyles({
						settings: {
							...calculatedProps,
							state,
							currentBlock: 'master',
							device: getBaseBreakpoint(),
							currentStateHasSelectors,
							selectors: calculatedSelectors,
							attributes: {
								...defaultAttributes,
								blockeraBlockStates: {
									// $FlowFixMe
									[state]: {
										content: stateItem?.content || '',
									},
								},
							},
						},
						disabledStyles,
					})
				);
			}

			for (const breakpointType in stateItem?.breakpoints || {}) {
				if (breakpointType !== currentBreakpoint) {
					continue;
				}

				const breakpoint = stateItem?.breakpoints[breakpointType];

				if (
					!Object.keys(breakpoint?.attributes || {}).length &&
					!stateItem?.content
				) {
					continue;
				}

				stylesStack.push(
					appendStyles({
						settings: {
							...calculatedProps,
							currentStateHasSelectors,
							selectors: calculatedSelectors,
							attributes: {
								...defaultAttributes,
								...params.attributes,
								...breakpoint?.attributes,
								...(hasContent
									? {
											blockeraBlockStates: {
												// $FlowFixMe
												[state]: {
													content:
														stateItem?.content ||
														'',
												},
											},
									  }
									: {}),
							},
							currentBlock: 'master',
							device: breakpointType,
						},
						disabledStyles,
					})
				);

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
