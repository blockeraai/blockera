// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import type { MixedElement } from 'react';
import { applyFilters } from '@wordpress/hooks';
import { useId, useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import type {
	BreakpointTypes,
	TStates,
} from '../../extensions/libs/block-states/types';
import { default as blockStates } from '../../extensions/libs/block-states/states';

/**
 * Internal dependencies
 */
import { Style } from './style';
import { MediaQuery } from './media-query';
import type { StateStyleProps } from './types';
import { combineDeclarations } from '../utils';
import { useComputedCssProps } from '../hooks';

const Stylesheet = ({
	states,
	selectors,
	currentBlock,
	currentState,
	currentBreakpoint,
	currentInnerBlockState,
	...props
}: {
	...StateStyleProps,
	states: Array<TStates | string>,
}): any => {
	const id = useId();
	const styles = useComputedCssProps({
		...props,
		states,
		selectors,
		currentBlock,
		currentState,
		currentBreakpoint,
		currentInnerBlockState,
	});

	const combinedDeclaration = useMemo(
		() => combineDeclarations(styles),
		[styles]
	);

	return combinedDeclaration.map(
		({ selector, declarations }: Object, index: number): MixedElement => (
			<MediaQuery key={index + id} breakpoint={currentBreakpoint}>
				<Style selector={selector} cssDeclaration={declarations} />
			</MediaQuery>
		)
	);
};

export const StateStyle = (
	props: StateStyleProps
): Array<MixedElement> | MixedElement => {
	const id = useId();

	// Filtered allowed states to generate stylesheet.
	// in free version allowed just "normal" and "hover".
	const allowedStates = ['normal', 'hover'];
	const states: Array<TStates | string> = Object.keys(blockStates).filter(
		(state) =>
			applyFilters(
				'blockera.editor.styleEngine.allowedStates',
				allowedStates
			).includes(state)
	);

	const { getBreakpoints } = select('blockera/editor');
	const breakpoints = getBreakpoints();

	return Object.entries(breakpoints).map(
		([, breakpoint]: [string, BreakpointTypes], index: number): any => {
			const { type } = breakpoint;

			return (
				<Stylesheet
					key={index + id}
					{...{ ...props, states, currentBreakpoint: type }}
				/>
			);
		}
	);
};
