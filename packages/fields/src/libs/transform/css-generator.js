/**
 * Publisher dependencies
 */
import { createCssRule } from '@publisher/style-engine';

export function transformFieldCSSGenerator(id, props, styleEngine) {
	const { attributes } = props;

	if (!attributes?.publisherTransform?.length) {
		return '';
	}

	const value = attributes?.publisherTransform
		?.map((item) => {
			if (!item.isVisible) {
				return null;
			}

			switch (item.type) {
				case 'move':
					return `translate3d(${item['move-x']}, ${item['move-y']}, ${item['move-z']})`;

				case 'scale':
					return `scale3d(${item.scale}, ${item.scale}, 50%)`;

				case 'rotate':
					return `rotateX(${item['rotate-x']}) rotateY(${item['rotate-y']}) rotateZ(${item['rotate-z']})`;

				case 'skew':
					return `skew(${item['skew-x']}, ${item['skew-y']})`;
			}

			return null;
		})
		?.filter((item) => null !== item);

	return createCssRule({
		selector: `#block-${props.clientId}${
			styleEngine.selector ? ' ' + styleEngine.selector : ''
		}`,
		properties: {
			transform: value?.join(' '),
		},
	});
}
