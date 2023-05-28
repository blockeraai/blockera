/**
 * Internal dependencies
 */
import helpers from './helpers';
import extension from './field.json';
import { AnglePickerControl, LabelControl } from '@publisher/controls';
import { injectHelpersToCssGenerators } from '@publisher/style-engine';

export default {
	...extension,
	publisherCssGenerators: {
		...extension.publisherCssGenerators,
		...injectHelpersToCssGenerators(helpers, extension.cssGenerators),
	},
	edit: ({ name, field: { label }, ...props }) => {
		return (
			<>
				<LabelControl label={label} />
				<AnglePickerControl {...props} blockName={name} />
			</>
		);
	},
};
