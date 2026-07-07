// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import type { ControlContextRefCurrent } from '@blockera/controls';

/**
 * Internal dependencies
 */
import type { BlockDetail } from '../block-card/block-states/types';
import {
	isInvalidCompatibilityRun,
	mergeWPCompatibility,
	sanitizeWPCompatibilityAttributes,
} from '../utils';
import {
	gridChildSpansFromWPCompatibility,
	gridChildColumnSpanToWPCompatibility,
	gridChildRowSpanToWPCompatibility,
} from './compatibility/wp-layout-span';

export const bootstrap = (): void => {
	addFilter(
		'blockera.blockEdit.attributes',
		'blockera.blockEdit.gridChildExtension.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			return sanitizeWPCompatibilityAttributes(
				gridChildSpansFromWPCompatibility({ attributes }),
				blockDetail
			);
		}
	);

	addFilter(
		'blockera.blockEdit.setAttributes',
		'blockera.blockEdit.gridChildExtension.bootstrap.setAttributes',
		(
			nextState: Object,
			featureId: string,
			newValue: any,
			ref: ControlContextRefCurrent,
			getAttributes: () => Object,
			blockDetail: BlockDetail
		): Object => {
			if (isInvalidCompatibilityRun(blockDetail, ref)) {
				return nextState;
			}

			switch (featureId) {
				case 'blockeraGridChildColumnSpan':
					// Replace `style` wholesale: deep merge would keep stale
					// `style.layout.columnSpan` when the patch omits the key after clear.
					return mergeWPCompatibility(
						nextState,
						{
							...(gridChildColumnSpanToWPCompatibility({
								newValue,
								getAttributes,
							}) ?? {}),
							forceUpdated: ['style'],
						},
						blockDetail
					);

				case 'blockeraGridChildRowSpan':
					return mergeWPCompatibility(
						nextState,
						{
							...(gridChildRowSpanToWPCompatibility({
								newValue,
								getAttributes,
							}) ?? {}),
							forceUpdated: ['style'],
						},
						blockDetail
					);
			}

			return nextState;
		}
	);
};
