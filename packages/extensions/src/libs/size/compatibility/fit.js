// @flow

const coreWPFitValues = ['cover', 'contain'];

export function fitFromWPCompatibility({
	attributes,
	blockId,
}: {
	attributes: Object,
	blockId?: string,
}): Object {
	if (attributes?.publisherFit !== '') {
		return attributes;
	}

	switch (blockId) {
		case 'core/image':
		case 'core/post-featured-image':
			if (
				attributes?.scale !== undefined &&
				coreWPFitValues.includes(attributes.scale)
			) {
				attributes.publisherFit = attributes.scale;
			}

			return attributes;
	}

	return attributes;
}

export function fitToWPCompatibility({
	newValue,
	ref,
	blockId,
}: {
	newValue: Object,
	ref?: Object,
	blockId: string,
}): Object {
	switch (blockId) {
		case 'core/image':
		case 'core/post-featured-image':
			if ('reset' === ref?.current?.action) {
				return {
					scale: undefined,
				};
			}

			if (
				newValue === undefined ||
				newValue === '' ||
				!coreWPFitValues.includes(newValue)
			) {
				return {
					scale: undefined,
				};
			}

			return {
				scale: newValue,
			};
	}

	return null;
}
