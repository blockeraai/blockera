// @flow

/**
 * Publisher dependencies
 */
import {
	computedCssDeclarations,
	getCssSelector,
} from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';
import type { CssRule } from '@publisher/style-engine/src/types';
import { isEmptyObject } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { arrayEquals } from '../utils';
import { attributes } from './attributes';
import { isActiveField } from '../../api/utils';
import { TextShadowGenerator } from './css-generators';
import * as config from '../base/config';
import type { StylesProps } from '../types';

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
		publisherFontSize,
		publisherLineHeight,
		publisherTextAlign,
		publisherFontColor,
		publisherTextDecoration,
		publisherTextShadow,
		publisherFontStyle,
		publisherTextTransform,
		publisherDirection,
		publisherLetterSpacing,
		publisherWordSpacing,
		publisherTextIndent,
		publisherTextOrientation,
		publisherTextColumns,
		publisherTextStroke,
		publisherWordBreak,
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

	if (isActiveField(publisherFontSize)) {
		const publisherFontSize = getValueAddonRealValue(
			blockProps.attributes.publisherFontSize
		);

		if (publisherFontSize !== attributes.publisherFontSize.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherFontSize',
				support: 'publisherFontSize',
				fallbackSupportId: 'font-size',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherFontSize: [
							{
								type: 'static',
								properties: {
									'font-size':
										publisherFontSize + ' !important',
								},
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (isActiveField(publisherLineHeight)) {
		const publisherLineHeight = getValueAddonRealValue(
			blockProps.attributes.publisherLineHeight
		);

		if (publisherLineHeight !== attributes.publisherLineHeight.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherLineHeight',
				support: 'publisherLineHeight',
				fallbackSupportId: 'line-height',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherLineHeight: [
							{
								type: 'static',
								properties: {
									'line-height':
										publisherLineHeight + ' !important',
								},
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (isActiveField(publisherFontColor)) {
		const publisherFontColor = getValueAddonRealValue(
			blockProps.attributes.publisherFontColor
		);

		if (publisherFontColor !== attributes.publisherFontColor.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherFontColor',
				support: 'publisherFontColor',
				fallbackSupportId: 'color',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherBackgroundColor: [
							{
								type: 'static',
								properties: {
									color: publisherFontColor,
								},
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (isActiveField(publisherTextAlign)) {
		const publisherTextAlign = blockProps.attributes.publisherTextAlign;

		if (publisherTextAlign !== attributes.publisherTextAlign.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherTextAlign',
				support: 'publisherTextAlign',
				fallbackSupportId: 'text-align;',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherTextAlign: [
							{
								type: 'static',
								properties: {
									'text-align': publisherTextAlign,
								},
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (isActiveField(publisherTextDecoration)) {
		const publisherTextDecoration =
			blockProps.attributes.publisherTextDecoration;

		if (
			publisherTextDecoration !==
			attributes.publisherTextDecoration.default
		) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherTextDecoration',
				support: 'publisherTextDecoration',
				fallbackSupportId: 'text-decoration',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherTextDecoration: [
							{
								type: 'static',
								properties: {
									'text-decoration': publisherTextDecoration,
								},
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (isActiveField(publisherFontStyle)) {
		const publisherFontStyle = blockProps.attributes.publisherFontStyle;

		if (publisherFontStyle !== attributes.publisherFontStyle.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherFontStyle',
				support: 'publisherFontStyle',
				fallbackSupportId: 'font-style',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherFontStyle: [
							{
								type: 'static',
								properties: {
									'font-style': publisherFontStyle,
								},
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (isActiveField(publisherTextTransform)) {
		const publisherTextTransform =
			blockProps.attributes.publisherTextTransform;

		if (
			publisherTextTransform !== attributes.publisherTextTransform.default
		) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherTextTransform',
				support: 'publisherTextTransform',
				fallbackSupportId: 'text-transform',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherTextTransform: [
							{
								type: 'static',
								properties: {
									'text-transform': publisherTextTransform,
								},
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (isActiveField(publisherDirection)) {
		const publisherDirection = blockProps.attributes.publisherDirection;

		if (publisherDirection !== attributes.publisherDirection.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherDirection',
				support: 'publisherDirection',
				fallbackSupportId: 'direction',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherDirection: [
							{
								type: 'static',
								properties: {
									direction: publisherDirection,
								},
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (isActiveField(publisherLetterSpacing)) {
		const publisherLetterSpacing =
			blockProps.attributes.publisherLetterSpacing;

		if (
			publisherLetterSpacing !== attributes.publisherLetterSpacing.default
		) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherLetterSpacing',
				support: 'publisherLetterSpacing',
				fallbackSupportId: 'letter-spacing',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherLetterSpacing: [
							{
								type: 'static',
								properties: {
									'letter-spacing': publisherLetterSpacing,
								},
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (isActiveField(publisherWordSpacing)) {
		const publisherWordSpacing = blockProps.attributes.publisherWordSpacing;

		if (publisherWordSpacing !== attributes.publisherWordSpacing.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherWordSpacing',
				support: 'publisherWordSpacing',
				fallbackSupportId: 'word-spacing',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherWordSpacing: [
							{
								type: 'static',
								properties: {
									'word-spacing': publisherWordSpacing,
								},
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (isActiveField(publisherTextIndent)) {
		const publisherTextIndent = blockProps.attributes.publisherTextIndent;

		if (publisherTextIndent !== attributes.publisherTextIndent.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherTextIndent',
				support: 'publisherTextIndent',
				fallbackSupportId: 'text-indent',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherTextIndent: [
							{
								type: 'static',
								properties: {
									'text-indent': publisherTextIndent,
								},
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (isActiveField(publisherTextOrientation)) {
		const publisherTextOrientation =
			blockProps.attributes.publisherTextOrientation;

		if (
			publisherTextOrientation !==
			attributes.publisherTextOrientation.default
		) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherTextOrientation',
				support: 'publisherTextOrientation',
				fallbackSupportId: 'text-orientation',
			});

			const properties: {
				'writing-mode'?: string,
				'text-orientation'?: string,
			} = {};

			switch (publisherTextOrientation) {
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
							publisherTextOrientation: [
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

	if (isActiveField(publisherTextColumns)) {
		const publisherTextColumns = blockProps.attributes.publisherTextColumns;

		if (publisherTextColumns !== attributes.publisherTextColumns.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherTextColumns',
				support: 'publisherTextColumns',
				fallbackSupportId: 'text-columns',
			});

			const properties: {
				'column-count'?: string,
				'column-gap'?: string,
				'column-rule-color'?: string,
				'column-rule-width'?: string,
				'column-rule-style'?: string,
			} = {};

			properties['column-count'] = publisherTextColumns.columns
				.replace('-columns', '')
				.replace('none', 'initial');

			if (properties['column-count'] !== 'initial') {
				const gap = getValueAddonRealValue(publisherTextColumns.gap);

				if (gap !== '') {
					properties['column-gap'] = gap;
				}

				if (
					publisherTextColumns?.divider?.width !== undefined &&
					publisherTextColumns?.divider?.width !== ''
				) {
					const color = getValueAddonRealValue(
						publisherTextColumns?.divider?.color
					);

					if (color !== '') {
						properties['column-rule-color'] = color;
					}

					properties['column-rule-width'] =
						publisherTextColumns.divider.width;

					properties['column-rule-style'] =
						publisherTextColumns.divider.style || 'solid';
				}
			}

			if (!isEmptyObject(properties))
				styleGroup.push({
					selector: pickedSelector,
					declarations: computedCssDeclarations(
						{
							publisherTextColumns: [
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

	if (isActiveField(publisherTextStroke)) {
		const publisherTextStroke = blockProps.attributes.publisherTextStroke;

		if (publisherTextStroke !== attributes.publisherTextStroke.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherTextStroke',
				support: 'publisherTextStroke',
				fallbackSupportId: 'text-stroke',
			});

			const textStrokeColor = getValueAddonRealValue(
				publisherTextStroke?.color
			);

			if (textStrokeColor !== '') {
				styleGroup.push({
					selector: pickedSelector,
					declarations: computedCssDeclarations(
						{
							publisherTextStroke: [
								{
									type: 'static',
									properties: {
										'-webkit-text-stroke':
											publisherTextStroke?.width +
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

	if (isActiveField(publisherWordBreak)) {
		const publisherWordBreak = blockProps.attributes.publisherWordBreak;

		if (
			publisherWordBreak !== attributes.publisherWordBreak.default &&
			publisherWordBreak !== 'normal'
		) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherWordBreak',
				support: 'publisherWordBreak',
				fallbackSupportId: 'word-break',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherWordBreak: [
							{
								type: 'static',
								properties: {
									'word-break': publisherWordBreak,
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
		isActiveField(publisherTextShadow) &&
		!arrayEquals(
			attributes.publisherTextShadow.default,
			blockProps.attributes.publisherTextShadow
		)
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'publisherTextShadow',
			support: 'publisherTextShadow',
			fallbackSupportId: 'text-shadow',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					publisherTextShadow: [
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
