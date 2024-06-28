// @flow

/**
 * External dependencies
 */
// import { dispatch } from '@wordpress/data';
// import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
// import { heading } from './heading';
// import * as config from '../../base/config';
// import { STORE_NAME } from '../../base/store/constants';

// export const definitionTypes = {
// 	heading: {
// 		...config,
// 		backgroundConfig: {
// 			...config.backgroundConfig,
// 			...heading,
// 		},
// 	},
// };

// export const __experimentalRegistrationInnerBlockExtensionCustomConfigDefinition =
// 	(): void => {
// 		/**
// 		 * Filterable definitionTypes list before registration process.
// 		 *
// 		 * hook: `blockeraCore.extensions.innerBlocks.definitionTypes`
// 		 *
// 		 * @since 1.0.0
// 		 *
// 		 * @type {Object}
// 		 */
// 		const filteredDefinitions = applyFilters(
// 			'blockeraCore.extensions.innerBlocks.definitionTypes',
// 			definitionTypes
// 		);

// 		Object.keys(filteredDefinitions).forEach((name: string): void => {
// 			const { addDefinition } = dispatch(STORE_NAME);

// 			addDefinition({
// 				name,
// 				extensions: filteredDefinitions[name],
// 			});
// 		});
// 	};
