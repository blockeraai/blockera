// @flow

/**
 * External dependencies
 */
import { useMemo } from '@wordpress/element';
import { Fill } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { default as Library } from '../../Library';
import type { TExtensionSlotFillProps } from '../types';
import { default as featuresSchemas } from '../../Library/schemas';

export const ExtensionSlotFill = (props: TExtensionSlotFillProps) => {
	const mappedExtensions = useMemo(() => {
		const mapped = [];

		for (const featureId in Library) {
			const feature = Library[featureId];

			const featureSchema = featuresSchemas[featureId];
			const featureBlockConfig = mergeObject(
				featureSchema.block,
				props.blockFeatures[featureId]
			);

			if (!feature.isEnabled(featureBlockConfig.status)) {
				continue;
			}

			if (
				!props?.blockFeatures ||
				!props?.blockFeatures[featureId]?.inspector?.status ||
				!props?.blockFeatures[featureId]?.inspector?.extensions[
					featureId
				] ||
				!props?.blockFeatures[featureId]?.inspector?.extensions[
					featureId
				]?.tabPosition
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
					props?.blockFeatures[featureId]?.inspector?.extensions[
						featureId
					]?.tabPosition,
				id: featureId,
				UI: () => (
					<ExtensionComponent
						key={featureId}
						{...{
							...rest,
							[feature.extensionConfigId]:
								settings[feature.extensionConfigId],
						}}
					/>
				),
			});
		}

		return mapped;
	}, [props]);

	if (!mappedExtensions.length) {
		return <></>;
	}

	return (
		<>
			{mappedExtensions.map(({ id, slotName, UI }, index) => {
				return (
					<Fill name={slotName} key={`${id}-${index}`}>
						<UI />
					</Fill>
				);
			})}
		</>
	);
};
