/**
 * Publisher dependencies
 */
import { createCssRule } from '@publisher/style-engine';
import { getBackgroundItemBGProperty } from '@publisher/controls';
import { getValueAddonRealValue } from '@publisher/hooks';

export function backgroundGenerator(id, props, styleEngine) {
	const { attributes } = props;

	if (!attributes?.publisherBackground?.length) {
		return '';
	}

	const properties = {
		image: [],
		size: [],
		position: [],
		repeat: [],
		attachment: [],
		backgroundColor: '',
	};

	// Collect all properties
	attributes?.publisherBackground?.map((item) => {
		if (!item.isVisible) {
			return undefined;
		}

		// Image Background
		switch (item.type) {
			case 'image':
				if (!item.image) {
					return undefined;
				}

				// Image
				properties.image.push(
					`url(${getBackgroundItemBGProperty(item)})`
				);

				// Background Size
				if (item['image-size'] === 'custom') {
					properties.size.push(
						`${getValueAddonRealValue(
							item['image-size-width']
						)} ${getValueAddonRealValue(item['image-size-height'])}`
					);
				} else {
					properties.size.push(item['image-size']);
				}

				// Background Position
				properties.position.push(
					`${getValueAddonRealValue(
						item['image-position'].left
					)} ${getValueAddonRealValue(item['image-position'].top)}`
				);

				// Background Repeat
				properties.repeat.push(item['image-repeat']);

				// Background Attachment
				properties.attachment.push(item['image-attachment']);

				break;

			case 'linear-gradient':
				if (!item['linear-gradient']) {
					return undefined;
				}

				// Image
				properties.image.push(getBackgroundItemBGProperty(item));

				// Background Size
				properties.size.push('auto');

				// Background Position
				properties.position.push('0 0');

				// Background Repeat
				properties.repeat.push('repeat');

				// Background Attachment
				properties.attachment.push(item['linear-gradient-attachment']);

				break;

			case 'radial-gradient':
				if (!item['radial-gradient']) {
					return undefined;
				}

				// Image
				properties.image.push(getBackgroundItemBGProperty(item));

				// Background Size
				properties.size.push('auto');

				// Background Position
				properties.position.push('0 0');

				// Background Repeat
				properties.repeat.push(
					item['radial-gradient-repeat'] ?? 'repeat'
				);

				// Background Attachment
				properties.attachment.push(item['radial-gradient-attachment']);

				break;

			case 'mesh-gradient':
				if (!item['mesh-gradient']) {
					return undefined;
				}

				let gradient = item['mesh-gradient'];

				if ('string' === typeof gradient) {
					item['mesh-gradient-colors'].map((value, index) => {
						gradient = gradient.replace(
							`var(--c${index})`,
							getValueAddonRealValue(
								item['mesh-gradient-colors'][index].color
							)
						);
						return null;
					});
				} else {
					gradient = gradient.join(', ');
				}

				item['mesh-gradient-colors'].map((value, index) => {
					const newVar = '--c' + index;

					properties[newVar] = getValueAddonRealValue(value.color);

					return properties;
				});

				// override bg color
				properties['background-color'] =
					item['mesh-gradient-colors'][0].color;

				// Image
				properties.image.push(gradient ? gradient + ' !important' : '');

				// Background Size
				properties.size.push('auto');

				// Background Position
				properties.position.push('0 0');

				// Background Repeat
				properties.repeat.push('repeat');

				// Background Attachment
				properties.attachment.push(item['mesh-gradient-attachment']);

				break;
		}

		return undefined;
	});

	const { image, size, position, repeat, attachment, ..._properties } =
		properties;

	const toReturnProperties = {
		'background-image': image.join(', '),
		'background-size': size.join(', ') + ' !important',
		'background-position': position.join(', '),
		'background-repeat': repeat.join(', '),
		'background-attachment': attachment.join(', '),
		..._properties,
	};

	if (properties['background-color'])
		toReturnProperties['background-color'] =
			getValueAddonRealValue(properties['background-color']) +
			' !important';

	return createCssRule({
		selector: `${
			styleEngine.selector
				? `#block-${props.clientId}` + styleEngine.selector
				: ''
		}`,
		properties: toReturnProperties,
	});
}
