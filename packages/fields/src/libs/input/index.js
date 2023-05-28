/**
 * Internal dependencies
 */
import helpers from './helpers';
import extension from './field.json';
import { RangeControl } from '@publisher/controls';
import { injectHelpersToCssGenerators } from '@publisher/style-engine';

export default {
	...extension,
	publisherCssGenerators: {
		...extension.publisherCssGenerators,
		...injectHelpersToCssGenerators(helpers, extension.cssGenerators),
	},
	edit: ({ name, ...props }) => {
		return (
			<>
				<RangeControl {...props} blockName={name} />
			</>
		);
	},
};
