// @flow

/**
 * Publisher dependencies
 */
import { getColor } from '@publisher/core-data';
import {
	generateVariableString,
	isValid,
} from '@publisher/hooks/src/use-value-addon/helpers';
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
			const colorVar = getColor(attributes?.borderColor);

			if (colorVar) {
				attributes.publisherBorder = {
					type: 'all',
					all: {
						width: attributes?.style?.border?.width ?? '',
						color: {
							settings: {
								...colorVar,
								type: 'color',
								var: generateVariableString({
									reference: colorVar?.reference || {
										type: '',
									},
									type: 'color',
									id: colorVar?.id || '',
								}),
							},
							name: colorVar?.name,
							isValueAddon: true,
							valueType: 'variable',
						},
						style: attributes?.style?.border?.style ?? 'solid',
					},
				};
			}
		}
		// does not use var color and not all type
		else if (attributes?.style?.border?.top !== undefined) {
			const border = {
				type: 'custom',
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
			if (border.top.color.startsWith('var:')) {
				const colorVar = getColor(border.top.color.split('|')[2]);

				console.log(colorVar, border.top.color.split('|'));
				if (colorVar) {
					border.top.color = {
						settings: {
							...colorVar,
							type: 'color',
							var: generateVariableString({
								reference: colorVar?.reference || {
									type: '',
								},
								type: 'color',
								id: colorVar?.id || '',
							}),
						},
						name: colorVar?.name,
						isValueAddon: true,
						valueType: 'variable',
					};
				}
			}

			// convert to var
			if (border.right.color.startsWith('var:')) {
				const colorVar = getColor(border.right.color.split('|')[2]);

				if (colorVar) {
					border.right.color = {
						settings: {
							...colorVar,
							type: 'color',
							var: generateVariableString({
								reference: colorVar?.reference || {
									type: '',
								},
								type: 'color',
								id: colorVar?.id || '',
							}),
						},
						name: colorVar?.name,
						isValueAddon: true,
						valueType: 'variable',
					};
				}
			}

			// convert to var
			if (border.bottom.color.startsWith('var:')) {
				const colorVar = getColor(border.bottom.color.split('|')[2]);

				if (colorVar) {
					border.bottom.color = {
						settings: {
							...colorVar,
							type: 'color',
							var: generateVariableString({
								reference: colorVar?.reference || {
									type: '',
								},
								type: 'color',
								id: colorVar?.id || '',
							}),
						},
						name: colorVar?.name,
						isValueAddon: true,
						valueType: 'variable',
					};
				}
			}

			// convert to var
			if (border.left.color.startsWith('var:')) {
				const colorVar = getColor(border.left.color.split('|')[2]);

				if (colorVar) {
					border.left.color = {
						settings: {
							...colorVar,
							type: 'color',
							var: generateVariableString({
								reference: colorVar?.reference || {
									type: '',
								},
								type: 'color',
								id: colorVar?.id || '',
							}),
						},
						name: colorVar?.name,
						isValueAddon: true,
						valueType: 'variable',
					};
				}
			}

			attributes.publisherBorder = border;
		} else if (
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
	if ('reset' === ref?.current?.action) {
		return {
			borderColor: undefined,
			style: {
				border: {
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
				},
			},
		};
	} else if (newValue.type === 'custom') {
		const border = {
			style: {
				border: {
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
