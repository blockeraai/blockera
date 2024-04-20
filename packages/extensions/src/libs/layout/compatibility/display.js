// @flow

export function displayFromWPCompatibility({
	attributes,
	blockId,
}: {
	attributes: Object,
	blockId?: string,
}): Object {
	if (attributes?.publisherDisplay !== '') {
		return attributes;
	}

	switch (blockId) {
		case 'core/group':
			if (attributes?.layout?.type !== 'constrained') {
				attributes.publisherDisplay = attributes?.layout?.type;
			}

			return attributes;

		case 'core/buttons':
			if (attributes?.layout?.type !== 'constrained') {
				attributes.publisherDisplay = attributes?.layout?.type;
			}

			return attributes;
	}

	return attributes;
}

export function displayToWPCompatibility({
	newValue,
	ref,
	blockId,
}: {
	newValue: Object,
	ref?: Object,
	blockId: string,
}): Object {
	switch (blockId) {
		case 'core/group':
			if ('reset' === ref?.current?.action) {
				return {
					layout: {
						type: 'constrained',
					},
				};
			}

			if (newValue === undefined || newValue !== 'flex') {
				return {
					layout: {
						type: 'constrained',
					},
				};
			}

			return {
				layout: {
					type: newValue,
				},
			};

		case 'core/buttons':
			if ('reset' === ref?.current?.action) {
				return {
					layout: {
						type: 'flex',
					},
				};
			}

			if (newValue === undefined || newValue === '') {
				return {
					layout: {
						type: 'flex',
					},
				};
			}

			return {
				layout: {
					type: newValue,
				},
			};
	}

	return null;
}
