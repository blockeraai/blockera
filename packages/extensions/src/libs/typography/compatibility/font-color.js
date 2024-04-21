// @flow

/**
 * Blockera dependencies
 */
import { getColorVAFromIdString } from '@blockera/core-data';
import { isValid } from '@blockera/hooks/src/use-value-addon/helpers';
import { isUndefined } from '@blockera/utils';

function isColorsEqual(
	fontColor: void | string,
	linkColor: void | string
): boolean {
	if (isUndefined(fontColor) && isUndefined(linkColor)) {
		return true;
	}

	//$FlowFixMe
	if (!isUndefined(linkColor) && linkColor.startsWith('var:')) {
		//$FlowFixMe
		return 'var:preset|color|' + fontColor === linkColor;
	}

	return fontColor === linkColor;
}

export function fontColorFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (attributes?.blockeraFontColor === '') {
		// textColor attribute in root always is variable
		// it should be changed to a Value Addon (variable)
		if (attributes?.textColor !== undefined) {
			const color = getColorVAFromIdString(attributes?.textColor);

			if (color) {
				return {
					blockeraFontColor: color,
				};
			}
		}

		// font size is not variable
		if (attributes?.style?.color?.text !== undefined) {
			return {
				blockeraFontColor: attributes?.style?.color?.text,
			};
		}
	}

	return false;
}

export function fontColorToWPCompatibility({
	newValue,
	ref,
	getAttributes,
}: {
	newValue: Object,
	ref?: Object,
	getAttributes: () => Object,
}): Object {
	const attributes: {
		textColor: void | string,
		style: {
			color: {
				text: void | string,
			},
			elements: {
				link: {
					color: {
						text: void | string,
					},
				},
			},
		},
	} = getAttributes();

	if ('reset' === ref?.current?.action || newValue === '') {
		// link and font color are equal
		if (
			isColorsEqual(
				attributes?.style?.color?.text,
				attributes?.style?.elements?.link?.color?.text
			) ||
			isColorsEqual(
				attributes?.textColor,
				attributes?.style?.elements?.link?.color?.text
			)
		) {
			return {
				textColor: undefined,
				style: {
					color: {
						text: undefined,
					},
					elements: {
						link: {
							color: {
								text: undefined,
							},
						},
					},
				},
			};
		}

		return {
			textColor: undefined,
			style: {
				color: {
					text: undefined,
				},
			},
		};
	}

	// is valid font-size variable
	if (isValid(newValue)) {
		if (
			isColorsEqual(
				attributes?.textColor,
				attributes?.style?.elements?.link?.color?.text
			)
		) {
			return {
				textColor: newValue?.settings?.id,
				style: {
					color: {
						text: undefined,
					},
					elements: {
						link: {
							color: {
								text:
									'var:preset|color|' +
									newValue?.settings?.id,
							},
						},
					},
				},
			};
		}

		return {
			textColor: newValue?.settings?.id,
			style: {
				color: {
					text: undefined,
				},
			},
		};
	}

	// link and font color are equal
	if (
		attributes?.style?.color?.text ===
		attributes?.style?.elements?.link?.color?.text
	) {
		return {
			textColor: undefined,
			style: {
				color: {
					text: newValue,
				},
				elements: {
					link: {
						color: {
							text: newValue,
						},
					},
				},
			},
		};
	}

	// simple color
	return {
		textColor: undefined,
		style: {
			color: {
				text: newValue,
			},
		},
	};
}
