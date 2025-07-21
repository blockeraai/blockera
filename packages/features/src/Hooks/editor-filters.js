// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../Js/store/constants';
import { default as featuresLibrary } from '../Library';
import { default as featuresStack } from '../Library/config';

export const editorApplyHooks = () => {
	addFilter(
		'blockera.blocks.register',
		'blockera.features.prepareInnerBlockTypes',
		(block) => {
			const blockeraInnerBlocks = block?.blockeraInnerBlocks || {};
			const availableBlockStates = block?.availableBlockStates || {};
			const { getFeatures } = select(STORE_NAME);
			const registeredFeatures = getFeatures();

			for (const featureId in featuresLibrary) {
				const featureObject = registeredFeatures[featureId];

				if (
					!featureObject ||
					!block?.blockFeatures ||
					!block?.blockFeatures[featureId]
				) {
					continue;
				}

				const { block: blockFeature } = featuresStack[featureId];

				if (
					blockFeature?.status &&
					blockFeature?.innerBlocks?.status &&
					0 < Object.keys(blockFeature?.innerBlocks?.items).length
				) {
					for (const innerBlockId in blockFeature?.innerBlocks
						?.items) {
						const innerBlockObject =
							blockFeature?.innerBlocks?.items[innerBlockId];

						blockeraInnerBlocks[innerBlockId] = mergeObject(
							blockeraInnerBlocks[innerBlockId] ?? {},
							innerBlockObject
						);
					}
				}

				if (
					blockFeature?.status &&
					blockFeature?.blockStates?.status &&
					0 < Object.keys(blockFeature?.blockStates?.items).length
				) {
					for (const blockStateId in blockFeature?.blockStates
						?.items) {
						const blockStateObject =
							blockFeature?.blockStates?.items[blockStateId];

						availableBlockStates[blockStateId] = mergeObject(
							availableBlockStates[blockStateId] ?? {},
							blockStateObject
						);
					}
				}
			}

			return mergeObject(block, {
				blockeraInnerBlocks,
				availableBlockStates,
			});
		}
	);
};
