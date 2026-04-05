// @flow

/**
 * Blockera dependencies
 */
import { isBorderRadiusEmpty } from '@blockera/controls';
import { isObject, isString, normalizeCssLengthValue } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { runInsideBlockInspector } from '../../utils';

export function borderRadiusFromWPCompatibility({
	attributes,
	editorSelectedBlockEvent,
	insideBlockInspector,
}: {
	attributes: Object,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
	insideBlockInspector: boolean,
}): Object {
	if (isBorderRadiusEmpty(attributes?.blockeraBorderRadius?.value)) {
		const borderRadius = runInsideBlockInspector(
			insideBlockInspector,
			editorSelectedBlockEvent
		)
			? attributes?.style?.border?.radius
			: attributes?.border?.radius;

		if (borderRadius) {
			if (isString(borderRadius)) {
				const trimmed = borderRadius.trim();
				// Core may store bare `0` per token; match border.js shorthand handling (skip splitting for calc/var/etc.).
				const all = trimmed.includes('(')
					? trimmed
					: trimmed
							.split(/\s+/)
							.filter(Boolean)
							.map((part) => normalizeCssLengthValue(part))
							.join(' ');
				attributes.blockeraBorderRadius = {
					value: {
						type: 'all',
						all,
					},
				};
			} else if (isObject(borderRadius)) {
				const corners: {
					topLeft?: string,
					topRight?: string,
					bottomLeft?: string,
					bottomRight?: string,
				} = {
					topLeft: normalizeCssLengthValue(
						borderRadius?.topLeft ?? ''
					),
					topRight: normalizeCssLengthValue(
						borderRadius?.topRight ?? ''
					),
					bottomLeft: normalizeCssLengthValue(
						borderRadius?.bottomLeft ?? ''
					),
					bottomRight: normalizeCssLengthValue(
						borderRadius?.bottomRight ?? ''
					),
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
	editorSelectedBlockEvent,
	insideBlockInspector,
}: {
	newValue: Object,
	ref?: Object,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
	insideBlockInspector: boolean,
}): Object {
	if ('reset' === ref?.current?.action || newValue === '') {
		if (
			!runInsideBlockInspector(
				insideBlockInspector,
				editorSelectedBlockEvent
			)
		) {
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
			if (
				!runInsideBlockInspector(
					insideBlockInspector,
					editorSelectedBlockEvent
				)
			) {
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

		if (
			!runInsideBlockInspector(
				insideBlockInspector,
				editorSelectedBlockEvent
			)
		) {
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
			if (
				!runInsideBlockInspector(
					insideBlockInspector,
					editorSelectedBlockEvent
				)
			) {
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

		if (
			!runInsideBlockInspector(
				insideBlockInspector,
				editorSelectedBlockEvent
			)
		) {
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
