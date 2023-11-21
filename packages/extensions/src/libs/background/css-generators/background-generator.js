/**
 * Publisher dependencies
 */
import { createCssRule } from '@publisher/style-engine';
import { getBackgroundItemBGProperty } from '@publisher/controls';

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
						`${item['image-size-width']} ${item['image-size-height']}`
					);
				} else {
					properties.size.push(item['image-size']);
				}

				// Background Position
				properties.position.push(
					`${item['image-position'].left} ${item['image-position'].top}`
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

				item['mesh-gradient-colors'].map((value, index) => {
					gradient = gradient.replace(
						`var(--c${index})`,
						item['mesh-gradient-colors'][index].color
					);
					return null;
				});

				// override bg color
				properties['background-color'] =
					item['mesh-gradient-colors'][0].color;

				// Image
				properties.image.push(gradient);

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

	const toReturnProperties = {
		'background-image': properties.image.join(', '),
		'background-size': properties.size.join(', '),
		'background-position': properties.position.join(', '),
		'background-repeat': properties.repeat.join(', '),
		'background-attachment': properties.attachment.join(', '),
	};

	if (properties['background-color'])
		toReturnProperties['background-color'] =
			properties['background-color'] + ' !important';

	if (properties.size[0] === '1auto 1auto')
		toReturnProperties['background-size'] = 'auto auto';

	return createCssRule({
		selector: `${
			styleEngine.selector
				? `#block-${props.clientId}` + styleEngine.selector
				: ''
		}`,
		properties: toReturnProperties,
	});
}
