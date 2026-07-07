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
import { applyCoreIconBlockCompatibility } from './compatibility/core-icon-block-sync';
import { hydrateBlockeraIconFromCoreEntity } from './compatibility/hydrate-icon';
import { syncIconBlockClassName } from '@blockera/feature-icon';

const BLOCK_ID = 'core/icon';

const CORE_ICON_ICON_CONFIG_ALIASES = {
	blockeraIconSize: {
		config: {
			attribute: 'blockeraWidth',
		},
	},
	blockeraIconColor: {
		config: {
			attribute: 'blockeraFontColor',
		},
	},
};

export const bootstrapCoreIconBlock = (): void => {
	addFilter(
		'blockera.block.core.icon.extension.iconConfig',
		'blockera.blockEdit.coreIconBlock.iconConfig.aliases',
		(iconConfig: Object) =>
			mergeObject(iconConfig, CORE_ICON_ICON_CONFIG_ALIASES)
	);

	addFilter(
		'blockera.blockEdit.attributes',
		'blockera.blockEdit.coreIconBlock.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			if (blockDetail?.blockId !== BLOCK_ID) {
				return attributes;
			}

			attributes = hydrateBlockeraIconFromCoreEntity(attributes);
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

			return applyCoreIconBlockCompatibility(
				nextState,
				featureId,
				newValue
			);
		}
	);
};
