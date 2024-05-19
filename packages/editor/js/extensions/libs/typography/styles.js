// @flow

/**
 * Blockera dependencies
 */
import { isEmptyObject } from '@blockera/utils';
import { getValueAddonRealValue } from '@blockera/editor';

/**
 * Internal dependencies
 */
import { arrayEquals } from '../utils';
import * as config from '../base/config';
import { attributes } from './attributes';
import type { StylesProps } from '../types';
import { isActiveField } from '../../api/utils';
import { TextShadowGenerator } from './css-generators';
import type { CssRule } from '../../../style-engine/types';
import { computedCssDeclarations, getCssSelector } from '../../../style-engine';

export function TypographyStyles({
	state,
	clientId,
	blockName,
	currentBlock,
	selectors: blockSelectors,
	attributes: currentBlockAttributes,
	...props
}: StylesProps): Array<CssRule> {
	const {
		blockeraFontSize,
		blockeraLineHeight,
		blockeraTextAlign,
		blockeraFontColor,
		blockeraTextDecoration,
		blockeraTextShadow,
		blockeraFontStyle,
		blockeraTextTransform,
		blockeraDirection,
		blockeraLetterSpacing,
		blockeraWordSpacing,
		blockeraTextIndent,
		blockeraTextOrientation,
		blockeraTextColumns,
		blockeraTextStroke,
		blockeraWordBreak,
	} = config.typographyConfig;

	const blockProps = {
		clientId,
		blockName,
		attributes: currentBlockAttributes,
	};

	const sharedParams = {
		...props,
		state,
		clientId,
		currentBlock,
		blockSelectors,
		className: currentBlockAttributes?.className,
	};

	const styleGroup: Array<CssRule> = [];

	if (isActiveField(blockeraFontSize)) {
		const blockeraFontSize = getValueAddonRealValue(
			blockProps.attributes.blockeraFontSize
		);

		if (blockeraFontSize !== attributes.blockeraFontSize.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraFontSize',
				support: 'blockeraFontSize',
				fallbackSupportId: 'font-size',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraFontSize: [
							{
								type: 'static',
								properties: {
									'font-size':
										blockeraFontSize + ' !important',
								},
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (isActiveField(blockeraLineHeight)) {
		const blockeraLineHeight = getValueAddonRealValue(
			blockProps.attributes.blockeraLineHeight
		);

		if (blockeraLineHeight !== attributes.blockeraLineHeight.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraLineHeight',
				support: 'blockeraLineHeight',
				fallbackSupportId: 'line-height',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraLineHeight: [
							{
								type: 'static',
								properties: {
									'line-height':
										blockeraLineHeight + ' !important',
								},
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (isActiveField(blockeraFontColor)) {
		const blockeraFontColor = getValueAddonRealValue(
			blockProps.attributes.blockeraFontColor
		);

		if (blockeraFontColor !== attributes.blockeraFontColor.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraFontColor',
				support: 'blockeraFontColor',
				fallbackSupportId: 'color',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraBackgroundColor: [
							{
								type: 'static',
								properties: {
									color: blockeraFontColor,
								},
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (isActiveField(blockeraTextAlign)) {
		const blockeraTextAlign = blockProps.attributes.blockeraTextAlign;

		if (blockeraTextAlign !== attributes.blockeraTextAlign.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraTextAlign',
				support: 'blockeraTextAlign',
				fallbackSupportId: 'text-align;',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraTextAlign: [
							{
								type: 'static',
								properties: {
									'text-align': blockeraTextAlign,
								},
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (isActiveField(blockeraTextDecoration)) {
		const blockeraTextDecoration =
			blockProps.attributes.blockeraTextDecoration;

		if (
			blockeraTextDecoration !== attributes.blockeraTextDecoration.default
		) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraTextDecoration',
				support: 'blockeraTextDecoration',
				fallbackSupportId: 'text-decoration',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraTextDecoration: [
							{
								type: 'static',
								properties: {
									'text-decoration': blockeraTextDecoration,
								},
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (isActiveField(blockeraFontStyle)) {
		const blockeraFontStyle = blockProps.attributes.blockeraFontStyle;

		if (blockeraFontStyle !== attributes.blockeraFontStyle.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraFontStyle',
				support: 'blockeraFontStyle',
				fallbackSupportId: 'font-style',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraFontStyle: [
							{
								type: 'static',
								properties: {
									'font-style': blockeraFontStyle,
								},
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (isActiveField(blockeraTextTransform)) {
		const blockeraTextTransform =
			blockProps.attributes.blockeraTextTransform;

		if (
			blockeraTextTransform !== attributes.blockeraTextTransform.default
		) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraTextTransform',
				support: 'blockeraTextTransform',
				fallbackSupportId: 'text-transform',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraTextTransform: [
							{
								type: 'static',
								properties: {
									'text-transform': blockeraTextTransform,
								},
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (isActiveField(blockeraDirection)) {
		const blockeraDirection = blockProps.attributes.blockeraDirection;

		if (blockeraDirection !== attributes.blockeraDirection.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraDirection',
				support: 'blockeraDirection',
				fallbackSupportId: 'direction',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraDirection: [
							{
								type: 'static',
								properties: {
									direction: blockeraDirection,
								},
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (isActiveField(blockeraLetterSpacing)) {
		const blockeraLetterSpacing =
			blockProps.attributes.blockeraLetterSpacing;

		if (
			blockeraLetterSpacing !== attributes.blockeraLetterSpacing.default
		) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraLetterSpacing',
				support: 'blockeraLetterSpacing',
				fallbackSupportId: 'letter-spacing',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraLetterSpacing: [
							{
								type: 'static',
								properties: {
									'letter-spacing': blockeraLetterSpacing,
								},
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (isActiveField(blockeraWordSpacing)) {
		const blockeraWordSpacing = blockProps.attributes.blockeraWordSpacing;

		if (blockeraWordSpacing !== attributes.blockeraWordSpacing.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraWordSpacing',
				support: 'blockeraWordSpacing',
				fallbackSupportId: 'word-spacing',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraWordSpacing: [
							{
								type: 'static',
								properties: {
									'word-spacing': blockeraWordSpacing,
								},
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (isActiveField(blockeraTextIndent)) {
		const blockeraTextIndent = blockProps.attributes.blockeraTextIndent;

		if (blockeraTextIndent !== attributes.blockeraTextIndent.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraTextIndent',
				support: 'blockeraTextIndent',
				fallbackSupportId: 'text-indent',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraTextIndent: [
							{
								type: 'static',
								properties: {
									'text-indent': blockeraTextIndent,
								},
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (isActiveField(blockeraTextOrientation)) {
		const blockeraTextOrientation =
			blockProps.attributes.blockeraTextOrientation;

		if (
			blockeraTextOrientation !==
			attributes.blockeraTextOrientation.default
		) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraTextOrientation',
				support: 'blockeraTextOrientation',
				fallbackSupportId: 'text-orientation',
			});

			const properties: {
				'writing-mode'?: string,
				'text-orientation'?: string,
			} = {};

			switch (blockeraTextOrientation) {
				case 'style-1':
					properties['writing-mode'] = 'vertical-lr' + ' !important';
					properties['text-orientation'] = 'mixed' + ' !important';
					break;
				case 'style-2':
					properties['writing-mode'] = 'vertical-rl' + ' !important';
					properties['text-orientation'] = 'mixed' + ' !important';
					break;
				case 'style-3':
					properties['writing-mode'] = 'vertical-lr' + ' !important';
					properties['text-orientation'] = 'upright' + ' !important';
					break;
				case 'style-4':
					properties['writing-mode'] = 'vertical-rl' + ' !important';
					properties['text-orientation'] = 'upright' + ' !important';
					break;
				case 'initial':
					properties['writing-mode'] =
						'horizontal-tb' + ' !important';
					properties['text-orientation'] = 'mixed' + ' !important';
			}

			if (!isEmptyObject(properties))
				styleGroup.push({
					selector: pickedSelector,
					declarations: computedCssDeclarations(
						{
							blockeraTextOrientation: [
								{
									type: 'static',
									properties,
								},
							],
						},
						blockProps
					),
				});
		}
	}

	if (isActiveField(blockeraTextColumns)) {
		const blockeraTextColumns = blockProps.attributes.blockeraTextColumns;

		if (blockeraTextColumns !== attributes.blockeraTextColumns.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraTextColumns',
				support: 'blockeraTextColumns',
				fallbackSupportId: 'text-columns',
			});

			const properties: {
				'column-count'?: string,
				'column-gap'?: string,
				'column-rule-color'?: string,
				'column-rule-width'?: string,
				'column-rule-style'?: string,
			} = {};

			properties['column-count'] = blockeraTextColumns.columns
				.replace('-columns', '')
				.replace('none', 'initial');

			if (properties['column-count'] !== 'initial') {
				const gap = getValueAddonRealValue(blockeraTextColumns.gap);

				if (gap !== '') {
					properties['column-gap'] = gap;
				}

				if (
					blockeraTextColumns?.divider?.width !== undefined &&
					blockeraTextColumns?.divider?.width !== ''
				) {
					const color = getValueAddonRealValue(
						blockeraTextColumns?.divider?.color
					);

					if (color !== '') {
						properties['column-rule-color'] = color;
					}

					properties['column-rule-width'] =
						blockeraTextColumns.divider.width;

					properties['column-rule-style'] =
						blockeraTextColumns.divider.style || 'solid';
				}
			}

			if (!isEmptyObject(properties))
				styleGroup.push({
					selector: pickedSelector,
					declarations: computedCssDeclarations(
						{
							blockeraTextColumns: [
								{
									type: 'static',
									properties,
								},
							],
						},
						blockProps
					),
				});
		}
	}

	if (isActiveField(blockeraTextStroke)) {
		const blockeraTextStroke = blockProps.attributes.blockeraTextStroke;

		if (blockeraTextStroke !== attributes.blockeraTextStroke.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraTextStroke',
				support: 'blockeraTextStroke',
				fallbackSupportId: 'text-stroke',
			});

			const textStrokeColor = getValueAddonRealValue(
				blockeraTextStroke?.color
			);

			if (textStrokeColor !== '') {
				styleGroup.push({
					selector: pickedSelector,
					declarations: computedCssDeclarations(
						{
							blockeraTextStroke: [
								{
									type: 'static',
									properties: {
										'-webkit-text-stroke':
											blockeraTextStroke?.width +
											' ' +
											textStrokeColor,
									},
								},
							],
						},
						blockProps
					),
				});
			}
		}
	}

	if (isActiveField(blockeraWordBreak)) {
		const blockeraWordBreak = blockProps.attributes.blockeraWordBreak;

		if (
			blockeraWordBreak !== attributes.blockeraWordBreak.default &&
			blockeraWordBreak !== 'normal'
		) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraWordBreak',
				support: 'blockeraWordBreak',
				fallbackSupportId: 'word-break',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraWordBreak: [
							{
								type: 'static',
								properties: {
									'word-break': blockeraWordBreak,
								},
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (
		isActiveField(blockeraTextShadow) &&
		!arrayEquals(
			attributes.blockeraTextShadow.default,
			blockProps.attributes.blockeraTextShadow
		)
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'blockeraTextShadow',
			support: 'blockeraTextShadow',
			fallbackSupportId: 'text-shadow',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraTextShadow: [
						{
							type: 'function',
							function: TextShadowGenerator,
						},
					],
				},
				blockProps
			),
		});
	}

	return styleGroup;
}
