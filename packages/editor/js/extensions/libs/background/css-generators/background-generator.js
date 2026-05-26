/**
 * Blockera dependencies
 */
import {
	getValueAddonRealValue,
	getBackgroundItemBGProperty,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import { createCssDeclarations } from '../../../../style-engine';

export function backgroundGenerator(id, props, options) {
	const { attributes } = props;

	if (!Object.values(attributes?.blockeraBackground)?.length) {
		return '';
	}

	const properties = {
		image: [],
		size: [],
		position: [],
		repeat: [],
		attachment: [],
	};

	let hasProps = true;

	// Collect all properties
	Object.entries(attributes?.blockeraBackground)?.map(([, item]) => {
		if (!item.isVisible) {
			return undefined;
		}

		// Image Background
		switch (item.type) {
			case 'image':
				if (!item.image) {
					hasProps = false;

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
					hasProps = false;

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
					hasProps = false;

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
					hasProps = false;

					return undefined;
				}

				let gradient = item['mesh-gradient'];

				if ('string' === typeof gradient) {
					Object.entries(item['mesh-gradient-colors']).map(
						([cssVariableName, value]) => {
							gradient = gradient.replace(
								`var(${cssVariableName})`,
								getValueAddonRealValue(value.color)
							);
							return null;
						}
					);
				} else {
					gradient = gradient.join(', ');
				}

				Object.entries(item['mesh-gradient-colors']).map(
					([cssVariableName, value]) => {
						properties[cssVariableName] = getValueAddonRealValue(
							value.color
						);

						return properties;
					}
				);

				// override bg color
				properties['background-color'] =
					item['mesh-gradient-colors']['--c0'].color;

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

	// Prevent to generate css props with values!
	if (!hasProps) {
		return '';
	}

	const { image, size, position, repeat, attachment } = properties;

	const toReturnProperties = {
		'background-image': image.join(', ') + ' !important',
		'background-size': size.join(', ') + ' !important',
		'background-position': position.join(', ') + ' !important',
		'background-repeat': repeat.join(', ') + ' !important',
		'background-attachment': attachment.join(', ') + ' !important',
	};

	if (properties['background-color'])
		toReturnProperties['background-color'] =
			getValueAddonRealValue(properties['background-color']) +
			' !important';

	return createCssDeclarations({
		options,
		properties: toReturnProperties,
	});
}
