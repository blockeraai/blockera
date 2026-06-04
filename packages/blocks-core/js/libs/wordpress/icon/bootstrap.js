// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';
import type { ControlContextRef } from '@blockera/controls';
import type { BlockDetail } from '@blockera/editor/js/extensions/libs/block-card/block-states/types';

/**
 * Internal dependencies
 */
import {
	coreIconColorFromWPCompatibility,
	coreIconColorToWPCompatibility,
} from './compatibility/icon-color';
import {
	coreIconWidthFromWPCompatibility,
	coreIconWidthToWPCompatibility,
} from './compatibility/width';
import { hydrateBlockeraIconFromCoreEntity } from './compatibility/hydrate-icon';
import { syncIconBlockClassName } from '@blockera/feature-icon';

const BLOCK_ID = 'core/icon';

export const bootstrapCoreIconBlock = (): void => {
	addFilter(
		'blockera.blockEdit.attributes',
		'blockera.blockEdit.coreIconBlock.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			if (blockDetail?.blockId !== BLOCK_ID) {
				return attributes;
			}

			attributes = hydrateBlockeraIconFromCoreEntity(attributes);
			attributes = coreIconColorFromWPCompatibility({ attributes });
			attributes = coreIconWidthFromWPCompatibility({ attributes });
			attributes = syncIconBlockClassName(attributes, BLOCK_ID);

			return attributes;
		}
	);

	addFilter(
		'blockera.blockEdit.setAttributes',
		'blockera.blockEdit.coreIconBlock.bootstrap.setAttributes',
		(
			nextState: Object,
			featureId: string,
			newValue: any,
			ref: ControlContextRef,
			getAttributes: () => Object,
			blockDetail: BlockDetail
		): Object => {
			const { blockId, isBaseBreakpoint, isMasterBlock } = blockDetail;

			if (blockId !== BLOCK_ID || !isBaseBreakpoint || !isMasterBlock) {
				return nextState;
			}

			if (featureId === 'blockeraIcon') {
				if (newValue?.icon) {
					nextState = mergeObject(nextState, {
						icon: newValue.icon,
					});
				}

				return nextState;
			}

			if (featureId === 'blockeraIconColor') {
				return mergeObject(
					nextState,
					coreIconColorToWPCompatibility({
						newValue,
						ref,
						attributes: getAttributes(),
					})
				);
			}

			if (featureId === 'blockeraWidth') {
				return mergeObject(
					nextState,
					coreIconWidthToWPCompatibility({
						newValue,
						ref,
						attributes: getAttributes(),
					})
				);
			}

			return nextState;
		}
	);
};
