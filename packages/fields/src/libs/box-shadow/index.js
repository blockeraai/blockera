/**
 * Internal dependencies
 */
import helpers from './helpers';
import extension from './field.json';
import { BoxShadowControl, LabelControl } from '@publisher/controls';
import { injectHelpersToCssGenerators } from '@publisher/style-engine';

export default {
	...extension,
	publisherCssGenerators: {
		...extension.publisherCssGenerators,
		...injectHelpersToCssGenerators(helpers, extension.cssGenerators),
	},
	edit: ({ name: blockName, label, ...props }) => {
		return (
			<>
				<LabelControl label={label} />
				<BoxShadowControl {...props} blockName={blockName} />
			</>
		);
	},
};
