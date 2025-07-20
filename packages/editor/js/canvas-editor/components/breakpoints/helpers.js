// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import { default as memoize } from 'fast-memoize';

/**
 * Blockera dependencies
 */
import { isUndefined } from '@blockera/utils';
import { classNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type {
	TBreakpoint,
	BreakpointTypes,
} from '../../../extensions/libs/block-card/block-states/types';
import { default as defaultBreakpoints } from '../../../extensions/libs/block-card/block-states/default-breakpoints';

/**
 * Check if given breakpoint is base breakpoint
 *
 * @param {TBreakpoint} breakPoint The breakpoint to check.
 * @return {boolean} true on success, false on otherwise.
 */
export const isBaseBreakpoint = (breakPoint: TBreakpoint): boolean =>
	getBaseBreakpoint() === breakPoint;

/**
 * Get based breakpoint id.
 *
 * @return {string} the breakpoint identifier.
 */
export const getBaseBreakpoint = (): TBreakpoint => 'desktop';

/**
 * Get the smallest breakpoint id.
 *
 * @param {Object} breakpoints Optional breakpoints object and if not provided will use default
 * @return {string} the breakpoint identifier.
 */
export const getSmallestBreakpoint: (breakpoints?: {
	[key: TBreakpoint]: BreakpointTypes,
}) => TBreakpoint = memoize(function (breakpoints?: {
	[key: TBreakpoint]: BreakpointTypes,
}): TBreakpoint {
	const { getBreakpoints } = select('blockera/editor') || {
		getBreakpoints: defaultBreakpoints,
	};

	if (isUndefined(breakpoints)) breakpoints = getBreakpoints();

	let minBreakpoint = Infinity;

	let minBreakpointId: TBreakpoint = getBaseBreakpoint();

	for (const key in breakpoints) {
		const typedKey: TBreakpoint = (key: any);

		// Skip disabled breakpoints
		if (!breakpoints[typedKey].status) {
			continue;
		}

		const min = breakpoints[typedKey].settings.min;

		const max = breakpoints[typedKey].settings.max;

		if (min && !isNaN(parseInt(min, 10))) {
			const minValue = parseInt(min, 10);
			if (minValue < minBreakpoint) {
				minBreakpoint = minValue;
				minBreakpointId = typedKey;
			}
		} else if (!min && max && !isNaN(parseInt(max, 10))) {
			const maxValue = parseInt(max, 10);
			if (maxValue < minBreakpoint) {
				minBreakpoint = maxValue;
				minBreakpointId = typedKey;
			}
		}
	}

	return minBreakpointId;
});

/**
 * Get the largest breakpoint id.
 *
 * @param {Object} breakpoints Optional breakpoints object and if not provided will use default
 * @return {string} the breakpoint ID.
 */
export const getLargestBreakpoint: (breakpoints?: {
	[key: TBreakpoint]: BreakpointTypes,
}) => TBreakpoint = memoize(function (breakpoints?: {
	[key: TBreakpoint]: BreakpointTypes,
}): TBreakpoint {
	const { getBreakpoints } = select('blockera/editor') || {
		getBreakpoints: defaultBreakpoints,
	};

	if (isUndefined(breakpoints)) breakpoints = getBreakpoints();

	let maxBreakpoint = -Infinity;

	let maxBreakpointId = getBaseBreakpoint();

	for (const key in breakpoints) {
		const typedKey: TBreakpoint = (key: any);

		// Skip disabled breakpoints
		if (!breakpoints[typedKey].status) {
			continue;
		}

		const min = breakpoints[typedKey].settings.min;
		const max = breakpoints[typedKey].settings.max;

		if (max && !isNaN(parseInt(max, 10))) {
			const maxValue = parseInt(max, 10);
			if (maxValue > maxBreakpoint) {
				maxBreakpoint = maxValue;
				maxBreakpointId = typedKey;
			}
		} else if (!max && min && !isNaN(parseInt(min, 10))) {
			const minValue = parseInt(min, 10);
			if (minValue > maxBreakpoint) {
				maxBreakpoint = minValue;
				maxBreakpointId = typedKey;
			}
		}
	}

	return maxBreakpointId;
});

/**
 * Get breakpoint tooltip description based on given breakpoint id.
 *
 * @param {TBreakpoint} breakpoint the breakpoint type.
 * @param {Object} breakpoints the list of available breakpoints.
 *
 * @return {string} the tooltip description
 */
export const getBreakpointLongDescription = (
	breakpoint: TBreakpoint,
	breakpoints?: { [key: TBreakpoint]: BreakpointTypes }
): string => {
	const { getBreakpoints } = select('blockera/editor') || {
		getBreakpoints: defaultBreakpoints,
	};

	if (!breakpoints) {
		breakpoints = getBreakpoints();
	}

	if (isBaseBreakpoint(breakpoint)) {
		return sprintf(
			// translators: it's the aria label for repeater item
			__(
				"%s styles apply at all breakpoints, unless they're edited at a larger or smaller breakpoint.",
				'blockera'
			),
			breakpoints[breakpoint].label
		);
	}

	if (!isUndefined(breakpoints[breakpoint])) {
		if (
			breakpoints[breakpoint].settings.min &&
			breakpoints[breakpoint].settings.max
		) {
			return sprintf(
				// translators: %1$s and %2$s are breakpoint min-width and max-width values
				__(
					'Styles added here will apply from %1$s to %2$s.',
					'blockera'
				),
				breakpoints[breakpoint].settings.min,
				breakpoints[breakpoint].settings.max
			);
		}

		if (breakpoints[breakpoint].settings.min) {
			if (getLargestBreakpoint(breakpoints) === breakpoint) {
				return sprintf(
					// translators: %s is breakpoint min-width value
					__(
						'Styles added here will apply at %s and up.',
						'blockera'
					),
					breakpoints[breakpoint].settings.min
				);
			}

			return sprintf(
				// translators: %s is breakpoint min-width value
				__(
					'Styles added here will apply at %s and up, unless they are edited at a larger breakpoint.',
					'blockera'
				),
				breakpoints[breakpoint].settings.min
			);
		}

		if (breakpoints[breakpoint].settings.max) {
			if (getSmallestBreakpoint(breakpoints) === breakpoint) {
				return sprintf(
					// translators: %s is breakpoint max-width value
					__(
						'Styles added here will apply at %s and down.',
						'blockera'
					),
					breakpoints[breakpoint].settings.max
				);
			}

			return sprintf(
				// translators: %s is breakpoint max-width value
				__(
					'Styles added here will apply at %s and down, unless they are edited at a smaller breakpoint.',
					'blockera'
				),
				breakpoints[breakpoint].settings.max
			);
		}
	}

	return '';
};

/**
 * Get breakpoint tooltip description based on given breakpoint id.
 *
 * @param {TBreakpoint} breakpoint
 * @param {Object} breakpoints the list of available breakpoints.
 * @return {string} the tooltip description
 */
export const getBreakpointShortDescription = (
	breakpoint: TBreakpoint,
	breakpoints?: { [key: TBreakpoint]: BreakpointTypes }
): string => {
	const { getBreakpoints } = select('blockera/editor') || {
		getBreakpoints: defaultBreakpoints,
	};

	if (!breakpoints) {
		breakpoints = getBreakpoints();
	}

	if (isBaseBreakpoint(breakpoint)) {
		return __('Base breakpoint', 'blockera');
	}

	if (!isUndefined(breakpoints[breakpoint])) {
		if (
			breakpoints[breakpoint].settings.min &&
			breakpoints[breakpoint].settings.max
		) {
			return sprintf(
				// translators: %1$s and %2$s are breakpoint min-width and max-width values
				__('Between %1$s and %2$s', 'blockera'),
				prepValueForHeader(breakpoints[breakpoint].settings.min),
				prepValueForHeader(breakpoints[breakpoint].settings.max)
			);
		}

		if (breakpoints[breakpoint].settings.min) {
			return sprintf(
				// translators: %s is breakpoint min-width value
				__('%s and up', 'blockera'),
				prepValueForHeader(breakpoints[breakpoint].settings.min)
			);
		}

		if (breakpoints[breakpoint].settings.max) {
			return sprintf(
				// translators: %s is breakpoint max-width value
				__('%s and down', 'blockera'),
				prepValueForHeader(breakpoints[breakpoint].settings.max)
			);
		}
	}

	return '';
};

export function prepValueForHeader(value: any): string {
	if (value === '') {
		return '';
	}

	if (value.endsWith('func')) {
		return __('Custom CSS', 'blockera');
	}

	return value;
}

export function getSortedBreakpoints(
	breakpoints: BreakpointTypes[],
	{
		BreakpointIcon,
		output = 'icons',
		onClick = () => {},
		setActiveBreakpoint,
		currentActiveBreakpoint,
	}
) {
	const newBreakpointsList = [];

	// Helper function to extract numeric value from px string
	const extractNumericValue = (value: string): number => {
		if (!value || value.includes('func')) return -1;
		return parseInt(value.replace('px', ''), 10) || 0;
	};

	// Helper function to determine breakpoint category and sort value
	const getBreakpointSortInfo = (item: BreakpointTypes) => {
		const { min, max } = item.settings;
		const minValue = extractNumericValue(min);
		const maxValue = extractNumericValue(max);
		const hasMin = min && minValue >= 0;
		const hasMax = max && maxValue >= 0;
		const hasFunc =
			(min && min.includes('func')) || (max && max.includes('func'));

		// Base breakpoint should be in center (category 2)
		if (item.base) {
			return { category: 2, sortValue: 0 };
		}

		// Items with "func" should be at the very end (category 5)
		if (hasFunc) {
			return { category: 5, sortValue: 0 };
		}

		// Items with both min and max should be at the end (category 4)
		if (hasMin && hasMax) {
			return { category: 4, sortValue: maxValue };
		}

		// Items with only min should be first (category 1), larger values first
		if (hasMin && !hasMax) {
			return { category: 1, sortValue: -minValue }; // Negative for descending order
		}

		// Items with only max should be at the end (category 3), larger values at the end
		if (!hasMin && hasMax) {
			return { category: 3, sortValue: -maxValue }; // Negative for ascending order (small to large)
		}

		// Fallback for items with no min/max
		return { category: 3, sortValue: 0 };
	};

	let breakpointsEntries = Object.entries(breakpoints);

	if ('icons' === output) {
		breakpointsEntries = breakpointsEntries.filter(
			([, item]: [TBreakpoint, BreakpointTypes]) => item.status
		);
	}

	// Convert to array and sort
	const sortedBreakpoints = breakpointsEntries
		.map(([itemId, item]: [TBreakpoint, BreakpointTypes]) => {
			const sortInfo = getBreakpointSortInfo(item);
			return {
				itemId,
				item,
				...sortInfo,
			};
		})
		.sort((a, b) => {
			// First sort by category
			if (a.category !== b.category) {
				return a.category - b.category;
			}
			// Then sort by sortValue within the same category
			return a.sortValue - b.sortValue;
		});

	// Create breakpoint components in sorted order
	sortedBreakpoints.forEach(({ itemId, item }, index: number) => {
		if (output === 'icons') {
			newBreakpointsList.push(
				<BreakpointIcon
					key={`${itemId}-${index}`}
					className={classNames({
						'is-active-breakpoint':
							itemId === currentActiveBreakpoint,
					})}
					name={itemId}
					settings={{
						...item.settings,
						min: item.settings.min || '',
						max: item.settings.max || '',
					}}
					isDefault={item.isDefault}
					onClick={(event) => {
						event.stopPropagation();

						if (itemId !== currentActiveBreakpoint) {
							onClick(itemId);
							setActiveBreakpoint(itemId);
						}
					}}
				/>
			);
		} else {
			newBreakpointsList[itemId] = item;
		}
	});

	return newBreakpointsList;
}
