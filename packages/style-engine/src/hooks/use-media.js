// @flow

/**
 * Publisher dependencies
 */
import type { BreakpointTypes } from '@publisher/extensions/src/libs/block-states/types';
import breakpoints from '@publisher/extensions/src/libs/block-states/default-breakpoints';

export const useMedia = (): { [key: string]: string } => {
	const medias: { [key: string]: string } = {};

	Object.values(breakpoints()).forEach(
		({ type, settings }: BreakpointTypes): void => {
			const { min, max } = settings;

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
