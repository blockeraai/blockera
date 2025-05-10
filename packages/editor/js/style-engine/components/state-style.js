// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import type { MixedElement } from 'react';
import { applyFilters } from '@wordpress/hooks';
import { useState, useEffect, useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import type {
	TStates,
	StateTypes,
	TBreakpoint,
} from '../../extensions/libs/block-card/block-states/types';
import { mergeObject } from '@blockera/utils';
import { getComputedCssProps } from '../get-computed-css-props';

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
	const [breakpoints, setBreakpoints] = useState({});
	const { getStates, getBreakpoints } = select('blockera/editor');
	const blockStates = getStates();

	useEffect(() => {
		const loadBreakpoints = () => {
			const points = getBreakpoints();
			if (Object.keys(points).length === 0) {
				// If still empty, retry after a short delay.
				setTimeout(loadBreakpoints, 100);
			} else {
				setBreakpoints(points);
			}
		};

		loadBreakpoints();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const statesForProcessing = useMemo(() => {
		if (
			props?.additional?.availableBlockStates &&
			Object.keys(props?.additional?.availableBlockStates).length > 0
		) {
			return props?.additional?.availableBlockStates;
		}

		return blockStates;
	}, [props?.additional?.availableBlockStates, blockStates]);

	// Filtered allowed states to generate stylesheet.
	// in free version allowed just "normal" and "hover".
	const allowedStates = Object.values(statesForProcessing)
		.filter((state: StateTypes): boolean => !state?.native)
		.map((state: StateTypes): string => state.type);
	const states: Array<TStates | string> = Object.keys(
		statesForProcessing
	).filter((state) =>
		applyFilters(
			'blockera.editor.styleEngine.allowedStates',
			allowedStates
		).includes(state)
	);

	// Move "normal" state to last position to ensure other states like "hover" or "active"
	// can properly override the base styles when those states are activated.
	if (states.length > 1) {
		states.push(states.splice(0, 1)[0]);
	}

	const devicesCssStyles: { [key: TBreakpoint]: Array<MixedElement> } = {};

	for (const name in breakpoints) {
		const breakpoint = breakpoints[name];
		const { type } = breakpoint;

		const combinedDeclarations = combineDeclarations(
			getComputedCssProps({
				...props,
				states,
				currentBreakpoint: type,
			}),
			props.inlineStyles
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
