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
import { getBaseBreakpoint, isBaseBreakpoint } from '../canvas-editor';
import { isBlock } from '../extensions/libs/block-card/inner-blocks/utils';
import type { InnerBlockType } from '../extensions/libs/block-card/inner-blocks/types';
import background from '../schemas/block-supports/background-block-supports-list.json';
import border from '../schemas/block-supports/border-block-supports-list.json';
import boxShadow from '../schemas/block-supports/box-shadow-block-supports-list.json';
import divider from '../schemas/block-supports/divider-block-supports-list.json';
import effects from '../schemas/block-supports/effects-block-supports-list.json';
import layout from '../schemas/block-supports/layout-block-supports-list.json';
import mouse from '../schemas/block-supports/mouse-block-supports-list.json';
import outline from '../schemas/block-supports/outline-block-supports-list.json';
import position from '../schemas/block-supports/position-block-supports-list.json';
import size from '../schemas/block-supports/size-block-supports-list.json';
import spacing from '../schemas/block-supports/spacing-block-supports-list.json';
import typography from '../schemas/block-supports/typography-block-supports-list.json';

const blockeraSupports = {
	...(background?.supports || {}),
	...(border?.supports || {}),
	...(boxShadow?.supports || {}),
	...(divider?.supports || {}),
	...(effects?.supports || {}),
	...(layout?.supports || {}),
	...(mouse?.supports || {}),
	...(outline?.supports || {}),
	...(position?.supports || {}),
	...(size?.supports || {}),
	...(spacing?.supports || {}),
	...(typography?.supports || {}),
};

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

	const updateBlockSelectors = (currentBlock: string): Object => {
		if (!isBlock({ name: currentBlock })) {
			return selectors;
		}

		const { getBlockType } = select('core/blocks') || {};
		const { selectors: currentBlockSelectors } = getBlockType(
			currentBlock
		) || {
			selectors: {},
		};

		if (!currentBlockSelectors.hasOwnProperty('root')) {
			selectors = {
				...selectors,
				// $FlowFixMe
				[currentBlock]: {
					...(selectors?.[currentBlock] || {}),
					root:
						'.wp-block-' +
						currentBlock.replace('core/', '').replace('/', '-'),
				},
			};
		}

		for (const supportId in currentBlockSelectors) {
			if ('root' === supportId) {
				selectors = {
					...selectors,
					// $FlowFixMe
					[currentBlock]: {
						...(selectors?.[currentBlock] || {}),
						root: currentBlockSelectors[supportId],
					},
				};
				continue;
			}
			if (!selectors?.[currentBlock]?.[supportId]) {
				selectors = {
					...selectors,
					// $FlowFixMe
					[currentBlock]: {
						...(selectors?.[currentBlock] || {}),
						[supportId]: currentBlockSelectors[supportId],
					},
				};
			}
		}

		return selectors;
	};

	states.forEach((state: TStates | string): void => {
		const calculatedProps = {
			...params,
			state,
			supports: {
				...blockeraSupports,
				...params.supports,
			},
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

				selectors = updateBlockSelectors(blockType);
				const breakpoints = stateItem.breakpoints;

				const {
					settings: { hasContent },
				} = getState(stateType) ||
					getInnerState(stateType) || {
						settings: { hasContent: false },
					};

				let currentStateHasSelectors = false;
				let calculatedSelectors =
					selectors[appendBlockeraPrefix(blockType)] ||
					selectors[blockType] ||
					{};

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

			selectors = updateBlockSelectors(blockType);

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
							selectors[appendBlockeraPrefix(blockType)] ||
							selectors[blockType] ||
							{},
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
								...(hasContent ? {} : params.attributes),
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
