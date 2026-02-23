// @flow

/**
 * Blockera dependencies
 */
import { isUndefined, mergeObject } from '@blockera/utils';
import { isValid } from '@blockera/controls';
import { getColorVAFromVarString } from '@blockera/data';

/**
 * Internal dependencies
 */
import type { BlockDetail } from '../../block-card/block-states/types';
import { runInsideBlockInspector } from '../../utils';

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
	insideBlockInspector = true,
	editorSelectedBlockEvent,
}: {
	attributes: Object,
	insideBlockInspector?: boolean,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
}): Object {
	if (attributes?.blockeraFontColor?.value === '') {
		// textColor attribute in root always is variable
		// it should be changed to a Value Addon (variable)
		if (attributes?.textColor || attributes?.color?.text) {
			const color = getColorVAFromVarString(
				runInsideBlockInspector(
					insideBlockInspector,
					editorSelectedBlockEvent
				)
					? `var:preset|color|${attributes?.textColor}`
					: attributes?.color?.text
			);

			if (color) {
				attributes.blockeraFontColor = {
					value: color,
				};

				return attributes;
			}
		}

		// Check block-level style (insideBlockInspector) or global style context
		const textColor = runInsideBlockInspector(
			insideBlockInspector,
			editorSelectedBlockEvent
		)
			? attributes?.style?.color?.text
			: attributes?.color?.text;

		// font color is not variable
		if (textColor) {
			attributes.blockeraFontColor = {
				value: textColor,
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
	insideBlockInspector = true,
	editorSelectedBlockEvent,
}: {
	newValue: Object,
	ref?: Object,
	getAttributes: () => Object,
	blockDetail: BlockDetail,
	insideBlockInspector?: boolean,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
}): Object {
	const attributes = getAttributes();

	if ('reset' === ref?.current?.action || newValue === '') {
		// Check block-level style (insideBlockInspector) or global style context
		const currentTextColor = runInsideBlockInspector(
			insideBlockInspector,
			editorSelectedBlockEvent
		)
			? attributes?.style?.color?.text
			: attributes?.color?.text;
		const linkTextColor = runInsideBlockInspector(
			insideBlockInspector,
			editorSelectedBlockEvent
		)
			? attributes?.style?.elements?.link?.color?.text
			: attributes?.elements?.link?.color?.text;

		// link and font color are equal
		if (
			linkTextColor &&
			(isColorsEqual(currentTextColor, linkTextColor) ||
				isColorsEqual(attributes?.textColor, linkTextColor))
		) {
			let advancedAttrCleanup = {};

			// find inner blocks with font-color data compatibility and clear blockeraFontColor attribute
			if (blockDetail?.innerBlocks) {
				Object.keys(blockDetail.innerBlocks).forEach((innerBlock) => {
					if (
						!attributes?.blockeraInnerBlocks?.value?.[innerBlock]
							?.attributes?.blockeraFontColor
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

			if (
				runInsideBlockInspector(
					insideBlockInspector,
					editorSelectedBlockEvent
				)
			) {
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
				...advancedAttrCleanup,
				textColor: undefined,
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
			};
		}

		return runInsideBlockInspector(
			insideBlockInspector,
			editorSelectedBlockEvent
		)
			? {
					textColor: undefined,
					style: {
						color: {
							text: undefined,
						},
					},
				}
			: {
					color: {
						text: undefined,
					},
				};
	}

	// is valid font-color variable
	if (isValid(newValue)) {
		const linkTextColor = runInsideBlockInspector(
			insideBlockInspector,
			editorSelectedBlockEvent
		)
			? attributes?.style?.elements?.link?.color?.text
			: attributes?.elements?.link?.color?.text;

		if (isColorsEqual(attributes?.textColor, linkTextColor)) {
			return runInsideBlockInspector(
				insideBlockInspector,
				editorSelectedBlockEvent
			)
				? {
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
					}
				: {
						elements: {
							link: {
								color: {
									text:
										'var:preset|color|' +
										newValue?.settings?.id,
								},
							},
						},
					};
		}

		return runInsideBlockInspector(
			insideBlockInspector,
			editorSelectedBlockEvent
		)
			? {
					textColor: newValue?.settings?.id,
					style: {
						color: {
							text: undefined,
						},
					},
				}
			: {
					color: {
						text: undefined,
					},
				};
	}

	// Check if link and font color are equal
	const currentTextColor = runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
		? attributes?.style?.color?.text
		: attributes?.color?.text;
	const linkTextColor = runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
		? attributes?.style?.elements?.link?.color?.text
		: attributes?.elements?.link?.color?.text;

	if (currentTextColor === linkTextColor) {
		const blockeraInnerBlocks = {
			value: {
				'elements/link': {
					attributes: {
						blockeraFontColor: newValue,
					},
				},
			},
		};

		return runInsideBlockInspector(
			insideBlockInspector,
			editorSelectedBlockEvent
		)
			? {
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
					blockeraInnerBlocks,
				}
			: {
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
					blockeraInnerBlocks,
				};
	}

	// simple color
	return runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
		? {
				textColor: undefined,
				style: {
					color: {
						text: newValue,
					},
				},
			}
		: {
				color: {
					text: newValue,
				},
			};
}
