// @flow

/**
 * Blockera dependencies
 */
import { isBorderRadiusEmpty, isValid } from '@blockera/controls';
import {
	getBorderRadiusVAStringFromId,
	getValueAddonFromVarString,
	parseVarString,
} from '@blockera/data';
import { isObject, isString, normalizeCssLengthValue } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { runInsideBlockInspector } from '../../utils';

function isBorderRadiusPresetVarString(value: mixed): boolean {
	return (
		typeof value === 'string' &&
		(value.startsWith('var:preset|border-radius') ||
			value.startsWith('var(--wp--preset--border-radius'))
	);
}

function resolveBorderRadiusFieldFromWP(raw: string): mixed {
	const normalized = raw.includes('(') ? raw : normalizeCssLengthValue(raw);

	if (!isBorderRadiusPresetVarString(normalized)) {
		return normalized;
	}

	const converted = getValueAddonFromVarString(
		normalized,
		['border-radius'],
		{
			onlyVariableLike: true,
		}
	);

	return isObject(converted) && converted.isValueAddon
		? converted
		: normalized;
}

function borderRadiusFieldToWP(field: mixed): string | void {
	if (isValid(field)) {
		return (
			getBorderRadiusVAStringFromId(field?.settings?.id) ||
			`var:preset|border-radius|${field?.settings?.id}`
		);
	}

	if ('string' === typeof field && !field.endsWith('func')) {
		return field;
	}

	return undefined;
}

/**
 * Stable key for comparing corner values (plain length, var:preset string, or value addon).
 */
function borderRadiusCornerIdentity(value: mixed): string {
	if (value === undefined || value === null || value === '') {
		return '';
	}

	if (isValid(value)) {
		const type = value.settings?.type || 'border-radius';
		let id = value.settings?.id || '';

		if (typeof id === 'string' && isBorderRadiusPresetVarString(id)) {
			const parsed = parseVarString(id, 'border-radius');

			if (parsed.id) {
				id = parsed.id;
			}
		}

		return `${type}:${id}`;
	}

	if (typeof value === 'string') {
		if (isBorderRadiusPresetVarString(value)) {
			const { id } = parseVarString(value, 'border-radius');

			if (id) {
				return `border-radius:${id}`;
			}
		}

		return `literal:${value}`;
	}

	return '';
}

function areBorderRadiusCornersEqual(corners: {
	topLeft?: mixed,
	topRight?: mixed,
	bottomLeft?: mixed,
	bottomRight?: mixed,
}): boolean {
	const reference = borderRadiusCornerIdentity(corners.topLeft);

	return (
		borderRadiusCornerIdentity(corners.topRight) === reference &&
		borderRadiusCornerIdentity(corners.bottomLeft) === reference &&
		borderRadiusCornerIdentity(corners.bottomRight) === reference
	);
}

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
						all: resolveBorderRadiusFieldFromWP(all),
					},
				};
			} else if (isObject(borderRadius)) {
				const corners: {
					topLeft?: mixed,
					topRight?: mixed,
					bottomLeft?: mixed,
					bottomRight?: mixed,
				} = {
					topLeft: resolveBorderRadiusFieldFromWP(
						borderRadius?.topLeft ?? ''
					),
					topRight: resolveBorderRadiusFieldFromWP(
						borderRadius?.topRight ?? ''
					),
					bottomLeft: resolveBorderRadiusFieldFromWP(
						borderRadius?.bottomLeft ?? ''
					),
					bottomRight: resolveBorderRadiusFieldFromWP(
						borderRadius?.bottomRight ?? ''
					),
				};

				const areCornersEqual = areBorderRadiusCornersEqual(corners);

				if (areCornersEqual) {
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
		const wpAllRadius = borderRadiusFieldToWP(newValue?.all);

		if (wpAllRadius !== undefined) {
			if (
				!runInsideBlockInspector(
					insideBlockInspector,
					editorSelectedBlockEvent
				)
			) {
				return {
					border: {
						radius: wpAllRadius,
					},
				};
			}

			return {
				style: {
					border: {
						radius: wpAllRadius,
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
			corners.topLeft = borderRadiusFieldToWP(newValue.topLeft);
		}

		if (newValue.topRight !== '') {
			corners.topRight = borderRadiusFieldToWP(newValue.topRight);
		}

		if (newValue.bottomLeft !== '') {
			corners.bottomLeft = borderRadiusFieldToWP(newValue.bottomLeft);
		}

		if (newValue.bottomRight !== '') {
			corners.bottomRight = borderRadiusFieldToWP(newValue.bottomRight);
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
