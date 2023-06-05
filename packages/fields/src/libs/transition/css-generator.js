/**
 * Publisher dependencies
 */
import { createCssRule } from '@publisher/style-engine';

/**
 * Internal dependencies
 */
import { getTimingCSS } from './utils';

export function cssGenerator(id, props, styleEngine) {
	const { attributes } = props;

	if (!attributes?.publisherTransition?.length) {
		return '';
	}

	const value = attributes?.publisherTransition
		?.map((item) => {
			if (!item.isVisible) {
				return null;
			}

			return `${item.type} ${item.duration} ${getTimingCSS(
				item.timing
			)} ${item.delay}`;
		})
		?.filter((item) => null !== item);

	return createCssRule({
		selector: `#block-${props.clientId}${
			styleEngine.selector ? ' ' + styleEngine.selector : ''
		}`,
		properties: {
			transition: value?.join(', '),
		},
	});
}
