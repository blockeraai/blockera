// @flow

export const coreWPAspectRatioValues = [
	'1',
	'4/3',
	'3/4',
	'3/2',
	'2/3',
	'16/9',
	'9/16',
];

export function ratioFromWPCompatibility({
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
				attributes?.aspectRatio !== undefined &&
				attributes?.publisherRatio?.value !== attributes?.aspectRatio
			) {
				if (
					coreWPAspectRatioValues.indexOf(attributes.aspectRatio) > -1
				) {
					attributes.publisherRatio = {
						value: attributes.aspectRatio,
						width: '',
						height: '',
					};
				}
			}

			return attributes;
	}

	return attributes;
}

export function ratioToWPCompatibility({
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
					aspectRatio: undefined,
				};
			}

			if (
				newValue === undefined ||
				newValue === '' ||
				newValue?.value === '' ||
				coreWPAspectRatioValues.indexOf(newValue?.value) < 0
			) {
				return {
					aspectRatio: undefined,
				};
			}

			return {
				aspectRatio: newValue.value,
			};
	}
}
