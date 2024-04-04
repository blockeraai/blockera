// @flow

/**
 * External dependencies
 */
import { useMemo } from '@wordpress/element';

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
	isInnerBlock,
	isNormalState,
	prepareAttributesDefaultValues,
} from '@publisher/extensions/src/components';
import { useStoreSelectors } from '@publisher/extensions/src/hooks/use-store-selectors';

export const useComputedCssProps = ({
	state,
	selectors,
	blockName,
	currentBlock,
	currentBreakpoint,
	...params
}: Object): Object => {
	const {
		blocks: { getBlockType },
	} = useStoreSelectors();

	return useMemo(() => {
		// Assume master -> normal state
		let calculatedProps = {
			...params,
			state,
			selectors,
			currentBlock,
		};
		// eslint-disable-next-line @wordpress/no-unused-vars-before-return,react-hooks/exhaustive-deps
		const defaultAttributes = prepareAttributesDefaultValues(
			getBlockType(blockName)?.attributes || {}
		);

		// Assume master -> secondary state
		if (!isNormalState(state) && !isInnerBlock(currentBlock)) {
			if (!calculatedProps.attributes.publisherBlockStates[state]) {
				return <></>;
			}

			calculatedProps = {
				...calculatedProps,
				attributes: {
					...defaultAttributes,
					...(calculatedProps.attributes.publisherBlockStates[state]
						.breakpoints[currentBreakpoint] &&
					calculatedProps.attributes.publisherBlockStates[state]
						.breakpoints[currentBreakpoint].attributes
						? calculatedProps.attributes.publisherBlockStates[state]
								.breakpoints[currentBreakpoint].attributes
						: {}),
				},
			};
		}
		// Assume master -> secondary state -> inner
		else if (!isNormalState(state) && isInnerBlock(currentBlock)) {
			if (
				!calculatedProps.attributes?.publisherBlockStates ||
				!calculatedProps.attributes?.publisherBlockStates[state]
			) {
				return <></>;
			}

			calculatedProps = {
				...calculatedProps,
				attributes: {
					...defaultAttributes,
					...(calculatedProps.attributes.publisherBlockStates[state]
						.breakpoints[currentBreakpoint] &&
					calculatedProps.attributes.publisherBlockStates[state]
						.breakpoints[currentBreakpoint].attributes
						? calculatedProps.attributes.publisherBlockStates[state]
								.breakpoints[currentBreakpoint].attributes
						: {}),
				},
			};
		}
		// Assume master -> normal state -> inner
		else if (isNormalState(state) && isInnerBlock(currentBlock)) {
			calculatedProps = {
				...calculatedProps,
				attributes: {
					...defaultAttributes,
					...calculatedProps.attributes,
				},
			};
		}

		return [
			...SizeStyles(calculatedProps),
			...MouseStyles(calculatedProps),
			...LayoutStyles(calculatedProps),
			...SpacingStyles(calculatedProps),
			...PositionStyles(calculatedProps),
			...FlexChildStyles(calculatedProps),
			...TypographyStyles(calculatedProps),
			...BackgroundStyles(calculatedProps),
			...EffectsStyles(calculatedProps),
			// ...CustomStyleStyles(calculatedProps),
			...BorderAndShadowStyles(calculatedProps),
		].flat();
	}, [params, state, selectors, currentBlock, currentBreakpoint]);
};
