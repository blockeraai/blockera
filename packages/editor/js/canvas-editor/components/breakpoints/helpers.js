// @flow

/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { default as memoize } from 'fast-memoize';

/**
 * Blockera dependencies
 */
import { isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type {
	TBreakpoint,
	BreakpointTypes,
} from '../../../extensions/libs/block-states/types';
import { default as defaultBreakpoints } from '../../../extensions/libs/block-states/default-breakpoints';

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
 * Get smallest breakpoint id.
 *
 * @param {Object} breakpoints Optional breakpoints object and if not provided will use default
 * @return {string} the breakpoint identifier.
 */
export const getSmallestBreakpoint: (breakpoints?: {
	[key: TBreakpoint]: BreakpointTypes,
}) => TBreakpoint = memoize(function (breakpoints?: {
	[key: TBreakpoint]: BreakpointTypes,
}): TBreakpoint {
	if (isUndefined(breakpoints)) breakpoints = defaultBreakpoints();

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
 * Get largest breakpoint id.
 *
 * @param {Object} breakpoints Optional breakpoints object and if not provided will use default
 * @return {string} the breakpoint ID.
 */
export const getLargestBreakpoint: (breakpoints?: {
	[key: TBreakpoint]: BreakpointTypes,
}) => TBreakpoint = memoize(function (breakpoints?: {
	[key: TBreakpoint]: BreakpointTypes,
}): TBreakpoint {
	if (isUndefined(breakpoints)) breakpoints = defaultBreakpoints();

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
 * @param {TBreakpoint} breakpoint
 * @return {string} the tooltip description
 */
export const getBreakpointLongDescription = (
	breakpoint: TBreakpoint
): string => {
	const breakpoints = defaultBreakpoints();

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
			if (getLargestBreakpoint() === breakpoint) {
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
			if (getSmallestBreakpoint() === breakpoint) {
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
 * @return {string} the tooltip description
 */
export const getBreakpointShortDescription = (
	breakpoint: TBreakpoint
): string => {
	if (isBaseBreakpoint(breakpoint)) {
		return __('Base breakpoint', 'blockera');
	}

	const breakpoints = defaultBreakpoints();

	if (!isUndefined(breakpoints[breakpoint])) {
		if (
			breakpoints[breakpoint].settings.min &&
			breakpoints[breakpoint].settings.max
		) {
			return sprintf(
				// translators: %1$s and %2$s are breakpoint min-width and max-width values
				__('Between %1$s and %2$s', 'blockera'),
				breakpoints[breakpoint].settings.min,
				breakpoints[breakpoint].settings.max
			);
		}

		if (breakpoints[breakpoint].settings.min) {
			return sprintf(
				// translators: %s is breakpoint min-width value
				__('%s and up', 'blockera'),
				breakpoints[breakpoint].settings.min
			);
		}

		if (breakpoints[breakpoint].settings.max) {
			return sprintf(
				// translators: %s is breakpoint max-width value
				__('%s and down', 'blockera'),
				breakpoints[breakpoint].settings.max
			);
		}
	}

	return '';
};
