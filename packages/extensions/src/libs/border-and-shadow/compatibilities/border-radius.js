// @flow

/**
 * Publisher dependencies
 */
import { isBorderRadiusEmpty } from '@publisher/controls';
import { isObject, isString } from '@publisher/utils';

export function borderRadiusFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (isBorderRadiusEmpty(attributes?.publisherBorderRadius)) {
		if (attributes?.style?.border?.radius !== undefined) {
			if (isString(attributes?.style?.border?.radius)) {
				attributes.publisherBorderRadius = {
					type: 'all',
					all: attributes?.style?.border?.radius,
				};
			} else if (isObject(attributes?.style?.border?.radius)) {
				attributes.publisherBorderRadius = {
					type: 'custom',
					...attributes?.style?.border?.radius,
				};
			}
		}
	}

	return attributes;
}

export function borderRadiusToWPCompatibility({
	newValue,
	ref,
}: {
	newValue: Object,
	ref?: Object,
}): Object {
	if ('reset' === ref?.current?.action) {
		return {
			style: {
				border: {
					radius: undefined,
				},
			},
		};
	}

	if (newValue.type === 'all') {
		if (!newValue?.all.endsWith('func')) {
			return {
				style: {
					border: {
						radius: newValue?.all,
					},
				},
			};
		}
	} else if (newValue.type === 'custom') {
		return {
			style: {
				border: {
					radius: {
						topLeft: newValue.topLeft.endsWith('func')
							? ''
							: newValue.topLeft,
						topRight: newValue.topRight.endsWith('func')
							? ''
							: newValue.topRight,
						bottomLeft: newValue.bottomLeft.endsWith('func')
							? ''
							: newValue.bottomLeft,
						bottomRight: newValue.bottomRight.endsWith('func')
							? ''
							: newValue.bottomRight,
					},
				},
			},
		};
	}

	return {};
}
