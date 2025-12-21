// @flow

/**
 * Blockera dependencies
 */
import { isBorderRadiusEmpty } from '@blockera/controls';
import { isObject, isString } from '@blockera/utils';

export function borderRadiusFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (isBorderRadiusEmpty(attributes?.blockeraBorderRadius?.value)) {
		if (attributes?.style?.border?.radius) {
			if (isString(attributes?.style?.border?.radius)) {
				attributes.blockeraBorderRadius = {
					value: {
						type: 'all',
						all: attributes?.style?.border?.radius,
					},
				};
			} else if (isObject(attributes?.style?.border?.radius)) {
				const corners: {
					topLeft?: string,
					topRight?: string,
					bottomLeft?: string,
					bottomRight?: string,
				} = {
					topLeft: attributes?.style?.border?.radius?.topLeft ?? '',
					topRight: attributes?.style?.border?.radius?.topRight ?? '',
					bottomLeft:
						attributes?.style?.border?.radius?.bottomLeft ?? '',
					bottomRight:
						attributes?.style?.border?.radius?.bottomRight ?? '',
				};

				const areCordersEqual = Object.values(corners).every(
					(corner) => {
						return corner === corners.topLeft;
					}
				);

				if (areCordersEqual) {
					attributes.blockeraBorderRadius = {
						value: {
							type: 'all',
							all: corners.topLeft,
						},
					};
				} else {
					attributes.blockeraBorderRadius = {
						value: {
							...corners,
							type: 'custom',
							all: '',
						},
					};
				}
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

		// Advanced css functions not supported by core.
		return {
			style: {
				border: {
					radius: undefined,
				},
			},
		};
	} else if (newValue.type === 'custom') {
		if (
			newValue?.topLeft === '' &&
			newValue?.topRight === '' &&
			newValue?.bottomLeft === '' &&
			newValue?.bottomRight === ''
		) {
			return {
				style: {
					border: {
						radius: undefined,
					},
				},
			};
		}

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

		if (newValue.topLeft !== '') {
			// Advanced css functions not supported by core.
			if (!newValue.topLeft.endsWith('func')) {
				corners.topLeft = newValue.topLeft;
			} else {
				corners.topLeft = undefined;
			}
		}

		if (newValue.topRight !== '') {
			// Advanced css functions not supported by core.
			if (!newValue.topRight.endsWith('func')) {
				corners.topRight = newValue.topRight;
			} else {
				corners.topRight = undefined;
			}
		}

		if (newValue.bottomLeft !== '') {
			// Advanced css functions not supported by core.
			if (!newValue.bottomLeft.endsWith('func')) {
				corners.bottomLeft = newValue.bottomLeft;
			} else {
				corners.bottomLeft = undefined;
			}
		}

		if (newValue.bottomRight !== '') {
			// Advanced css functions not supported by core.
			if (!newValue.bottomRight.endsWith('func')) {
				corners.bottomRight = newValue.bottomRight;
			} else {
				corners.bottomRight = undefined;
			}
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
