// @flow
/**
 * Publisher dependencies
 */
import { isEmpty } from '@publisher/utils';

export function backgroundFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
	blockId?: string,
}): Object {
	if (
		attributes?.publisherBackground['image-0'] === undefined &&
		attributes?.style?.background?.backgroundImage?.url !== undefined
	) {
		attributes.publisherBackground = {
			...attributes.publisherBackground,
			'image-0': {
				type: 'image',
				image: attributes?.style?.background?.backgroundImage?.url,
				'image-size': 'custom',
				'image-size-width': 'auto',
				'image-size-height': 'auto',
				'image-position': {
					top: '50%',
					left: '50%',
				},
				'image-repeat': 'repeat',
				'image-attachment': 'scroll',
				isOpen: false,
				order: 0,
			},
		};
	}

	return attributes;
}

export function backgroundToWPCompatibility({
	newValue,
	ref,
}: {
	newValue: Object,
	ref?: Object,
}): Object {
	if ('reset' === ref?.current?.action || isEmpty(newValue)) {
		return {
			style: {
				background: {
					backgroundImage: undefined,
				},
			},
		};
	}

	let result = {};

	Object.entries(newValue).forEach(([, item]: [string, Object]): void => {
		// only 1 image
		if (result) {
			return;
		}

		if (item?.type === 'image' && item?.image !== '') {
			result = {
				style: {
					background: {
						backgroundImage: {
							url: item?.image,
							source: 'file',
							id: 0,
							title: 'background image',
						},
					},
				},
			};
		}
	});

	return result;
}
