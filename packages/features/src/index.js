// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import featuresStack from './Library';
import { STORE_NAME } from './Js/store';
import type { TFeature } from './Js/types';
import { blockeraEditorFilters } from './Hooks';

export const unstableBootstrapServerSideFeatures = (
	features: Array<string>
): void => {
	for (const featureId of features) {
		// While we are in the server side, we need to check if the feature is supported.
		if (!featuresStack.hasOwnProperty(featureId)) {
			continue;
		}

		const standardFeature: TFeature = {
			name: featureId,
			...featuresStack[featureId],
		};

		dispatch(STORE_NAME).registerFeature(standardFeature);
	}
};

export const bootstrapEditorStyleEngineFilters = () => {
	addFilter(
		'blockera.editor.styleEngine.generators',
		'blockera.editor.styleEngine.generators',
		(styleGenerators) => {
			const { getFeatures } = select(STORE_NAME);
			const registeredFeatures = getFeatures();

			for (const featureId in registeredFeatures) {
				const featureObject = featuresStack[featureId];

				if ('function' === typeof featureObject?.styleGenerator) {
					styleGenerators[featureId] = featureObject.styleGenerator;
				}
			}

			return styleGenerators;
		}
	);
};

export const featuresApplyHooks = () => {
	blockeraEditorFilters();
};
export * from './Js/components';
export * from './Js/use-block-features';
