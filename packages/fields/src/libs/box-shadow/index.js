/**
 * Internal dependencies
 */
import helpers from './helpers';
import field from './field.json';
import { BoxShadowControl } from '@publisher/controls';
import { injectHelpersToCssGenerators } from '@publisher/style-engine';
import { fieldsClassNames, fieldsInnerClassNames } from '@publisher/classnames';

export default {
	...field,
	publisherCssGenerators: {
		...field.publisherCssGenerators,
		...injectHelpersToCssGenerators(helpers, field.cssGenerators),
	},
	edit: ({ name: blockName, ...props }) => {
		return (
			<div className={fieldsClassNames('box-shadow', '1-column')}>
				<div className={fieldsInnerClassNames('control')}>
					<BoxShadowControl {...props} blockName={blockName} />
				</div>
			</div>
		);
	},
};
