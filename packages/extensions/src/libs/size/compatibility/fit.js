// @flow

export const coreWPFitValues = ['cover', 'contain'];

export function fitFromWPCompatibility({
	attributes,
	blockId,
}: {
	attributes: Object,
	blockId?: string,
}): Object {
	switch (blockId) {
		case 'core/post-featured-image':
		case 'core/image':
			if (
				attributes?.scale !== undefined &&
				attributes?.publisherFit !== attributes?.scale
			) {
				if (coreWPFitValues.indexOf(attributes.scale) > 0) {
					attributes.publisherFit = attributes.scale;
				}
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
		case 'core/post-featured-image':
		case 'core/image':
			if ('reset' === ref?.current?.action) {
				return {
					scale: undefined,
				};
			}

			if (
				newValue === undefined ||
				newValue === '' ||
				coreWPFitValues.indexOf(newValue) < 0
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
