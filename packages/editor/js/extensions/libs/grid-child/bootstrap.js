// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';
import type { ControlContextRefCurrent } from '@blockera/controls';

/**
 * Internal dependencies
 */
import type { BlockDetail } from '../block-card/block-states/types';
import { isInvalidCompatibilityRun } from '../utils';
import {
	gridChildSpansFromWPCompatibility,
	gridChildColumnSpanToWPCompatibility,
	gridChildRowSpanToWPCompatibility,
} from './compatibility/wp-layout-span';

export const bootstrap = (): void => {
	addFilter(
		'blockera.blockEdit.attributes',
		'blockera.blockEdit.gridChildExtension.bootstrap',
		(attributes: Object) => {
			return gridChildSpansFromWPCompatibility({ attributes });
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
					return mergeObject(
						nextState,
						gridChildColumnSpanToWPCompatibility({
							newValue,
							getAttributes,
						}) ?? {},
						{ forceUpdated: ['style'] }
					);

				case 'blockeraGridChildRowSpan':
					return mergeObject(
						nextState,
						gridChildRowSpanToWPCompatibility({
							newValue,
							getAttributes,
						}) ?? {},
						{ forceUpdated: ['style'] }
					);
			}

			return nextState;
		}
	);
};
