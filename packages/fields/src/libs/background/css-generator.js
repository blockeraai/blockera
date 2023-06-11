/**
 * Publisher dependencies
 */
import { createCssRule } from '@publisher/style-engine';
import { getBackgroundItemBGProperty } from '@publisher/controls';

export function backgroundCSSGenerator(id, props, styleEngine) {
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
					`${item['image-position-left']} ${item['image-position-top']}`
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
				properties.repeat.push('repeat');

				// Background Attachment
				properties.attachment.push(item['radial-gradient-attachment']);

				break;
		}

		return undefined;
	});

	return createCssRule({
		selector: `#block-${props.clientId}${
			styleEngine.selector ? ' ' + styleEngine.selector : ''
		}`,
		properties: {
			'background-image': properties.image.join(', '),
			'background-size': properties.size.join(', '),
			'background-position': properties.position.join(', '),
			'background-repeat': properties.repeat.join(', '),
			'background-attachment': properties.attachment.join(', '),
		},
	});
}
