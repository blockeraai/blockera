// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useId } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import type { TStates } from '../../extensions/libs/block-states/types';
import { default as blockStates } from '../../extensions/libs/block-states/states';

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
		(state: TStates | string, index: number): MixedElement => {
			// Filtered allowed states to generate stylesheet.
			// in free version allowed just "normal" and "hover".
			if (
				!applyFilters('blockera.editor.styleEngine.allowedStates', [
					'normal',
					'hover',
				]).includes(state)
			) {
				return <></>;
			}

			return (
				<Stylesheet key={state + index + id} {...{ ...props, state }} />
			);
		}
	);
};
