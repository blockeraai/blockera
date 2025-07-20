// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { useEffect, useMemo } from '@wordpress/element';
import { BlockControls } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarDropdownMenu } from '@wordpress/components';

/**
 * Internal dependencies
 */
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

export const useBlockFeatures = (
	props: TUseBlockFeaturesProps
): TBlockFeaturesHookValue => {
	const { getFeatures } = select(STORE_NAME);
	const registeredFeatures = getFeatures();

	const {
		blockSideEffectFeatures,
		contextualToolbarFeatures,
	}: TCalculatedFeatures = useMemo((): TCalculatedFeatures => {
		const blockSideEffectFeatures: Array<TFeature> = [];
		const contextualToolbarFeatures: Array<TFeature> = [];

		if (!props?.blockFeatures) {
			return { blockSideEffectFeatures, contextualToolbarFeatures };
		}

		for (const featureId in registeredFeatures) {
			const feature = registeredFeatures[featureId];

			// If the feature is not registered, skip it.
			if (!featuresLibrary[featureId]) {
				continue;
			}
			// Check the feature available in htmlEditable context of blocks features configuration.
			if (props?.blockFeatures[featureId]?.htmlEditable?.status) {
				// Push to blockSideEffectFeatures if the feature has editBlockHTML.
				if ('function' === typeof feature?.editBlockHTML) {
					if (feature.isEnabled()) {
						blockSideEffectFeatures.push(feature);
					}
				}
			}

			// Check the feature context available in contextualToolbar context of blocks features configuration.
			if (props?.blockFeatures[featureId]?.contextualToolbar?.status) {
				// Push to contextualToolbarFeatures if the feature has toolbarControls or ToolbarButtonComponent.
				if (
					feature?.toolbarControls ||
					feature?.ToolbarButtonComponent
				) {
					if (feature.isEnabled()) {
						contextualToolbarFeatures.push(feature);
					}
				}
			}
		}

		return { blockSideEffectFeatures, contextualToolbarFeatures };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [registeredFeatures, props]);

	const ContextualToolbarComponents: TContextualToolbarComponents = () => {
		const mappedChildren = [];

		contextualToolbarFeatures.forEach(
			(feature: TFeature, index: number) => {
				if (!feature?.toolbarControls?.length) {
					return <></>;
				}

				const { type = 'none' } =
					props?.blockFeatures[feature.name].contextualToolbar;

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

			feature.editBlockHTML({
				...rest,
				iconConfig: blockFeatures[feature.name].htmlEditable,
			});
		});
	}, [blockSideEffectFeatures, props]);

	return {
		ContextualToolbarComponents,
	};
};
