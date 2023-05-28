/**
 * Internal dependencies
 */
import helpers from './helpers';
import field from './field.json';
import { AnglePickerControl, LabelControl } from '@publisher/controls';
import { injectHelpersToCssGenerators } from '@publisher/style-engine';
import { fieldsClassNames, fieldsInnerClassNames } from '@publisher/classnames';

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
					'angle-picker',
					label !== '' ? '2-column' : '1-column'
				)}
			>
				{label && (
					<div className={fieldsInnerClassNames('label')}>
						<LabelControl label={label} />
					</div>
				)}

				<div className={fieldsClassNames('control')}>
					<AnglePickerControl {...props} blockName={name} />
				</div>
			</div>
		);
	},
};
