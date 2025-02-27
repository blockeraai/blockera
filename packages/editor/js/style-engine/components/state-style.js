// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import type { MixedElement } from 'react';
import { applyFilters } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import type {
	TStates,
	TBreakpoint,
} from '../../extensions/libs/block-states/types';
import { mergeObject } from '@blockera/utils';
import { getComputedCssProps } from '../get-computed-css-props';
import { default as blockStates } from '../../extensions/libs/block-states/states';

/**
 * Internal dependencies
 */
import { Style } from './style';
import { MediaQuery } from './media-query';
import type { StateStyleProps } from './types';
import { combineDeclarations } from '../utils';

export const StateStyle = (
	props: StateStyleProps
): Array<MixedElement> | MixedElement => {
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

	const devicesCssStyles: { [key: TBreakpoint]: Array<MixedElement> } = {};

	for (const name in breakpoints) {
		const breakpoint = breakpoints[name];
		const { type } = breakpoint;

		const combinedDeclarations = combineDeclarations(
			getComputedCssProps({
				...props,
				states,
				currentBreakpoint: type,
			})
		);

		const stylesheet = combinedDeclarations.map(
			(
				{ selector, declarations }: Object,
				index: number
			): MixedElement => (
				<Style
					key={`${type}-${index}-style`}
					selector={selector}
					cssDeclaration={declarations}
				/>
			)
		);

		if (!stylesheet.length) {
			continue;
		}

		if (devicesCssStyles[type]) {
			devicesCssStyles[type] = mergeObject(
				devicesCssStyles[type],
				stylesheet
			);

			continue;
		}

		devicesCssStyles[type] = stylesheet;
	}

	return Object.entries(devicesCssStyles).map(
		(
			[type, stylesheet]: [TBreakpoint, Array<MixedElement>],
			i: number
		): MixedElement => {
			return (
				<MediaQuery key={`${type}-${i}-media-query`} breakpoint={type}>
					{stylesheet}
				</MediaQuery>
			);
		}
	);
};
