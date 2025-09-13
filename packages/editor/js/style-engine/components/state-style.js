// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import type { MixedElement } from 'react';
import { useState, useEffect, useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import type {
	TStates,
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
	const { getAvailableStates, getAvailableInnerStates, getBreakpoints } =
		select('blockera/editor');
	const blockStates = useMemo(
		() => {
			const params = { list: true };

			return [
				...new Set([
					...getAvailableStates(params),
					...getAvailableInnerStates(params),
				]),
			];
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

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

	const states: Array<TStates | string> = useMemo(() => {
		const availableStates = props?.additional?.availableBlockStates
			? Object.keys(props?.additional?.availableBlockStates)
			: [];

		let availableInnerBlockStates: Array<string> = [];

		for (const key in props?.additional?.blockeraInnerBlocks) {
			const value = props?.additional?.blockeraInnerBlocks[key];
			if (value?.availableBlockStates) {
				availableInnerBlockStates = [
					...availableInnerBlockStates,
					...Object.keys(value?.availableBlockStates),
				];
			}
		}

		return [
			...new Set([
				...blockStates,
				...availableStates,
				...availableInnerBlockStates,
			]),
		];
	}, [props?.additional, blockStates]);

	// Move "normal" state to last position to ensure other states like "hover" or "active"
	// can properly override the base styles when those states are activated.
	if (states.length > 1) {
		states.push(states.splice(0, 1)[0]);
	}

	const devicesCssStyles: { [key: TBreakpoint]: Array<MixedElement> } = {};
	const sortedBreakpoints = sortBreakpoints(breakpoints);

	for (const name in sortedBreakpoints) {
		const breakpoint = sortedBreakpoints[name];
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
					clientId={props.clientId}
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

/**
 * Sorts breakpoints to ensure correct CSS media query priority for a desktop-first approach.
 * The sorting order is:
 * 1. The `base` breakpoint (which has no min/max).
 * 2. Breakpoints with `max` width (for smaller screens), sorted largest to smallest.
 * 3. Breakpoints with `min` width (for larger screens), sorted smallest to largest.
 *
 * @param {Object} breakpointsObj - The object containing breakpoint definitions.
 * @return {Array<Object>} An array of breakpoint objects sorted for CSS generation.
 */
const sortBreakpoints = (breakpointsObj: {
	[key: string]: TBreakpoint,
}): Array<TBreakpoint> => {
	// Helper function to parse a pixel value string (e.g., "1920px") into an integer.
	const parsePx = (value) => parseInt(value, 10) || 0;

	// Convert the breakpoints object into an array of its values to make it sortable.
	const breakpointsArray = Object.values(breakpointsObj);

	// Sort the array using a custom comparison function.
	breakpointsArray.sort((a, b) => {
		const aIsMin = !!a.settings?.min;
		const bIsMin = !!b.settings?.min;
		const aIsBase = !a.settings?.min && !a.settings?.max;
		const bIsBase = !b.settings?.min && !b.settings?.max;

		// Assign a group number to each breakpoint to control the primary sort order.
		// Group 1: The single `base` breakpoint (no min/max).
		// Group 2: `max-width` breakpoints (for smaller screens).
		// Group 3: `min-width` breakpoints (for larger screens).
		let aGroup;
		let bGroup;

		if (aIsBase) {
			aGroup = 1;
		} else if (aIsMin) {
			aGroup = 3;
		} else {
			aGroup = 2;
		}
		if (bIsBase) {
			bGroup = 1;
		} else if (bIsMin) {
			bGroup = 3;
		} else {
			bGroup = 2;
		}

		// If the breakpoints are in different groups, sort by the group number (1, then 2, then 3).
		if (aGroup !== bGroup) {
			return aGroup - bGroup;
		}

		// If the breakpoints are in the same group, get their pixel values.
		const aValue = parsePx(a.settings?.min || a.settings?.max);
		const bValue = parsePx(b.settings?.min || b.settings?.max);

		// For 'max-width' breakpoints (Group 2), sort descending (largest size first).
		if (aGroup === 2) {
			return bValue - aValue;
		}

		// For 'min-width' breakpoints (Group 3), sort ascending (smallest size first).
		if (aGroup === 3) {
			return aValue - bValue;
		}

		// No sorting needed for the base group as it only has one item.
		return 0;
	});

	return breakpointsArray;
};
