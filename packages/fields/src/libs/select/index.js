/**
 * Internal dependencies
 */
import helpers from './helpers';
import field from './field.json';
import { SelectControl } from '@publisher/controls';
import { injectHelpersToCssGenerators } from '@publisher/style-engine';
import { fieldsClassNames, fieldsInnerClassNames } from '@publisher/classnames';

export default {
	...field,
	publisherCssGenerators: {
		...field.publisherCssGenerators,
		...injectHelpersToCssGenerators(helpers, field.cssGenerators),
	},
	edit: ({ name, field: { label, options }, ...props }) => {
		return (
			<div
				className={fieldsClassNames(
					'select',
					label !== '' ? 'columns-2' : 'columns-1'
				)}
			>
				<div className={fieldsInnerClassNames('control')}>
					<SelectControl {...props} options={options} />
				</div>
			</div>
		);
	},
};
