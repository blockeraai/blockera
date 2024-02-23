// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useId } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	// BackgroundStyles,
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
	state: TStates | string,
}): MixedElement => {
	let calculatedProps = {
		...props,
		state,
		selectors,
		currentBlock,
	};
	const id = useId();

	if ('normal' !== state && !isInnerBlock(currentBlock)) {
		if (!calculatedProps.attributes.publisherBlockStates[state]) {
			return <></>;
		}

		calculatedProps = {
			...calculatedProps,
			attributes:
				calculatedProps.attributes.publisherBlockStates[state]
					.breakpoints[currentBreakpoint].attributes,
		};
	} else if ('normal' !== state && isInnerBlock(currentBlock)) {
		if (
			!calculatedProps.attributes?.publisherBlockStates ||
			!calculatedProps.attributes?.publisherBlockStates[state]
		) {
			return <></>;
		}

		calculatedProps = {
			...calculatedProps,
			attributes:
				calculatedProps.attributes?.publisherBlockStates[state]
					.breakpoints[currentBreakpoint].attributes,
		};
	}

	const styles = [
		...SizeStyles(calculatedProps),
		...MouseStyles(calculatedProps),
		...LayoutStyles(calculatedProps),
		...SpacingStyles(calculatedProps),
		...PositionStyles(calculatedProps),
		...FlexChildStyles(calculatedProps),
		// ...TypographyStyles(calculatedProps),
		// ...BackgroundStyles(calculatedProps),
		// ...EffectsStyles(calculatedProps),
		// ...CustomStyleStyles(calculatedProps),
		// ...BorderAndShadowStyles(calculatedProps),
	].flat();

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
			<Stylesheet key={state + index + id} {...{ ...props, state }} />
		)
	);
};
