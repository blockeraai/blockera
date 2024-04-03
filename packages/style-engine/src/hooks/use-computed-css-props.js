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
	// BorderAndShadowStyles,
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
} from '@publisher/extensions/src/components';

export const useComputedCssProps = ({
	state,
	selectors,
	currentBlock,
	currentBreakpoint,
	...params
}: Object): Object => {
	return useMemo(() => {
		let calculatedProps = {
			...params,
			state,
			selectors,
			currentBlock,
		};

		if (!isNormalState(state) && !isInnerBlock(currentBlock)) {
			if (!calculatedProps.attributes.publisherBlockStates[state]) {
				return <></>;
			}

			calculatedProps = {
				...calculatedProps,
				attributes: {
					...calculatedProps.currentAttributes,
					...(calculatedProps.attributes.publisherBlockStates[state]
						.breakpoints[currentBreakpoint] &&
					calculatedProps.attributes.publisherBlockStates[state]
						.breakpoints[currentBreakpoint].attributes
						? calculatedProps.attributes.publisherBlockStates[state]
								.breakpoints[currentBreakpoint].attributes
						: {}),
				},
			};
		} else if (!isNormalState(state) && isInnerBlock(currentBlock)) {
			if (
				!calculatedProps.attributes?.publisherBlockStates ||
				!calculatedProps.attributes?.publisherBlockStates[state]
			) {
				return <></>;
			}

			calculatedProps = {
				...calculatedProps,
				attributes: {
					...calculatedProps.currentAttributes,
					...(calculatedProps.attributes.publisherBlockStates[state]
						.breakpoints[currentBreakpoint] &&
					calculatedProps.attributes.publisherBlockStates[state]
						.breakpoints[currentBreakpoint].attributes
						? calculatedProps.attributes.publisherBlockStates[state]
								.breakpoints[currentBreakpoint].attributes
						: {}),
				},
			};
		} else if (isNormalState(state) && isInnerBlock(currentBlock)) {
			calculatedProps = {
				...calculatedProps,
				attributes: {
					...calculatedProps.currentAttributes,
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
			// ...BorderAndShadowStyles(calculatedProps),
		].flat();
	}, [params, state, selectors, currentBlock, currentBreakpoint]);
};
