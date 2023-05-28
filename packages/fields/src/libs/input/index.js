/**
 * Internal dependencies
 */
import helpers from './helpers';
import extension from './field.json';
import { InputControl, LabelControl, RangeControl } from '@publisher/controls';
import { injectHelpersToCssGenerators } from '@publisher/style-engine';

export default {
	...extension,
	publisherCssGenerators: {
		...extension.publisherCssGenerators,
		...injectHelpersToCssGenerators(helpers, extension.cssGenerators),
	},
	edit: ({ name, field: { label, settings }, ...props }) => {
		return (
			<>
				<LabelControl label={label} />
				{'range' === settings?.type && (
					<RangeControl {...props} blockName={name} />
				)}
				{'text' === settings?.type && (
					<InputControl {...props} blockName={name} />
				)}
			</>
		);
	},
};
