// @flow

/**
 * Publisher dependencies
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
} from '@publisher/extensions';
import {
	isNormalState,
	prepareAttributesDefaultValues,
} from '@publisher/extensions/src/components';
import { useBlockContext } from '@publisher/extensions/src/hooks';
import { useStoreSelectors } from '@publisher/extensions/src/hooks/use-store-selectors';

/**
 * Internal dependencies
 */
import type { CssRule } from '../types';

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
	const { publisherInnerBlocks } = useBlockContext();
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

	const appendStyles = (settings: Object): Array<Object> => {
		return [
			...SizeStyles(settings),
			...MouseStyles(settings),
			...LayoutStyles(settings),
			...SpacingStyles(settings),
			...PositionStyles(settings),
			...FlexChildStyles(settings),
			...TypographyStyles(settings),
			...BackgroundStyles(settings),
			...EffectsStyles(settings),
			// ...CustomStyleStyles(settings),
			...BorderAndShadowStyles(settings),
		].flat();
	};
	const validateState = (states: Object) => {
		// Has pseudo-classes in block states for current block?
		if (Object.keys(states).length < 2) {
			return false;
		}

		const settings = states[state];

		// Recieved state has any values for current block attributes?
		return !!settings && settings?.isVisible && settings?.breakpoints;
	};

	// Calculation root styles ...
	if (isNormalState(state)) {
		stylesStack.push(
			appendStyles({
				...calculatedProps,
				currentBlock: 'master',
			})
		);

		// Calculation inner blocks styles for normal state ...
		Object.entries(params?.attributes?.publisherInnerBlocks).forEach(
			([blockType, { attributes }]: [string, Object]): void => {
				// Assume attributes hasn't any values.
				if (!Object.keys(attributes)) {
					return;
				}

				stylesStack.push(
					appendStyles({
						...calculatedProps,
						selectors:
							publisherInnerBlocks[blockType]?.selectors || {},
						attributes: {
							...defaultAttributes,
							...attributes,
						},
						currentBlock: blockType,
					})
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
				const generateCssForInnersInsidePseudoState = ([
					blockType,
					{ attributes },
				]: [string, Object]): void => {
					// Assume attributes hasn't any values.
					if (!attributes?.publisherBlockStates) {
						return;
					}

					if (!validateState(attributes?.publisherBlockStates)) {
						return;
					}

					const settings = attributes.publisherBlockStates[state];

					// Calculation inner block styles for pseudo-classes ...
					Object.entries(settings?.breakpoints).forEach(
						([, { attributes: _attributes }]: [
							string,
							Object
						]): void => {
							if (!Object.keys(_attributes).length) {
								return;
							}

							stylesStack.push(
								appendStyles({
									...calculatedProps,
									selectors:
										publisherInnerBlocks[blockType]
											?.selectors,
									attributes: {
										...defaultAttributes,
										..._attributes,
									},
									currentBlock: blockType,
								})
							);
						}
					);
				};

				// Calculation inner blocks styles for normal state ...
				Object.entries(
					params?.attributes?.publisherInnerBlocks
				).forEach(generateCssForInnersInsidePseudoState);

				// Assume recieved state is invalid.
				if (!validateState(params?.attributes?.publisherBlockStates)) {
					return stylesStack.flat();
				}

				const states = params?.attributes?.publisherBlockStates;
				const settings = states[state];

				// Calculation styles for recieved state ...
				Object.entries(settings?.breakpoints || {}).forEach(
					([, setting]): void => {
						if (!Object.keys(setting?.attributes).length) {
							return;
						}

						stylesStack.push(
							appendStyles({
								...calculatedProps,
								attributes: {
									...defaultAttributes,
									...setting?.attributes,
								},
								currentBlock: 'master',
							})
						);

						// Calculation inner blocks styles for recieved state ...
						Object.entries(
							setting?.attributes?.publisherInnerBlocks || {}
						).forEach(generateCssForInnersInsidePseudoState);
					}
				);

				break;
			case 'custom-class':
			case 'parent-class':
				break;
			case 'parent-hover':
				break;
		}

		return stylesStack.flat();
	}

	return stylesStack.flat();
};
