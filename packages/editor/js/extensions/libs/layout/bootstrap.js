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

import {
	displayFromWPCompatibility,
	displayToWPCompatibility,
} from './compatibility/display';
import {
	flexWrapFromWPCompatibility,
	flexWrapToWPCompatibility,
} from './compatibility/flex-wrap';
import {
	flexLayoutToWPCompatibility,
	alignItemsFromWPCompatibility,
	justifyContentFromWPCompatibility,
	directionFromWPCompatibility,
} from './compatibility/flex-layout';
import {
	gapFromWPCompatibility,
	gapToWPCompatibility,
} from './compatibility/gap';
import {
	spacingFromWPCompatibility,
	spacingToWPCompatibility,
} from './compatibility/spacing';
import {
	gridAttrsFromWPCompatibility,
	gridMinimumColumnWidthToWPCompatibility,
	gridColumnCountToWPCompatibility,
} from './compatibility/grid-attrs';

import type { BlockDetail } from '../block-card/block-states/types';
import {
	isInvalidCompatibilityRun,
	mergeWPCompatibility,
	sanitizeWPCompatibilityAttributes,
} from '../utils';
import {
	registerHideCoreLayoutToolbarDom,
	registerHideCoreLayoutToolbarSupports,
} from './hide-core-layout-toolbar';

export const bootstrap = (): void => {
	registerHideCoreLayoutToolbarSupports();
	registerHideCoreLayoutToolbarDom();

	addFilter(
		'blockera.blockEdit.attributes',
		'blockera.blockEdit.layoutExtension.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			const {
				blockId,
				blockAttributes,
				activeBlockVariation,
				insideBlockInspector,
				editorSelectedBlockEvent,
			} = blockDetail;

			//
			// Display compatibility
			//
			attributes = displayFromWPCompatibility({
				attributes,
				blockId,
				defaultValue: blockAttributes.blockeraDisplay.default,
				//$FlowFixMe
				activeVariation: activeBlockVariation?.name,
			});

			attributes = gridAttrsFromWPCompatibility({
				attributes,
			});

			//
			// Flex wrap compatibility
			//
			attributes = flexWrapFromWPCompatibility({
				attributes,
			});

			//
			// direction compatibility
			//
			attributes = directionFromWPCompatibility({
				attributes,
				blockId,
				//$FlowFixMe
				activeVariation: activeBlockVariation?.name,
			});

			//
			// Align items compatibility
			//
			attributes = alignItemsFromWPCompatibility({
				attributes,
			});

			//
			// Justify content compatibility
			//
			attributes = justifyContentFromWPCompatibility({
				attributes,
			});

			//
			// Block gap compatibility
			//
			attributes = gapFromWPCompatibility({
				attributes,
				insideBlockInspector,
				editorSelectedBlockEvent,
			});

			//
			// Spacing compatibility (padding and margin)
			//
			attributes = spacingFromWPCompatibility({
				attributes,
				insideBlockInspector,
				editorSelectedBlockEvent,
			});

			return sanitizeWPCompatibilityAttributes(attributes, blockDetail);
		}
	);

	addFilter(
		'blockera.blockEdit.setAttributes',
		'blockera.blockEdit.layoutExtension.bootstrap.setAttributes',
		/**
		 * Retrieve block attributes with WordPress compatibilities.
		 *
		 * @callback getAttributes
		 *
		 * @param {Object} nextState The block attributes changed with blockera feature newValue and latest version of block state.
		 * @param {string} featureId The blockera feature identifier.
		 * @param {*} newValue The newValue sets to feature.
		 * @param {ControlContextRefCurrent} ref The reference of control context action occurred.
		 * @param {getAttributes} getAttributes The getter block attributes.
		 * @param {blockDetail} blockDetail detail of current block
		 *
		 * @return {Object|{}} The retrieve updated block attributes with all of wp compatibilities.
		 */
		(
			nextState: Object,
			featureId: string,
			newValue: any,
			ref: ControlContextRefCurrent,
			getAttributes: () => Object,
			blockDetail: BlockDetail
		): Object => {
			const {
				blockId,
				blockAttributes,
				activeBlockVariation,
				insideBlockInspector,
				editorSelectedBlockEvent,
			} = blockDetail;

			if (isInvalidCompatibilityRun(blockDetail, ref)) {
				return nextState;
			}

			switch (featureId) {
				case 'blockeraSpacing':
					return mergeWPCompatibility(
						nextState,
						spacingToWPCompatibility({
							newValue,
							ref,
							insideBlockInspector,
							editorSelectedBlockEvent,
						}),
						blockDetail
					);

				case 'blockeraDisplay':
					return mergeWPCompatibility(
						nextState,
						displayToWPCompatibility({
							newValue,
							ref,
							blockId,
							//$FlowFixMe
							activeVariation: activeBlockVariation?.name,
							getAttributes,
						}),
						blockDetail
					);

				case 'blockeraGridMinimumColumnWidth':
					return mergeWPCompatibility(
						nextState,
						{
							...(gridMinimumColumnWidthToWPCompatibility({
								newValue,
								blockId,
								getAttributes,
							}) ?? {}),
							forceUpdated: ['layout'],
						},
						blockDetail
					);

				case 'blockeraGridColumnCount':
					return mergeWPCompatibility(
						nextState,
						{
							...(gridColumnCountToWPCompatibility({
								newValue,
								blockId,
								getAttributes,
							}) ?? {}),
							forceUpdated: ['layout'],
						},
						blockDetail
					);

				case 'blockeraFlexWrap':
					return mergeWPCompatibility(
						nextState,
						flexWrapToWPCompatibility({
							newValue,
							ref,
						}),
						blockDetail
					);

				case 'blockeraFlexLayout':
					return mergeWPCompatibility(
						nextState,
						flexLayoutToWPCompatibility({
							newValue,
							ref,
							defaultValue:
								blockAttributes?.blockeraFlexLayout?.default,
						}),
						blockDetail
					);

				case 'blockeraGap':
					return mergeWPCompatibility(
						nextState,
						gapToWPCompatibility({
							newValue,
							ref,
							defaultValue: blockAttributes?.blockeraGap?.default,
							blockId,
							insideBlockInspector,
							editorSelectedBlockEvent,
						}),
						blockDetail
					);
			}

			return nextState;
		}
	);
};
