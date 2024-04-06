// @flow

/**
 * Publisher dependencies
 */
import {
	getColorVAFromIdString,
	getColorVAFromVarString,
} from '@publisher/core-data';
import { isValid } from '@publisher/hooks/src/use-value-addon/helpers';
import { isBorderEmpty } from '@publisher/controls';

export function borderFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (isBorderEmpty(attributes?.publisherBorder)) {
		// borderColor in root always is variable and means border type is all
		// it should be changed to a Value Addon (variable)
		if (attributes?.borderColor !== undefined) {
			const colorVar = getColorVAFromIdString(attributes?.borderColor);

			if (colorVar) {
				attributes.publisherBorder = {
					type: 'all',
					all: {
						width: attributes?.style?.border?.width ?? '',
						color: colorVar,
						style: attributes?.style?.border?.style ?? 'solid',
					},
				};
			}
		}
		// does not use var color and is custom border
		else if (attributes?.style?.border?.top !== undefined) {
			const border = {
				type: 'custom',
				all: {
					width: '',
					style: '',
					color: '',
				},
				top: {
					width: attributes?.style?.border?.top?.width ?? '',
					color: attributes?.style?.border?.top?.color ?? '',
					style: attributes?.style?.border?.top?.style ?? 'solid',
				},
				right: {
					width: attributes?.style?.border?.right?.width ?? '',
					color: attributes?.style?.border?.right?.color ?? '',
					style: attributes?.style?.border?.right?.style ?? 'solid',
				},
				bottom: {
					width: attributes?.style?.border?.bottom?.width ?? '',
					color: attributes?.style?.border?.bottom?.color ?? '',
					style: attributes?.style?.border?.bottom?.style ?? 'solid',
				},
				left: {
					width: attributes?.style?.border?.left?.width ?? '',
					color: attributes?.style?.border?.left?.color ?? '',
					style: attributes?.style?.border?.left?.style ?? 'solid',
				},
			};

			// convert to var
			border.top.color = getColorVAFromVarString(border.top.color);
			border.right.color = getColorVAFromVarString(border.right.color);
			border.bottom.color = getColorVAFromVarString(border.bottom.color);
			border.left.color = getColorVAFromVarString(border.left.color);

			attributes.publisherBorder = border;
		}
		// is all and does not use var color
		else if (
			attributes?.style?.border?.width !== undefined ||
			attributes?.style?.border?.style !== undefined ||
			attributes?.style?.border?.color !== undefined
		) {
			attributes.publisherBorder = {
				type: 'all',
				all: {
					width: attributes?.style?.border?.width ?? '',
					style: attributes?.style?.border?.style ?? 'solid',
					color: attributes?.style?.border?.color ?? '',
				},
			};
		}
	}

	return attributes;
}

export function borderToWPCompatibility({
	newValue,
	ref,
}: {
	newValue: Object,
	ref?: Object,
}): Object {
	if ('reset' === ref?.current?.action || newValue === '') {
		return {
			borderColor: undefined,
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
	}

	if (newValue.type === 'all') {
		if (isValid(newValue?.all?.color)) {
			return {
				borderColor: newValue?.all?.color?.settings?.id,
				style: {
					border: {
						color: undefined,
						width: newValue?.all?.width,
						style: newValue?.all?.style ? newValue?.all?.style : '',
						top: undefined,
						right: undefined,
						bottom: undefined,
						left: undefined,
					},
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
		const border = {
			style: {
				border: {
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
						style: newValue?.right?.style
							? newValue?.right?.style
							: '',
						color: newValue?.right?.color,
					},
					bottom: {
						width: newValue?.bottom?.width,
						style: newValue?.bottom?.style
							? newValue?.bottom?.style
							: '',
						color: newValue?.bottom?.color,
					},
					left: {
						width: newValue?.left?.width,
						style: newValue?.left?.style
							? newValue?.left?.style
							: '',
						color: newValue?.left?.color,
					},
				},
			},
		};

		if (isValid(border.style.border.top.color)) {
			border.style.border.top.color =
				'var:preset|color|' +
				border.style.border.top.color?.settings?.id;
		}

		if (isValid(border.style.border.right.color)) {
			border.style.border.right.color =
				'var:preset|color|' +
				border.style.border.right.color?.settings?.id;
		}

		if (isValid(border.style.border.bottom.color)) {
			border.style.border.bottom.color =
				'var:preset|color|' +
				border.style.border.bottom.color?.settings?.id;
		}

		if (isValid(border.style.border.left.color)) {
			border.style.border.left.color =
				'var:preset|color|' +
				border.style.border.left.color?.settings?.id;
		}

		return border;
	}

	return {};
}
