// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useId } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import type { TStates } from '@blockera/editor-extensions/js/libs/block-states/types';
import { default as blockStates } from '@blockera/editor-extensions/js/libs/block-states/states';

/**
 * Internal dependencies
 */
import { Style } from './style';
import type { StateStyleProps } from './types';
import { combineDeclarations } from '../utils';
import { useComputedCssProps } from '../hooks';

const Stylesheet = ({
	state,
	selectors,
	currentBlock,
	currentState,
	currentBreakpoint,
	currentInnerBlockState,
	...props
}: {
	...StateStyleProps,
	state: TStates | string,
}): MixedElement => {
	const id = useId();
	const styles = useComputedCssProps({
		...props,
		state,
		selectors,
		currentBlock,
		currentState,
		currentBreakpoint,
		currentInnerBlockState,
	});

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
