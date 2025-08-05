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
import { default as featuresLibrary } from '../../features';
import { default as featuresStack } from '../../features-config';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../store/constants';
import {
	getIconAttributes,
	addIconClassName,
	removeIconClassName,
} from '@blockera/feature-icon';

export const blockeraEditorFilters = () => {
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
					!block?.blockFeatures[featureId] ||
					!featureObject?.isEnabled()
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
				...(Object.keys(blockeraInnerBlocks)?.length
					? { blockeraInnerBlocks }
					: {}),
				...(Object.keys(availableBlockStates)?.length
					? { availableBlockStates }
					: {}),
			});
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
