// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { Fill } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */

import { STORE_NAME } from '../store/constants';
import { default as featuresLibrary } from '../../Library';
import type { TExtensionSlotFillProps } from '../types';
import { default as featuresSchemas } from '../../Library/schemas';

export const ExtensionSlotFill = (props: TExtensionSlotFillProps) => {
	const { getFeatures } = select(STORE_NAME);
	const registeredFeatures = getFeatures();

	const mappedExtensions = useMemo(() => {
		const mapped = [];

		for (const featureId in featuresLibrary) {
			const feature = featuresLibrary[featureId];

			if (!registeredFeatures[featureId]) {
				continue;
			}

			const featureSchema = featuresSchemas[featureId];
			featureSchema.block.inspector = {
				status: featureSchema.block.inspector?.status,
				extensions: {
					[featureId]: {
						tabPosition: featureSchema.block.inspector?.tabPosition,
					},
				},
				...featureSchema.block.inspector,
			};
			const featureBlockConfig = mergeObject(
				featureSchema?.block || {},
				props?.blockFeatures?.[featureId] || {}
			);

			if (!feature.isEnabled(featureBlockConfig.status)) {
				continue;
			}

			if (
				!featureBlockConfig?.inspector?.status ||
				!featureBlockConfig?.inspector?.extensions[featureId] ||
				!featureBlockConfig?.inspector?.extensions[featureId]
					?.tabPosition
			) {
				continue;
			}

			const ExtensionComponent = feature?.ExtensionComponent;

			if (!ExtensionComponent) {
				continue;
			}

			const { settings, ...rest } = props;

			mapped.push({
				slotName:
					featureBlockConfig?.inspector?.extensions[featureId]
						?.tabPosition,
				id: featureId,
				Component: ExtensionComponent,
				extensionProps: {
					...rest,
					[feature.extensionConfigId]:
						settings[feature.extensionConfigId],
				},
			});
		}

		return mapped;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props]);

	if (!mappedExtensions.length) {
		return <></>;
	}

	return (
		<>
			{mappedExtensions.map(
				({ id, slotName, Component, extensionProps }, index) => {
					return (
						<Fill name={slotName} key={`${id}-${index}`}>
							<Component
								{...extensionProps}
								key={`${id}-${index}`}
							/>
						</Fill>
					);
				}
			)}
		</>
	);
};
