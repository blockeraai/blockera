// @flow

/**
 * Blockera dependencies
 */
import { isBorderRadiusEmpty } from '@blockera/controls';
import { isObject, isString } from '@blockera/utils';

export function borderRadiusFromWPCompatibility({
	attributes,
	insideBlockInspector,
}: {
	attributes: Object,
	insideBlockInspector: boolean,
}): Object {
	if (isBorderRadiusEmpty(attributes?.blockeraBorderRadius?.value)) {
		const borderRadius = insideBlockInspector
			? attributes?.style?.border?.radius
			: attributes?.border?.radius;

		if (borderRadius) {
			if (isString(borderRadius)) {
				attributes.blockeraBorderRadius = {
					value: {
						type: 'all',
						all: borderRadius,
					},
				};
			} else if (isObject(borderRadius)) {
				const corners: {
					topLeft?: string,
					topRight?: string,
					bottomLeft?: string,
					bottomRight?: string,
				} = {
					topLeft: borderRadius?.topLeft ?? '',
					topRight: borderRadius?.topRight ?? '',
					bottomLeft: borderRadius?.bottomLeft ?? '',
					bottomRight: borderRadius?.bottomRight ?? '',
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
	insideBlockInspector,
}: {
	newValue: Object,
	ref?: Object,
	insideBlockInspector: boolean,
}): Object {
	if ('reset' === ref?.current?.action || newValue === '') {
		if (!insideBlockInspector) {
			return {
				border: {
					radius: undefined,
				},
			};
		}

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
			if (!insideBlockInspector) {
				return {
					border: {
						radius: newValue?.all,
					},
				};
			}

			return {
				style: {
					border: {
						radius: newValue?.all,
					},
				},
			};
		}

		if (!insideBlockInspector) {
			return {
				border: {
					radius: undefined,
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
			if (!insideBlockInspector) {
				return {
					border: {
						radius: undefined,
					},
				};
			}

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

		if (!insideBlockInspector) {
			return {
				border: {
					radius: corners,
				},
			};
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
