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
import { featuresConfig } from './index';
import { STORE_NAME } from '../store/constants';
import type {
	TFeature,
	TBlockFeatures,
	TToolbarControls,
	TCalculatedFeatures,
	TContextualToolbarComponents,
} from '../types';

export const useBlockFeatures = (props: {
	name: string,
	clientId: string,
	attributes: Object,
	blockRefId: { current: HTMLElement },
	config?: {
		hasSideEffect: boolean,
		hasContextualToolbar: boolean,
	},
}): TBlockFeatures => {
	if (!props?.config) {
		props.config = {
			hasSideEffect: true,
			hasContextualToolbar: true,
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
			const featureConfig = featuresConfig[featureId];

			// If the feature is not registered, skip it.
			if (!featuresConfig[featureId]) {
				continue;
			}
			// Check the feature available in feature blocks configuration.
			if (!Object.keys(featureConfig.blocks).includes(props.name)) {
				continue;
			}

			// Push to blockSideEffectFeatures if the feature has editBlockHTML,
			// and the blockSideEffect is enabled.
			if (
				'function' === typeof feature.editBlockHTML &&
				props.config?.hasSideEffect
			) {
				if (feature.isEnabled()) {
					blockSideEffectFeatures.push(feature);
				}
			}

			// Push to contextualToolbarFeatures if the feature has toolbarControls or ToolbarButtonComponent,
			// and the contextualToolbar is enabled.
			if (
				(feature.toolbarControls || feature.ToolbarButtonComponent) &&
				props.config?.hasContextualToolbar
			) {
				if (feature.isEnabled()) {
					contextualToolbarFeatures.push(feature);
				}
			}
		}

		return { blockSideEffectFeatures, contextualToolbarFeatures };
	}, [registeredFeatures, props]);

	const ContextualToolbarComponents: TContextualToolbarComponents = ({
		isDropDownMenu = false,
	}) => {
		if (isDropDownMenu) {
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

	useEffect(
		(): void =>
			blockSideEffectFeatures.forEach((feature: TFeature) => {
				if ('function' !== typeof feature.editBlockHTML) {
					return;
				}

				const { config, ...rest } = props;

				feature.editBlockHTML({ ...rest });
			}),
		[blockSideEffectFeatures, props]
	);

	return {
		ContextualToolbarComponents,
	};
};
