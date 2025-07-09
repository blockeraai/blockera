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

export const useMedia = (): { [key: string]: string } => {
	const medias: { [key: string]: string } = {};
	const { getBreakpoints } = select(STORE_NAME);

	Object.values(getBreakpoints()).forEach(
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
