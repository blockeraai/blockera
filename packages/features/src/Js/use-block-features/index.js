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
	TBlockFeatures,
	TToolbarControls,
	TCalculatedFeatures,
	TUseBlockFeaturesProps,
	TContextualToolbarComponents,
} from '../types';
import { default as featuresLibrary } from '../../Library';

export const useBlockFeatures = (
	props: TUseBlockFeaturesProps
): TBlockFeatures => {
	const { featuresStack } = featuresLibrary;

	if ('undefined' === typeof props?.blockFeatures) {
		props.blockFeatures = {
			hasSideEffect: false,
			hasContextualToolbar: {
				enabled: false,
				type: 'none',
			},
		};
	}
	const { getFeatures } = select(STORE_NAME);
	const registeredFeatures = getFeatures();

	const {
		blockSideEffectFeatures,
		contextualToolbarFeatures,
	}: TCalculatedFeatures = useMemo((): TCalculatedFeatures => {
		const blockSideEffectFeatures: Array<TFeature> = [];
		const contextualToolbarFeatures: Array<TFeature> = [];

		for (const featureId in registeredFeatures) {
			const feature = registeredFeatures[featureId];
			const featureConfig = featuresStack[featureId];

			// If the feature is not registered, skip it.
			if (!featuresStack[featureId]) {
				continue;
			}
			// Check the feature available in feature blocks configuration.
			if (!Object.keys(featureConfig.blocks).includes(props.name)) {
				continue;
			}

			// Push to blockSideEffectFeatures if the feature has editBlockHTML.
			if ('function' === typeof feature.editBlockHTML) {
				if (feature.isEnabled()) {
					blockSideEffectFeatures.push(feature);
				}
			}

			// Push to contextualToolbarFeatures if the feature has toolbarControls or ToolbarButtonComponent.
			if (feature.toolbarControls || feature.ToolbarButtonComponent) {
				if (feature.isEnabled()) {
					contextualToolbarFeatures.push(feature);
				}
			}
		}

		return { blockSideEffectFeatures, contextualToolbarFeatures };
	}, [registeredFeatures, props]);

	const ContextualToolbarComponents: TContextualToolbarComponents = () => {
		const { enabled, type } = props?.blockFeatures
			?.hasContextualToolbar || {
			enabled: false,
			type: 'none',
		};

		if (!enabled) {
			return null;
		}

		if ('dropdown' === type) {
			const controls: TToolbarControls = contextualToolbarFeatures
				.filter(
					(feature: TFeature): boolean => !!feature?.toolbarControls
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
			return (
				<BlockControls>
					<ToolbarDropdownMenu
						icon="ellipsis"
						label="Blockera Block Features"
						controls={controls}
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
						<feature.ToolbarButtonComponent key={feature.name} />
					);
				}

				return <></>;
			}
		);

		return (
			<BlockControls>
				<ToolbarGroup>{components}</ToolbarGroup>
			</BlockControls>
		);
	};

	useEffect((): void => {
		if (!props?.blockFeatures?.hasSideEffect) {
			return;
		}

		blockSideEffectFeatures.forEach((feature: TFeature) => {
			if ('function' !== typeof feature.editBlockHTML) {
				return;
			}

			// Remove redundant params.
			const { blockFeatures, ...rest } = props;

			feature.editBlockHTML({ ...rest });
		});
	}, [blockSideEffectFeatures, props]);

	return {
		ContextualToolbarComponents,
	};
};
