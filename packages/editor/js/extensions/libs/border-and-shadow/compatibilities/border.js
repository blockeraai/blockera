// @flow

/**
 * Blockera dependencies
 */
import { getColorVAFromVarString } from '@blockera/data';
import { isValid, isBorderEmpty } from '@blockera/controls';
import { isEquals } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { runInsideBlockInspector } from '../../utils';

/**
 * When WordPress stores `border.width` as a CSS shorthand (2–4 lengths, e.g. `0 0 0 2px`),
 * it must map to `type: 'custom'` per-side widths. Using `type: 'all'` would emit invalid CSS
 * (`border: 0 0 0 2px solid color`) from the box-border generator.
 *
 * Returns null for a single token, empty string, or values containing `(` (calc/var/min, etc.)
 * where naive splitting would be wrong.
 *
 * Bare `0` tokens are normalized to `0px` so per-side widths stay explicit lengths for the UI/CSS pipeline.
 */
export function expandFlatBorderWidthToSides(
	width: string
): ?{| top: string, right: string, bottom: string, left: string |} {
	if (typeof width !== 'string') {
		return null;
	}
	const trimmed = width.trim();
	if (!trimmed || trimmed.includes('(')) {
		return null;
	}
	const parts = trimmed
		.split(/\s+/)
		.filter(Boolean)
		.map((part) => (part === '0' ? '0px' : part));
	if (parts.length < 2) {
		return null;
	}
	let top: string;
	let right: string;
	let bottom: string;
	let left: string;
	if (parts.length === 2) {
		top = bottom = parts[0];
		right = left = parts[1];
	} else if (parts.length === 3) {
		top = parts[0];
		right = left = parts[1];
		bottom = parts[2];
	} else if (parts.length === 4) {
		top = parts[0];
		right = parts[1];
		bottom = parts[2];
		left = parts[3];
	} else {
		return null;
	}
	return { top, right, bottom, left };
}

export function borderFromWPCompatibility({
	attributes,
	editorSelectedBlockEvent,
	insideBlockInspector,
}: {
	attributes: Object,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
	insideBlockInspector: boolean,
}): Object {
	if (isBorderEmpty(attributes?.blockeraBorder?.value)) {
		const border = runInsideBlockInspector(
			insideBlockInspector,
			editorSelectedBlockEvent
		)
			? attributes?.style?.border
			: attributes?.border;

		// borderColor in root always is variable and means border type is all
		// it should be changed to a Value Addon (variable)
		if (attributes?.borderColor) {
			const colorVar = getColorVAFromVarString(
				`var:preset|color|${attributes?.borderColor}`
			);

			if (colorVar) {
				attributes.blockeraBorder = {
					value: {
						type: 'all',
						all: {
							width: attributes?.style?.border?.width ?? '',
							color: colorVar,
							style: attributes?.style?.border?.style ?? 'solid',
						},
					},
				};
			}
		}
		// does not use var color and is custom border
		else if (border?.top) {
			const borderData = {
				type: 'custom',
				all: {
					width: '',
					style: '',
					color: '',
				},
				top: {
					width: border?.top?.width ?? '',
					color: border?.top?.color ?? '',
					style: border?.top?.style ?? 'solid',
				},
				right: {
					width: border?.right?.width ?? '',
					color: border?.right?.color ?? '',
					style: border?.right?.style ?? 'solid',
				},
				bottom: {
					width: border?.bottom?.width ?? '',
					color: border?.bottom?.color ?? '',
					style: border?.bottom?.style ?? 'solid',
				},
				left: {
					width: border?.left?.width ?? '',
					color: border?.left?.color ?? '',
					style: border?.left?.style ?? 'solid',
				},
			};

			// convert to var
			borderData.top.color = getColorVAFromVarString(
				borderData.top.color
			);
			borderData.right.color = getColorVAFromVarString(
				borderData.right.color
			);
			borderData.bottom.color = getColorVAFromVarString(
				borderData.bottom.color
			);
			borderData.left.color = getColorVAFromVarString(
				borderData.left.color
			);

			attributes.blockeraBorder = {
				value: borderData,
			};
		}
		// Flat `border` object from core (no `top`/`right`/…): one width + style + color.
		else if (border?.width || border?.style || border?.color) {
			const widthSides = expandFlatBorderWidthToSides(
				border?.width ?? ''
			);
			// Special case: width is CSS shorthand (e.g. `{ width: "0 0 0 2px", style: "solid", color: "currentColor" }`).
			// Must become per-side `type: 'custom'` — `type: 'all'` would output invalid `border: 0 0 0 2px solid …`.
			if (widthSides) {
				const sharedStyle = border?.style ?? 'solid';
				const borderData = {
					type: 'custom',
					all: {
						width: '',
						style: '',
						color: '',
					},
					top: {
						width: widthSides.top,
						color: border?.color ?? '',
						style: sharedStyle,
					},
					right: {
						width: widthSides.right,
						color: border?.color ?? '',
						style: sharedStyle,
					},
					bottom: {
						width: widthSides.bottom,
						color: border?.color ?? '',
						style: sharedStyle,
					},
					left: {
						width: widthSides.left,
						color: border?.color ?? '',
						style: sharedStyle,
					},
				};

				borderData.top.color = getColorVAFromVarString(
					borderData.top.color
				);
				borderData.right.color = getColorVAFromVarString(
					borderData.right.color
				);
				borderData.bottom.color = getColorVAFromVarString(
					borderData.bottom.color
				);
				borderData.left.color = getColorVAFromVarString(
					borderData.left.color
				);
				attributes.blockeraBorder = {
					value: borderData,
				};
			} else {
				// One width token (or calc/var — we do not split): safe for `border:` shorthand as `type: 'all'`.
				attributes.blockeraBorder = {
					value: {
						type: 'all',
						all: {
							width: border?.width ?? '',
							style: border?.style ?? 'solid',
							color: border?.color ?? '',
						},
					},
				};
			}
		}
	}

	return attributes;
}

export function borderToWPCompatibility({
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
		const borderData: Object = {
			color: undefined,
			width: undefined,
			style: undefined,
			top: undefined,
			right: undefined,
			bottom: undefined,
			left: undefined,
		};

		return {
			...(runInsideBlockInspector(
				insideBlockInspector,
				editorSelectedBlockEvent
			)
				? {
						borderColor: undefined,
						style: {
							border: borderData,
						},
					}
				: { border: borderData }),
		};
	}

	if (newValue.type === 'all') {
		if (isValid(newValue?.all?.color)) {
			const borderData: Object = {
				color: undefined,
				width: newValue?.all?.width,
				style: newValue?.all?.style ? newValue?.all?.style : '',
				top: undefined,
				right: undefined,
				bottom: undefined,
				left: undefined,
			};

			return {
				...(runInsideBlockInspector(
					insideBlockInspector,
					editorSelectedBlockEvent
				)
					? {
							borderColor: newValue?.all?.color?.settings?.id,
							style: {
								border: borderData,
							},
						}
					: { border: borderData }),
			};
		}

		// if type is custom but value is empty
		// then we should not set wp data compatibility
		if (
			isEquals(newValue, {
				type: 'all',
				all: {
					width: '',
					style: 'solid',
					color: '',
				},
			}) ||
			isEquals(newValue, {
				type: 'all',
				all: {
					width: '',
					style: '',
					color: '',
				},
			})
		) {
			const borderData: Object = {
				color: undefined,
				width: undefined,
				style: undefined,
				top: undefined,
				right: undefined,
				bottom: undefined,
				left: undefined,
			};
			const newBorder: Object = {
				...(runInsideBlockInspector(
					insideBlockInspector,
					editorSelectedBlockEvent
				)
					? {
							borderColor: undefined,
							style: {
								border: borderData,
							},
						}
					: { border: borderData }),
			};

			return newBorder;
		}

		if (
			!runInsideBlockInspector(
				insideBlockInspector,
				editorSelectedBlockEvent
			)
		) {
			return {
				border: {
					color: newValue?.all?.color,
					width: newValue?.all?.width,
					style: newValue?.all?.style ? newValue?.all?.style : '',
					top: undefined,
					right: undefined,
					bottom: undefined,
					left: undefined,
				},
			};
		}

		return {
			borderColor: undefined,
			style: {
				border: {
					color: newValue?.all?.color,
					width: newValue?.all?.width,
					style: newValue?.all?.style ? newValue?.all?.style : '',
					top: undefined,
					right: undefined,
					bottom: undefined,
					left: undefined,
				},
			},
		};
	} else if (newValue.type === 'custom') {
		// if type is custom but value is empty
		// then we should not set wp data compatibility
		if (
			isEquals(newValue, {
				type: 'custom',
				all: {
					width: '',
					style: '',
					color: '',
				},
				top: {
					width: '',
					color: '',
					style: '',
				},
				right: {
					width: '',
					color: '',
					style: '',
				},
				bottom: {
					width: '',
					color: '',
					style: '',
				},
				left: {
					width: '',
					color: '',
					style: '',
				},
			})
		) {
			let newBorder: Object = {
				style: {
					border: {
						color: undefined,
						width: undefined,
						style: undefined,
						top: undefined,
						right: undefined,
						bottom: undefined,
						left: undefined,
					},
				},
			};

			if (
				!runInsideBlockInspector(
					insideBlockInspector,
					editorSelectedBlockEvent
				)
			) {
				newBorder = {
					border: {
						color: undefined,
						width: undefined,
						style: undefined,
						top: undefined,
						right: undefined,
						bottom: undefined,
						left: undefined,
					},
				};
			}

			return newBorder;
		}

		const borderData = {
			color: undefined,
			width: undefined,
			style: undefined,
			top: {
				width: newValue?.top?.width,
				style: newValue?.top?.style ? newValue?.top?.style : '',
				color: newValue?.top?.color,
			},
			right: {
				width: newValue?.right?.width,
				style: newValue?.right?.style ? newValue?.right?.style : '',
				color: newValue?.right?.color,
			},
			bottom: {
				width: newValue?.bottom?.width,
				style: newValue?.bottom?.style ? newValue?.bottom?.style : '',
				color: newValue?.bottom?.color,
			},
			left: {
				width: newValue?.left?.width,
				style: newValue?.left?.style ? newValue?.left?.style : '',
				color: newValue?.left?.color,
			},
		};

		const border: Object = {
			...(runInsideBlockInspector(
				insideBlockInspector,
				editorSelectedBlockEvent
			)
				? {
						style: {
							border: borderData,
						},
					}
				: { border: borderData }),
		};

		if (
			runInsideBlockInspector(
				insideBlockInspector,
				editorSelectedBlockEvent
			) &&
			isValid(border.style.border.top.color)
		) {
			border.style.border.top.color =
				'var:preset|color|' +
				border.style.border.top.color?.settings?.id;
		} else if (
			!runInsideBlockInspector(
				insideBlockInspector,
				editorSelectedBlockEvent
			) &&
			isValid(border.border.top.color)
		) {
			border.border.top.color =
				'var:preset|color|' + border.border.top.color?.settings?.id;
		}

		if (
			runInsideBlockInspector(
				insideBlockInspector,
				editorSelectedBlockEvent
			) &&
			isValid(border.style.border.right.color)
		) {
			border.style.border.right.color =
				'var:preset|color|' +
				border.style.border.right.color?.settings?.id;
		} else if (
			!runInsideBlockInspector(
				insideBlockInspector,
				editorSelectedBlockEvent
			) &&
			isValid(border.border.right.color)
		) {
			border.border.right.color =
				'var:preset|color|' + border.border.right.color?.settings?.id;
		}

		if (
			runInsideBlockInspector(
				insideBlockInspector,
				editorSelectedBlockEvent
			) &&
			isValid(border.style.border.bottom.color)
		) {
			border.style.border.bottom.color =
				'var:preset|color|' +
				border.style.border.bottom.color?.settings?.id;
		} else if (
			!runInsideBlockInspector(
				insideBlockInspector,
				editorSelectedBlockEvent
			) &&
			isValid(border.border.bottom.color)
		) {
			border.border.bottom.color =
				'var:preset|color|' + border.border.bottom.color?.settings?.id;
		}

		if (
			runInsideBlockInspector(
				insideBlockInspector,
				editorSelectedBlockEvent
			) &&
			isValid(border.style.border.left.color)
		) {
			border.style.border.left.color =
				'var:preset|color|' +
				border.style.border.left.color?.settings?.id;
		} else if (
			!runInsideBlockInspector(
				insideBlockInspector,
				editorSelectedBlockEvent
			) &&
			isValid(border.border.left.color)
		) {
			border.border.left.color =
				'var:preset|color|' + border.border.left.color?.settings?.id;
		}

		return border;
	}

	return {};
}
