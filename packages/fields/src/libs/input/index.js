/**
 * Internal dependencies
 */
import helpers from './helpers';
import extension from './field.json';
import { InputControl, LabelControl, RangeControl } from '@publisher/controls';
import { injectHelpersToCssGenerators } from '@publisher/style-engine';
import { fieldsClassNames } from '@publisher/classnames';

export default {
	...extension,
	publisherCssGenerators: {
		...extension.publisherCssGenerators,
		...injectHelpersToCssGenerators(helpers, extension.cssGenerators),
	},
	edit: ({ name, field: { label, settings }, ...props }) => {
		return (
			<div className={fieldsClassNames('input', '2-column')}>
				<LabelControl label={label} />

				<div className={fieldsClassNames('controls')}>
					{'range' === settings?.type && (
						<RangeControl {...props} blockName={name} />
					)}
					{'text' === settings?.type && (
						<InputControl {...props} blockName={name} />
					)}
				</div>
			</div>
		);
	},
};
