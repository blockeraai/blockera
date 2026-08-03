// @flow

/**
 * Blockera dependencies
 */
import type { BreakpointTypes } from '@blockera/editor/js/extensions/libs/block-card/block-states/types';

type MediaSettings = {
	min: string,
	max: string,
};

export const isValidPx = (value: string): boolean =>
	!!value && !value.includes('func') && !Number.isNaN(parseInt(value, 10));

export const parsePx = (value: string): number => parseInt(value, 10) || 0;

export const toPx = (value: number): string => `${value}px`;

/**
 * Resolve min/max media settings for all non-base breakpoints.
 *
 * Explicit min/max pairs are kept as-is. Missing bounds are inferred from
 * neighboring breakpoints so each range is as specific as possible.
 *
 * @param {Object} breakpoints The configured breakpoints.
 * @return {Object} Resolved min/max settings keyed by breakpoint type.
 */
export const resolveMediaSettings = (breakpoints: {
	[key: string]: BreakpointTypes,
}): { [key: string]: MediaSettings } => {
	const resolved: { [key: string]: MediaSettings } = {};
	const items = Object.values(breakpoints).filter(
		({ type, base }: BreakpointTypes): boolean => !!type && !base
	);

	items.forEach(({ type, settings }: BreakpointTypes): void => {
		const { min, max } = settings;

		if (min && max) {
			resolved[type] = { min, max };
		}
	});

	const maxOnly = items
		.filter(
			({ type, settings }: BreakpointTypes): boolean =>
				!resolved[type] && isValidPx(settings.max) && !settings.min
		)
		.sort(
			(a: BreakpointTypes, b: BreakpointTypes): number =>
				parsePx(b.settings.max) - parsePx(a.settings.max)
		);

	maxOnly.forEach((item: BreakpointTypes, index: number): void => {
		const next = maxOnly[index + 1];
		const min =
			next && isValidPx(next.settings.max)
				? toPx(parsePx(next.settings.max) + 1)
				: toPx(0);

		resolved[item.type] = { min, max: item.settings.max };
	});

	const minOnly = items
		.filter(
			({ type, settings }: BreakpointTypes): boolean =>
				!resolved[type] && isValidPx(settings.min) && !settings.max
		)
		.sort(
			(a: BreakpointTypes, b: BreakpointTypes): number =>
				parsePx(a.settings.min) - parsePx(b.settings.min)
		);

	minOnly.forEach((item: BreakpointTypes, index: number): void => {
		const next = minOnly[index + 1];
		const max =
			next && isValidPx(next.settings.min)
				? toPx(parsePx(next.settings.min) - 1)
				: '';

		resolved[item.type] = { min: item.settings.min, max };
	});

	items.forEach(({ type, settings }: BreakpointTypes): void => {
		if (!resolved[type] && (settings.min || settings.max)) {
			resolved[type] = {
				min: settings.min || '',
				max: settings.max || '',
			};
		}
	});

	return resolved;
};
