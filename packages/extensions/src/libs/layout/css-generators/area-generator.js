/**
 * Publisher dependencies
 */
import { isUndefined } from '@publisher/utils';
import { createCssRule } from '@publisher/style-engine';

/**
 * Internal dependencies
 */
import { calcGridTemplateAreas } from '../utils';

export function GridAreaGenerator(id, props, styleEngine) {
	const {
		attributes,
		cssGeneratorEntity: { id: _id, property },
	} = props;

	if (isUndefined(attributes[_id]) || !attributes[_id]?.length) {
		return '';
	}

	const gridTemplateAreas = calcGridTemplateAreas({
		gridRows: attributes.publisherGridRows,
		gridColumns: attributes.publisherGridColumns,
		gridAreas: attributes[_id],
	});

	return createCssRule({
		selector: `#block-${props.clientId}${
			styleEngine.selector ? ' ' + styleEngine.selector : ''
		}`,
		properties: {
			[property]: gridTemplateAreas
				?.map((item) => `"${item.join(' ')}"`)
				.join(` `),
		},
	});
}
