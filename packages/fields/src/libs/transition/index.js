/**
 * Internal dependencies
 */
import helpers from './helpers';
import field from './field.json';
import { TransitionControl } from '@publisher/controls';
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
					'transition',
					label !== '' ? 'columns-2' : 'columns-1'
				)}
			>
				<div className={fieldsInnerClassNames('control')}>
					<TransitionControl
						{...props}
						isPopover={false}
						blockName={name}
					/>
				</div>
			</div>
		);
	},
};
