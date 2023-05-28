/**
 * Internal dependencies
 */
import helpers from './helpers';
import extension from './field.json';
import { BoxShadowControl, LabelControl } from '@publisher/controls';
import { injectHelpersToCssGenerators } from '@publisher/style-engine';
import { fieldsClassNames } from '@publisher/classnames';

export default {
	...extension,
	publisherCssGenerators: {
		...extension.publisherCssGenerators,
		...injectHelpersToCssGenerators(helpers, extension.cssGenerators),
	},
	edit: ({ name: blockName, field: { label }, ...props }) => {
		return (
			<div className={fieldsClassNames('angle-picker', '2-column')}>
				<LabelControl label={label} />

				<div className={fieldsClassNames('controls')}>
					<BoxShadowControl {...props} blockName={blockName} />
				</div>
			</div>
		);
	},
};
