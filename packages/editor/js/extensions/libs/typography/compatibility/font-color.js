// @flow

/**
 * Blockera dependencies
 */
import { isUndefined, mergeObject } from '@blockera/utils';
import { isValid } from '@blockera/controls';
import { getColorVAFromIdString } from '@blockera/data';

/**
 * Internal dependencies
 */
import type { BlockDetail } from '../../block-card/block-states/types';

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
	if (attributes?.blockeraFontColor?.value === '') {
		// textColor attribute in root always is variable
		// it should be changed to a Value Addon (variable)
		if (attributes?.textColor !== undefined) {
			const color = getColorVAFromIdString(attributes?.textColor);

			if (color) {
				attributes.blockeraFontColor = {
					value: color,
				};

				return attributes;
			}
		}

		// font color is not variable
		if (attributes?.style?.color?.text !== undefined) {
			attributes.blockeraFontColor = {
				value: attributes?.style?.color?.text,
			};
			return attributes;
		}
	}

	return attributes;
}

export function fontColorToWPCompatibility({
	newValue,
	ref,
	getAttributes,
	blockDetail,
}: {
	newValue: Object,
	ref?: Object,
	getAttributes: () => Object,
	blockDetail: BlockDetail,
}): Object {
	const attributes = getAttributes();

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
			let advancedAttrCleanup = {};

			// find inner blocks with font-color data compatibility and clear blockeraFontColor attribute
			if (blockDetail?.innerBlocks) {
				Object.keys(blockDetail.innerBlocks).forEach((innerBlock) => {
					if (
						!attributes?.blockeraInnerBlocks[innerBlock]?.attributes
							?.blockeraFontColor
					) {
						return;
					}

					if (
						blockDetail.innerBlocks[
							innerBlock
						]?.settings?.dataCompatibility?.includes('font-color')
					) {
						advancedAttrCleanup = mergeObject(advancedAttrCleanup, {
							blockeraInnerBlocks: {
								value: {
									[innerBlock]: {
										attributes: {
											blockeraFontColor: undefined,
										},
									},
								},
							},
						});
					}
				});
			}

			return {
				...advancedAttrCleanup,
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
