// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import type { BreakpointTypes } from '@blockera/editor/js/extensions/libs/block-card/block-states/types';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../../store/constants';
import { resolveMediaSettings } from '../resolve-media-settings';

export { resolveMediaSettings } from '../resolve-media-settings';

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
