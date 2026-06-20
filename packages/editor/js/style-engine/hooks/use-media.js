// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import type { BreakpointTypes } from '@blockera/editor/js/extensions/libs/block-card/block-states/types';

import { STORE_NAME } from '../../store/constants';

type MediaSettings = {
	min: string,
	max: string,
};

const isValidPx = (value: string): boolean =>
	!!value && !value.includes('func') && !Number.isNaN(parseInt(value, 10));

const parsePx = (value: string): number => parseInt(value, 10) || 0;

const toPx = (value: number): string => `${value}px`;

/**
 * Resolve min/max media settings for all non-base breakpoints.
 *
 * Explicit min/max pairs are kept as-is. Missing bounds are inferred from
 * neighboring breakpoints so each range is as specific as possible.
 *
 * @param {Object} breakpoints The configured breakpoints.
 * @return {Object} Resolved min/max settings keyed by breakpoint type.
 */
const resolveMediaSettings = (breakpoints: {
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

export const useMedia = (): { [key: string]: string } => {
	const medias: { [key: string]: string } = {};
	const { getBreakpoints } = select(STORE_NAME);
	const breakpoints = getBreakpoints();
	const mediaSettings = resolveMediaSettings(breakpoints);

	Object.values(breakpoints).forEach(
		({ type, base }: BreakpointTypes): void => {
			if (base) {
				medias[type] = '';
				return;
			}

			const { min = '', max = '' } = mediaSettings[type] || {};
			let media = '';

			if (min && max) {
				media = `@media screen and (max-width: ${max}) and (min-width: ${min})`;
			} else if (min) {
				media = `@media screen and (min-width: ${min})`;
			} else if (max) {
				media = `@media screen and (max-width: ${max})`;
			}

			medias[type] = media;
		}
	);

	return medias;
};
