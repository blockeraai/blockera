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
				properties.position.push('0 0');

				// Background Repeat
				properties.repeat.push('repeat');

				// Background Attachment
				properties.attachment.push('scroll');

				break;

			case 'radial-gradient':
				if (!item['radial-gradient']) {
					return undefined;
				}

				let radialGradient = item['radial-gradient'];

				if (item['radial-gradient-repeat'] === 'repeat') {
					radialGradient = radialGradient.replace(
						'radial-gradient(',
						'repeating-radial-gradient('
					);
				}

				// Gradient Position
				if (
					item['radial-gradient-position-left'] &&
					item['radial-gradient-position-top']
				) {
					radialGradient = radialGradient.replace(
						'gradient(',
						`gradient( circle at ${item['radial-gradient-position-left']} ${item['radial-gradient-position-top']}, `
					);
				}

				// Gradient Size
				if (item['radial-gradient-size']) {
					radialGradient = radialGradient.replace(
						'circle at ',
						`circle ${item['radial-gradient-size']} at `
					);
				}

				// Image
				properties.image.push(radialGradient);

				// Background Size
				properties.size.push('auto');

				// Background Position
				properties.position.push('0 0');

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
