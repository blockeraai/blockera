/**
 * Publisher dependencies
 */
import { isUndefined } from '@publisher/utils';
import { createCssRule } from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';

export function GridColumnGenerator(id, props, styleEngine) {
	const {
		attributes,
		cssGeneratorEntity: { id: _id },
	} = props;

	if (isUndefined(attributes[_id]) || !attributes[_id]?.length) {
		return '';
	}
	const properties = {};

	const value = attributes[_id]
		?.map((item) => {
			if (!item.isVisible) {
				return null;
			}

			if (item['auto-generated']) {
				switch (item['sizing-mode']) {
					case 'min/max':
						properties[
							'grid-auto-columns'
						] = `minmax(${getValueAddonRealValue(
							item['min-size']
						)}, ${getValueAddonRealValue(item['max-size'])})`;
						break;
					default:
						properties[
							'grid-auto-columns'
						] = `${getValueAddonRealValue(item.size)}`;
						break;
				}

				return null;
			}

			if (item['auto-fit']) {
				switch (item['sizing-mode']) {
					case 'min/max':
						return `repeat(auto-fit,minmax(${getValueAddonRealValue(
							item['min-size']
						)}, ${getValueAddonRealValue(item['max-size'])}))`;

					default:
						return `repeat(auto-fit,${getValueAddonRealValue(
							item.size
						)})`;
				}
			}

			switch (item['sizing-mode']) {
				case 'min/max':
					return `minmax(${getValueAddonRealValue(
						item['min-size']
					)}, ${getValueAddonRealValue(item['max-size'])})`;

				default:
					return `${getValueAddonRealValue(item.size)}`;
			}
		})
		?.filter((item) => null !== item);

	properties['grid-template-columns'] = value?.join(' ');

	return createCssRule({
		selector: `#block-${props.clientId}${
			styleEngine.selector ? ' ' + styleEngine.selector : ''
		}`,
		properties,
	});
}
