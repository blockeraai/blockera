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
		switch (item.type) {
			case 'image':
				if (!item.image) {
					return undefined;
				}

				// Image
				properties.image.push(`url(${item.image})`);

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

				let gradient = item['linear-gradient'];

				if (item['linear-gradient-repeat'] === 'repeat') {
					gradient = gradient.replace(
						'linear-gradient(',
						'repeating-linear-gradient('
					);
				}

				// Image
				properties.image.push(gradient);

				// Background Size
				properties.size.push('auto');

				// Background Position
				properties.position.push('0px 0px');

				// Background Repeat
				properties.repeat.push('repeat');

				// Background Attachment
				properties.attachment.push('scroll');

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
