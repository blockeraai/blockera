// @flow

/**
 * External dependencies
 */
import { type MixedElement } from 'react';
import { useMemo } from '@wordpress/element';
import { Fill } from '@wordpress/components';
import { select, useSelect } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */

import { STORE_NAME } from '../store/constants';
import type { TExtensionSlotFillProps } from '../types';
import { default as featuresLibrary } from '../../features';
import { default as featuresSchemas } from '../../features-config';

export const ExtensionSlotFill = (
	props: TExtensionSlotFillProps
): MixedElement => {
	const { getFeatures } = select(STORE_NAME);
	const registeredFeatures = getFeatures();
	const { getBlockType } = select('core/blocks');
	const blockType = getBlockType(props.block.blockName);
	const blockFeatures = mergeObject(
		blockType?.supports?.blockFeatures || {},
		props?.blockFeatures
	);

	// Using Blockera's extensions store
	const { activeBlockVariation } = useSelect(
		(select) => {
			const { getActiveBlockVariation, getBlockVariations } =
				select('core/blocks');
			const { getBlockName, getBlockAttributes } =
				select('core/block-editor');

			const name = getBlockName(props.block.clientId);

			return {
				activeBlockVariation: getActiveBlockVariation(
					name,
					getBlockAttributes(props.block.clientId)
				),
				blockVariations: name && getBlockVariations(name, 'transform'),
			};
		},
		[props.block.clientId]
	);

	const mappedExtensions = useMemo(() => {
		const mapped = [];

		for (const featureId in featuresLibrary) {
			const feature = featuresLibrary[featureId];

			if (!registeredFeatures[featureId] || !blockFeatures?.[featureId]) {
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
				blockFeatures[featureId]
			);

			if (!feature.isEnabled(featureBlockConfig.status)) {
				continue;
			}

			if (
				featureBlockConfig?.context?.length > 0 &&
				!featureBlockConfig?.context?.includes(
					props?.block?.blockName
				) &&
				!featureBlockConfig?.context?.includes(
					activeBlockVariation?.name
				)
			) {
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
					block: {
						...props.block,
						activeBlockVariation,
					},
					[feature.extensionSupportId]:
						settings[feature.extensionSupportId],
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
