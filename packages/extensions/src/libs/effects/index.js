/**
 * Internal dependencies
 */
// import helpers from './helpers';
import extension from './extension.json';
// import {
// 	injectHelpersToCssGenerators,
// 	computedCssRules,
// } from '@publisher/style-engine';

export default {
	...extension,
	// publisherCssGenerators: {
	// 	...extension.publisherCssGenerators,
	// 	...injectHelpersToCssGenerators(
	// 		helpers,
	// 		extension.publisherCssGenerators
	// 	),
	// },
	edit: ({ children }) => {
		return <div>{children}</div>;
	},
};
