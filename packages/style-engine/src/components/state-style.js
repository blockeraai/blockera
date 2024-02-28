// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useId, useMemo } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	BackgroundStyles,
	// BorderAndShadowStyles,
	FlexChildStyles,
	isInnerBlock,
	LayoutStyles,
	MouseStyles,
	PositionStyles,
	SizeStyles,
	SpacingStyles,
	// TypographyStyles,
	// EffectsStyles
} from '@publisher/extensions';
import { isNormalState } from '@publisher/extensions/src/components';
import type { TStates } from '@publisher/extensions/src/libs/block-states/types';
import { default as blockStates } from '@publisher/extensions/src/libs/block-states/states';

/**
 * Internal dependencies
 */
import { Style } from './style';
import type { StateStyleProps } from './types';
import { combineDeclarations } from '../utils';

const Stylesheet = ({
	state,
	selectors,
	currentBlock,
	currentState,
	currentBreakpoint,
	...props
}: {
	...StateStyleProps,
	state: TStates,
}): MixedElement => {
	const id = useId();

	const styles = useMemo(() => {
		let calculatedProps = {
			...props,
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
					...calculatedProps.attributes.publisherBlockStates[state]
						.breakpoints[currentBreakpoint].attributes,
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
					...calculatedProps.attributes?.publisherBlockStates[state]
						.breakpoints[currentBreakpoint].attributes,
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
			// ...TypographyStyles(calculatedProps),
			...BackgroundStyles(calculatedProps),
			// ...EffectsStyles(calculatedProps),
			// ...CustomStyleStyles(calculatedProps),
			// ...BorderAndShadowStyles(calculatedProps),
		].flat();
	}, [props, state, selectors, currentBlock, currentBreakpoint]);

	const MappedStyleGroups = () =>
		combineDeclarations(styles).map(
			(
				{ selector, declarations }: Object,
				index: number
			): MixedElement => {
				if (!declarations.length || !selector) {
					return <></>;
				}

				return (
					<Style
						key={index + id}
						selector={selector}
						cssDeclaration={declarations}
					/>
				);
			}
		);

	return <MappedStyleGroups />;
};

export const StateStyle = (
	props: StateStyleProps
): Array<MixedElement> | MixedElement => {
	const id = useId();
	const states: Array<TStates | string> = Object.keys(blockStates);

	return states.map(
		(state: TStates | string, index: number): MixedElement => (
			// $FlowFixMe
			<Stylesheet key={state + index + id} {...{ ...props, state }} />
		)
	);
};
