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
					topLeft: '',
					topRight: '',
					bottomLeft: '',
					bottomRight: '',
					...attributes?.style?.border?.radius,
					type: 'custom',
					all: '',
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
	if ('reset' === ref?.current?.action || newValue === '') {
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
		const corners: {
			topLeft?: string,
			topRight?: string,
			bottomLeft?: string,
			bottomRight?: string,
		} = {
			topLeft: undefined,
			topRight: undefined,
			bottomLeft: undefined,
			bottomRight: undefined,
		};

		if (newValue.topLeft !== '' && !newValue.topLeft.endsWith('func')) {
			corners.topLeft = newValue.topLeft;
		}

		if (newValue.topRight !== '' && !newValue.topRight.endsWith('func')) {
			corners.topRight = newValue.topRight;
		}

		if (
			newValue.bottomLeft !== '' &&
			!newValue.bottomLeft.endsWith('func')
		) {
			corners.bottomLeft = newValue.bottomLeft;
		}

		if (
			newValue.bottomRight !== '' &&
			!newValue.bottomRight.endsWith('func')
		) {
			corners.bottomRight = newValue.bottomRight;
		}

		return {
			style: {
				border: {
					radius: corners,
				},
			},
		};
	}

	return {};
}
