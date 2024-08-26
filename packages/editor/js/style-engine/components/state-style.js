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
import { select } from '@wordpress/data';

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
			): MixedElement => (
				<MediaQuery key={index + id} breakpoint={currentBreakpoint}>
					<Style selector={selector} cssDeclaration={declarations} />
				</MediaQuery>
			)
		);

	return <MappedStyleGroups />;
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
		([, breakpoint]: [string, BreakpointTypes]): any => {
			const { type } = breakpoint;

			return states.map(
				(state: TStates | string, index: number): MixedElement => (
					<Stylesheet
						key={state + index + id}
						{...{ ...props, state, currentBreakpoint: type }}
					/>
				)
			);
		}
	);
};
