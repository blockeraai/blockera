// @flow

/**
 * Blockera dependencies
 */
import {
	BackgroundStyles,
	BorderAndShadowStyles,
	FlexChildStyles,
	LayoutStyles,
	MouseStyles,
	PositionStyles,
	SizeStyles,
	SpacingStyles,
	TypographyStyles,
	EffectsStyles,
} from '@blockera/editor-extensions';
import {
	isNormalState,
	prepareAttributesDefaultValues,
} from '@blockera/editor-extensions/js/components';
import { useBlockContext } from '@blockera/editor-extensions/js/hooks';
import { useStoreSelectors } from '@blockera/editor-extensions/js/hooks/use-store-selectors';

/**
 * Internal dependencies
 */
import type { CssRule } from '../types';
import type { TBreakpoint } from '@blockera/editor-extensions/js/libs/block-states/types';
import type { InnerBlockType } from '@blockera/editor-extensions/js/libs/inner-blocks/types';

export const useComputedCssProps = ({
	state,
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
	const { blockeraInnerBlocks } = useBlockContext();
	const calculatedProps = {
		...params,
		state,
		selectors,
	};
	// eslint-disable-next-line @wordpress/no-unused-vars-before-return,react-hooks/exhaustive-deps
	const defaultAttributes = prepareAttributesDefaultValues(
		getBlockType(blockName)?.attributes || {}
	);
	const stylesStack = [];

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
	const validateState = (
		states: Object,
		normalFlag: boolean = false
	): boolean => {
		// Has pseudo-classes in block states for current block?
		if (Object.keys(states).length < 2 && !normalFlag) {
			return false;
		}

		const settings = states[state];

		// Recieved state has any values for current block attributes?
		return !!settings && settings?.isVisible && settings?.breakpoints;
	};

	// Calculation root styles ...
	if (isNormalState(state)) {
		appendStyles({
			...calculatedProps,
			currentBlock: 'master',
			device: 'laptop',
		});

		const generateCssForInnersInsideNormalState = (
			[blockType, { attributes }]: [InnerBlockType | string, Object],
			device: TBreakpoint | string
		): void => {
			// Assume attributes hasn't any values.
			if (!Object.keys(attributes)) {
				return;
			}

			appendStyles({
				...calculatedProps,
				selectors: blockeraInnerBlocks[blockType]?.selectors || {},
				attributes: {
					...defaultAttributes,
					...attributes,
				},
				currentBlock: blockType,
				device,
			});
		};

		// Calculation inner blocks styles for normal state ...
		Object.entries(params?.attributes?.blockeraInnerBlocks).forEach(
			(innerBlock: [InnerBlockType | string, Object]): void =>
				generateCssForInnersInsideNormalState(innerBlock, 'laptop')
		);

		// Assume recieved state is invalid.
		if (!validateState(params?.attributes?.blockeraBlockStates, true)) {
			return stylesStack.flat();
		}

		const states = params?.attributes?.blockeraBlockStates;
		const settings = states.normal;

		// Calculation styles for each normal state in all breakpoints ...
		Object.entries(settings?.breakpoints || {}).forEach(
			([breakpoint, setting]: [TBreakpoint | string, Object]): void => {
				if ('laptop' === breakpoint) {
					return;
				}

				if (!Object.keys(setting?.attributes).length) {
					return;
				}

				appendStyles({
					...calculatedProps,
					attributes: {
						...defaultAttributes,
						...setting?.attributes,
					},
					currentBlock: 'master',
					device: breakpoint,
				});

				// Calculation inner blocks styles for recieved state ...
				Object.entries(
					setting?.attributes?.blockeraInnerBlocks || {}
				).forEach(
					(innerBlock: [InnerBlockType | string, Object]): void =>
						generateCssForInnersInsideNormalState(
							innerBlock,
							breakpoint
						)
				);
			}
		);
	}
	// Calculation styles pseudo-classes ...
	else {
		switch (state) {
			// case 'hover':
			// case 'active':
			// case 'focus':
			// case 'visited':
			// case 'before':
			// case 'after':
			default:
				const generateCssForInnersInsidePseudoState = (
					[blockType, { attributes }]: [string, Object],
					device: TBreakpoint | string
				): void => {
					// Assume attributes hasn't any values.
					if (!attributes?.blockeraBlockStates) {
						return;
					}

					if (!validateState(attributes?.blockeraBlockStates)) {
						return;
					}

					const settings = attributes.blockeraBlockStates[state];

					// Calculation inner block styles for pseudo-classes ...
					Object.entries(settings?.breakpoints).forEach(
						([, { attributes: _attributes }]: [
							string,
							Object
						]): void => {
							if (!Object.keys(_attributes).length) {
								return;
							}

							appendStyles({
								...calculatedProps,
								selectors:
									blockeraInnerBlocks[blockType]?.selectors ||
									{},
								attributes: {
									...defaultAttributes,
									..._attributes,
								},
								currentBlock: blockType,
								device,
							});
						}
					);
				};

				// Calculation inner blocks styles for pseudo state ...
				Object.entries(params?.attributes?.blockeraInnerBlocks).forEach(
					(innerBlock: [string, Object]): void =>
						generateCssForInnersInsidePseudoState(
							innerBlock,
							'laptop'
						)
				);

				// Assume recieved state is invalid.
				if (!validateState(params?.attributes?.blockeraBlockStates)) {
					return stylesStack.flat();
				}

				const states = params?.attributes?.blockeraBlockStates;
				const settings = states[state];

				// Calculation styles for recieved state ...
				Object.entries(settings?.breakpoints || {}).forEach(
					([breakpoint, setting]): void => {
						if (!Object.keys(setting?.attributes).length) {
							return;
						}

						appendStyles({
							...calculatedProps,
							attributes: {
								...defaultAttributes,
								...setting?.attributes,
							},
							currentBlock: 'master',
							device: breakpoint,
						});

						// Calculation inner blocks styles for recieved state ...
						Object.entries(
							setting?.attributes?.blockeraInnerBlocks || {}
						).forEach((innerBlock: [string, Object]): void =>
							generateCssForInnersInsidePseudoState(
								innerBlock,
								breakpoint
							)
						);
					}
				);

				break;
			case 'custom-class':
			case 'parent-class':
				// FIXME: implements ...
				break;
			case 'parent-hover':
				break;
		}

		return stylesStack.flat();
	}

	return stylesStack.flat();
};
