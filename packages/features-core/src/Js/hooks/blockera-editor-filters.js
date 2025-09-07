// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { select, dispatch } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';
import {
	getIconAttributes,
	addIconClassName,
	removeIconClassName,
} from '@blockera/feature-icon';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../store/constants';
import { default as featuresLibrary } from '../../features';
import { default as featuresStack } from '../../features-config';

const MapProcessedBlockSettings: Map<string, boolean> = new Map();

export const blockeraEditorFilters = () => {
	addFilter(
		'blockera.editor.extensions.mergeBlockSettings',
		'blockera.features.prepareInnerBlockTypes',
		(block, originalBlock) => {
			if (MapProcessedBlockSettings.has(block.targetBlock)) {
				return block;
			}

			MapProcessedBlockSettings.set(block.targetBlock, true);

			const blockeraInnerBlocks = block?.blockeraInnerBlocks || {};
			const availableBlockStates = block?.availableBlockStates || {};
			const { getFeatures } = select(STORE_NAME);
			const registeredFeatures = getFeatures();
			const { updateBlockExtensions } = dispatch('blockera/extensions');

			const blockFeatures = mergeObject(
				block?.blockFeatures || {},
				originalBlock?.supports?.blockFeatures || {}
			);

			for (const featureId in featuresLibrary) {
				const featureObject = registeredFeatures[featureId];

				if (
					!featureObject ||
					!featureObject?.isEnabled() ||
					!blockFeatures ||
					!blockFeatures[featureId] ||
					!blockFeatures[featureId]?.status
				) {
					continue;
				}

				const { block: blockFeaturesSchema = {} } =
					featuresStack[featureId];

				const featureBlockConfig = mergeObject(
					blockFeaturesSchema,
					blockFeatures[featureId]
				);

				if (!featureObject.isEnabled(featureBlockConfig.status)) {
					continue;
				}

				if (
					featureBlockConfig?.status &&
					featureBlockConfig?.inspector?.status &&
					featureBlockConfig?.inspector?.innerBlocks?.status &&
					0 <
						Object.keys(
							featureBlockConfig?.inspector?.innerBlocks?.items
						).length
				) {
					for (const innerBlockId in featureBlockConfig?.inspector
						?.innerBlocks?.items) {
						const innerBlockObject = mergeObject(
							blockFeaturesSchema?.inspector?.innerBlocks?.items[
								innerBlockId
							] || {},
							blockFeatures[featureId]?.inspector?.innerBlocks
								?.items[innerBlockId] || {},
							{
								forceUpdated: blockFeatures[featureId]
									?.inspector?.innerBlocks?.items[
									innerBlockId
								]?.availableBlockStates
									? ['availableBlockStates']
									: [],
							}
						);

						blockeraInnerBlocks[innerBlockId] = mergeObject(
							blockeraInnerBlocks[innerBlockId] ?? {},
							innerBlockObject,
							{
								forceUpdated: ['availableBlockStates'],
							}
						);
					}
				}

				if (
					featureBlockConfig?.status &&
					featureBlockConfig?.inspector?.blockStates?.status &&
					0 <
						Object.keys(
							featureBlockConfig?.inspector?.blockStates?.items
						).length
				) {
					for (const blockStateId in featureBlockConfig?.inspector
						?.blockStates?.items) {
						const blockStateObject = mergeObject(
							blockFeaturesSchema?.inspector?.blockStates?.items[
								blockStateId
							] || {},
							blockFeatures[featureId]?.inspector?.blockStates
								?.items[blockStateId] || {},
							{
								forceUpdated: blockFeatures[featureId]
									?.inspector?.blockStates?.items[
									blockStateId
								]?.availableBlockStates
									? ['availableBlockStates']
									: [],
							}
						);

						availableBlockStates[blockStateId] = mergeObject(
							availableBlockStates[blockStateId] ?? {},
							blockStateObject
						);
					}
				}
			}

			const updatedBlockExtension = mergeObject(block, {
				...(Object.keys(blockeraInnerBlocks)?.length
					? { blockeraInnerBlocks }
					: {}),
				...(Object.keys(availableBlockStates)?.length
					? { availableBlockStates }
					: {}),
			});

			updateBlockExtensions(updatedBlockExtension);

			return updatedBlockExtension;
		}
	);

	const filterExtensionsSupports = (extensionsSupports) => {
		const newExtensionsSupports = {};
		const { getFeatures } = select(STORE_NAME);
		const registeredFeatures = getFeatures();

		for (const featureId in featuresLibrary) {
			const featureObject = registeredFeatures[featureId];

			if (
				!featureObject?.isEnabled() ||
				!featureObject?.extensionSupports ||
				!featureObject?.extensionSupportId
			) {
				continue;
			}

			if (extensionsSupports[featureObject.extensionSupportId]) {
				newExtensionsSupports[featureObject.extensionSupportId] =
					mergeObject(
						extensionsSupports[featureObject.extensionSupportId],
						featureObject.extensionSupports[
							featureObject.extensionSupportId
						]
					);
			} else {
				newExtensionsSupports[featureObject.extensionSupportId] =
					featureObject.extensionSupports;
			}
		}

		return mergeObject(extensionsSupports, newExtensionsSupports);
	};

	addFilter(
		'blockera.extensions.supports.configuration',
		'blockera.features.extensionsSupports.filter',
		filterExtensionsSupports
	);

	addFilter(
		'blockera.extensions.innerBlocks.config',
		'blockera.features.extensionsInnerBlocks.config',
		filterExtensionsSupports
	);

	addFilter(
		'blockera.editor.useAttributes.beforeChangeAttributes',
		'blockera.features.useAttributes.beforeChangeAttributes',
		(attributes, attributeId, newValue) => {
			if (getIconAttributes().includes(attributeId)) {
				if (attributeId === 'blockeraIcon') {
					if (newValue?.icon || newValue?.uploadSVG) {
						attributes = addIconClassName(attributes, {
							blockeraIcon: newValue,
							blockeraIconPosition:
								attributes.blockeraIconPosition?.value,
						});
					} else {
						attributes = removeIconClassName(attributes);
					}
				}

				if (attributeId === 'blockeraIconPosition') {
					attributes = addIconClassName(attributes, {
						blockeraIcon: attributes.blockeraIcon,
						blockeraIconPosition: newValue,
					});
				}
			}

			return attributes;
		}
	);
};
