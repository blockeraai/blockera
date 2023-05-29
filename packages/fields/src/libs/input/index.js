/**
 * Internal dependencies
 */
import helpers from './helpers';
import field from './field.json';
import { InputControl, LabelControl, RangeControl } from '@publisher/controls';
import { injectHelpersToCssGenerators } from '@publisher/style-engine';
import { fieldsClassNames, fieldsInnerClassNames } from '@publisher/classnames';

export default {
	...field,
	publisherCssGenerators: {
		...field.publisherCssGenerators,
		...injectHelpersToCssGenerators(helpers, field.cssGenerators),
	},
	edit: ({ name, field: { label, settings }, className, ...props }) => {
		return (
			<div
				className={fieldsClassNames(
					'input',
					label !== '' ? 'columns-2' : 'columns-1'
				)}
			>
				{label && (
					<div className={fieldsInnerClassNames('label')}>
						<LabelControl label={label} />
					</div>
				)}

				<div className={fieldsInnerClassNames('control')}>
					{'range' === settings?.type && (
						<RangeControl
							{...props}
							{...settings}
							blockName={name}
							withInputField={true}
						/>
					)}
					{'text' === settings?.type && (
						<InputControl
							{...props}
							{...settings}
							blockName={name}
						/>
					)}
				</div>
			</div>
		);
	},
};
