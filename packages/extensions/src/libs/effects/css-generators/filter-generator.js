/**
 * Publisher dependencies
 */
import { isUndefined } from '@publisher/utils';
import { createCssRule } from '@publisher/style-engine';

export function FilterGenerator(id, props, styleEngine) {
	const {
		attributes,
		cssGeneratorEntity: { id: _id, property },
	} = props;

	if (isUndefined(attributes[_id]) || !attributes[_id]?.length) {
		return '';
	}

	const value = attributes[_id]
		?.map((item) => {
			if (!item.isVisible) {
				return null;
			}

			if (item.type === 'drop-shadow') {
				return `${item.type}(${item['drop-shadow-x']} ${item['drop-shadow-y']} ${item['drop-shadow-blur']} ${item['drop-shadow-color']})`;
			}

			return `${item.type}(${item[item.type]})`;
		})
		?.filter((item) => null !== item);

	return createCssRule({
		selector: `#block-${props.clientId}${
			styleEngine.selector ? ' ' + styleEngine.selector : ''
		}`,
		properties: {
			[property]: value?.join(' '),
		},
	});
}
