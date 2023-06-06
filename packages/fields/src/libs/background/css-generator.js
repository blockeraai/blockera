/**
 * Publisher dependencies
 */
import { createCssRule } from '@publisher/style-engine';

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
		if (item.type === 'image') {
			if (!item.image) {
				return undefined;
			}

			// Image
			properties.image.push(`url(${item.image})`);

			// Background Size
			if (item['background-image-size'] === 'custom') {
				properties.size.push(
					`${item['background-image-size-width']} ${item['background-image-size-height']}`
				);
			} else {
				properties.size.push(item['background-image-size']);
			}

			// Background Position
			properties.position.push(
				`${item['background-image-position-left']} ${item['background-image-position-top']}`
			);

			// Background Repeat
			properties.repeat.push(item['background-image-repeat']);

			// Background Attachment
			properties.attachment.push(item['background-image-attachment']);
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
