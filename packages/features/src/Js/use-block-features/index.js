// @flow

/**
 * External dependencies
 */
import { select, useSelect } from '@wordpress/data';
import { useEffect, useMemo } from '@wordpress/element';
import { BlockControls } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarDropdownMenu } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { mergeObject } from '@blockera/utils';
import { STORE_NAME } from '../store/constants';
import type {
	TFeature,
	TToolbarControls,
	TCalculatedFeatures,
	TUseBlockFeaturesProps,
	TBlockFeaturesHookValue,
	TContextualToolbarComponents,
} from '../types';
import { default as featuresLibrary } from '../../Library';
import { default as featuresSchemas } from '../../Library/config';

export const useBlockFeatures = (
	props: TUseBlockFeaturesProps
): TBlockFeaturesHookValue => {
	const { getFeatures } = select(STORE_NAME);
	const registeredFeatures = getFeatures();

	// Using Blockera's extensions store
	const { activeBlockVariation } = useSelect(
		(select) => {
			const { getActiveBlockVariation, getBlockVariations } =
				select('core/blocks');
			const { getBlockName, getBlockAttributes } =
				select('core/block-editor');

			const name = getBlockName(props.clientId);

			return {
				activeBlockVariation: getActiveBlockVariation(
					name,
					getBlockAttributes(props.clientId)
				),
				blockVariations: name && getBlockVariations(name, 'transform'),
			};
		},
		[props.clientId]
	);

	const {
		blockSideEffectFeatures,
		contextualToolbarFeatures,
		mappedFeatureUIComponents,
	}: TCalculatedFeatures = useMemo((): TCalculatedFeatures => {
		const mappedFeatureUIComponents: Array<ComponentType> = [];
		const blockSideEffectFeatures: Array<TFeature> = [];
		const contextualToolbarFeatures: Array<TFeature> = [];

		if (!Object.keys(props?.blockFeatures)?.length) {
			return {
				blockSideEffectFeatures,
				contextualToolbarFeatures,
				mappedFeatureUIComponents,
			};
		}

		for (const featureId in registeredFeatures) {
			const feature = registeredFeatures[featureId];

			// If the feature is not registered, skip it.
			if (
				!featuresLibrary[featureId] ||
				!props.blockFeatures[featureId]
			) {
				continue;
			}

			const featureSchema = featuresSchemas[featureId];
			const featureBlockConfig = mergeObject(
				featureSchema?.block || {},
				props.blockFeatures[featureId]
			);

			if (!feature.isEnabled(featureBlockConfig.status)) {
				continue;
			}

			// Check the feature available in htmlEditable context of blocks features configuration.
			if (featureBlockConfig?.htmlEditable?.status) {
				// Push to blockSideEffectFeatures if the feature has editBlockHTML.
				if ('function' === typeof feature?.editBlockHTML) {
					blockSideEffectFeatures.push(feature);
				}
			}

			// Check the feature context available in contextualToolbar context of blocks features configuration.
			if (featureBlockConfig?.contextualToolbar?.status) {
				// Push to contextualToolbarFeatures if the feature has toolbarControls or ToolbarButtonComponent.
				if (
					feature?.toolbarControls ||
					feature?.ToolbarButtonComponent
				) {
					contextualToolbarFeatures.push(feature);
				}
			}

			if (
				feature?.InlineStyleComponent &&
				featureBlockConfig?.context &&
				((activeBlockVariation &&
					featureBlockConfig.context.includes(
						activeBlockVariation?.name
					) &&
					activeBlockVariation.isActive(props.attributes)) ||
					(!activeBlockVariation &&
						featureBlockConfig.context.includes(props?.name)))
			) {
				mappedFeatureUIComponents.push(feature.InlineStyleComponent);
			}
		}

		return {
			blockSideEffectFeatures,
			contextualToolbarFeatures,
			mappedFeatureUIComponents,
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [registeredFeatures, props]);

	const ContextualToolbarComponents: TContextualToolbarComponents = () => {
		const mappedChildren = [];

		contextualToolbarFeatures.forEach(
			(feature: TFeature, index: number) => {
				if (!feature?.toolbarControls?.length) {
					return <></>;
				}

				const featureSchema = featuresSchemas[feature.name];
				const featureBlockConfig = mergeObject(
					featureSchema.block,
					props.blockFeatures[feature.name]
				);

				const { type = 'none' } = featureBlockConfig?.contextualToolbar;

				if ('dropdown' === type) {
					const controls: TToolbarControls = contextualToolbarFeatures
						.filter(
							(feature: TFeature): boolean =>
								!!feature?.toolbarControls
						)
						.reduce(
							(
								acc: TToolbarControls,
								feature: TFeature
							): TToolbarControls => {
								if (!feature.toolbarControls) {
									return acc;
								}

								return [...acc, ...feature.toolbarControls];
							},
							[]
						);

					// FIXME: Added the required props to the ToolbarDropdownMenu component.
					// We should provide the suitable label and icon for the ToolbarDropdownMenu component.
					mappedChildren.push(
						<BlockControls key={`${index}-${feature.name}`}>
							<ToolbarDropdownMenu
								icon="ellipsis"
								controls={controls}
								label="Blockera Block Features"
							/>
						</BlockControls>
					);
				}

				if ('button' !== type) {
					return null;
				}

				const components = contextualToolbarFeatures.map(
					(feature: TFeature) => {
						if (feature?.ToolbarButtonComponent) {
							return (
								<feature.ToolbarButtonComponent
									key={feature.name}
								/>
							);
						}

						return <></>;
					}
				);

				mappedChildren.push(
					<BlockControls key={`${index}-${feature.name}`}>
						<ToolbarGroup>{components}</ToolbarGroup>
					</BlockControls>
				);
			}
		);

		return mappedChildren;
	};

	useEffect((): void => {
		blockSideEffectFeatures.forEach((feature: TFeature) => {
			if ('function' !== typeof feature.editBlockHTML) {
				return;
			}

			// Remove redundant params.
			const { blockFeatures, ...rest } = props;

			const featureSchema = featuresSchemas[feature.name];
			const featureBlockConfig = mergeObject(
				featureSchema.block,
				blockFeatures[feature.name]
			);

			feature.editBlockHTML({
				...rest,
				htmlEditable: featureBlockConfig.htmlEditable,
			});
		});
	}, [blockSideEffectFeatures, props]);

	return {
		ContextualToolbarComponents,
		BlockFeaturesInlineStyles: (props) => {
			return mappedFeatureUIComponents.map((Component, index) => {
				return <Component key={index} {...props} />;
			});
		},
	};
};
