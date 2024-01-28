// @flow

export function backgroundFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
	blockId?: string,
}): Object {
	if (
		attributes?.publisherBackground.length === 0 &&
		attributes?.style?.background?.backgroundImage?.url !== undefined
	) {
		attributes.publisherBackground = [
			{
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
			},
		];
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
	if ('reset' === ref?.current?.action) {
		return {
			style: {
				background: {
					backgroundImage: undefined,
				},
			},
		};
	}

	let result = {};

	newValue.forEach((item) => {
		if (item?.type === 'image' && item?.image !== 'image') {
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
