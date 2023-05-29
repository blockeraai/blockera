/**
 * Internal dependencies
 */
import helpers from './helpers';
import field from './field.json';
import { TransitionControl, LabelControl } from '@publisher/controls';
import { injectHelpersToCssGenerators } from '@publisher/style-engine';
import { fieldsClassNames } from '@publisher/classnames';

export default {
	...field,
	publisherCssGenerators: {
		...field.publisherCssGenerators,
		...injectHelpersToCssGenerators(helpers, field.cssGenerators),
	},
	edit: ({ name, field: { label }, ...props }) => {
		return (
			<div
				className={fieldsClassNames(
					'transition',
					label !== '' ? 'columns-2' : 'columns-1'
				)}
			>
				<LabelControl label={label} />

				<div className={fieldsClassNames('control')}>
					<TransitionControl {...props} blockName={name} />
				</div>
			</div>
		);
	},
};
