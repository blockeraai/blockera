/**
 * Publisher dependencies
 */
import { computedCssRules } from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';

/**
 * Internal dependencies
 */
import { arrayEquals } from '../utils';
import { attributes } from './attributes';
import { isActiveField } from '../../api/utils';
import { TextShadowGenerator } from './css-generators';

export function TypographyStyles({
	typographyConfig: {
		cssGenerators,
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
	},
	blockProps,
	selector,
	media,
}) {
	const { attributes: currBlockAttributes } = blockProps;

	const properties = {};
	const generators = [];

	if (isActiveField(publisherFontColor)) {
		const color = getValueAddonRealValue(
			currBlockAttributes.publisherFontColor
		);

		if (color !== attributes.publisherFontColor.default)
			properties.color = color;
	}

	if (isActiveField(publisherFontSize)) {
		const fontSize = getValueAddonRealValue(
			currBlockAttributes.publisherFontSize
		);

		if (fontSize !== attributes.publisherFontSize.default)
			properties['font-size'] = fontSize;
	}

	if (isActiveField(publisherLineHeight)) {
		const lineHeight = getValueAddonRealValue(
			currBlockAttributes.publisherLineHeight
		);

		if (lineHeight !== attributes.publisherLineHeight.default)
			properties['line-height'] = lineHeight;
	}

	if (
		isActiveField(publisherTextAlign) &&
		currBlockAttributes.publisherTextAlign !==
			attributes.publisherTextAlign.default
	) {
		properties['text-align'] = currBlockAttributes.publisherTextAlign;
	}

	if (
		isActiveField(publisherTextDecoration) &&
		currBlockAttributes.publisherTextDecoration !==
			attributes.publisherTextDecoration.default
	) {
		properties['text-decoration'] =
			currBlockAttributes.publisherTextDecoration;
	}

	if (
		isActiveField(publisherFontStyle) &&
		currBlockAttributes.publisherFontStyle !==
			attributes.publisherFontStyle.default
	) {
		properties['font-style'] = currBlockAttributes.publisherFontStyle;
	}

	if (
		isActiveField(publisherTextTransform) &&
		currBlockAttributes.publisherTextTransform !==
			attributes.publisherTextTransform.default
	) {
		properties['text-transform'] =
			currBlockAttributes.publisherTextTransform;
	}

	if (
		isActiveField(publisherDirection) &&
		currBlockAttributes.publisherDirection !==
			attributes.publisherDirection.default
	) {
		properties.direction = currBlockAttributes.publisherDirection;
	}

	if (isActiveField(publisherLetterSpacing)) {
		const letterSpacing = getValueAddonRealValue(
			currBlockAttributes.publisherLetterSpacing
		);

		if (letterSpacing !== attributes.publisherLetterSpacing.default)
			properties['letter-spacing'] = letterSpacing;
	}

	if (isActiveField(publisherWordSpacing)) {
		const wordSpacing = getValueAddonRealValue(
			currBlockAttributes.publisherWordSpacing
		);

		if (wordSpacing !== attributes.publisherWordSpacing.default)
			properties['word-spacing'] = wordSpacing;
	}

	if (isActiveField(publisherTextIndent)) {
		const textIndent = getValueAddonRealValue(
			currBlockAttributes.publisherTextIndent
		);

		if (textIndent !== attributes.publisherTextIndent.default)
			properties['text-indent'] = textIndent;
	}

	if (
		isActiveField(publisherTextOrientation) &&
		currBlockAttributes.publisherTextOrientation &&
		currBlockAttributes.publisherTextOrientation !==
			attributes.publisherTextOrientation.default
	) {
		properties['writing-mode'] =
			currBlockAttributes.publisherTextOrientation['writing-mode'];
		properties['text-orientation'] =
			currBlockAttributes.publisherTextOrientation['text-orientation'];
	}

	if (
		isActiveField(publisherTextColumns) &&
		currBlockAttributes.publisherTextColumns &&
		currBlockAttributes.publisherTextColumns !==
			attributes.publisherTextColumns.default
	) {
		properties['column-count'] =
			currBlockAttributes.publisherTextColumns.columns
				.replace('-columns', '')
				.replace('none', 'initial');

		if (properties['column-count'] !== 'initial') {
			const gap = getValueAddonRealValue(
				currBlockAttributes.publisherTextColumns.gap
			);

			if (gap !== '') {
				properties['column-gap'] = gap;
			}

			if (currBlockAttributes.publisherTextColumns.divider.width !== '') {
				const color = getValueAddonRealValue(
					currBlockAttributes.publisherTextColumns?.divider?.color
				);

				if (color !== '') {
					properties['column-rule-color'] = color;
				}

				properties['column-rule-width'] =
					currBlockAttributes.publisherTextColumns.divider.width;

				properties['column-rule-style'] =
					currBlockAttributes.publisherTextColumns.divider.style ||
					'solid';
			}
		}
	}

	if (
		isActiveField(publisherTextStroke) &&
		currBlockAttributes.publisherTextStroke &&
		currBlockAttributes.publisherTextStroke !==
			attributes.publisherTextStroke.default
	) {
		const textStrokeColor = getValueAddonRealValue(
			currBlockAttributes.publisherTextStroke?.color
		);

		if (textStrokeColor !== '') {
			properties['-webkit-text-stroke'] =
				currBlockAttributes.publisherTextStroke?.width +
				' ' +
				textStrokeColor;
		}
	}

	if (
		isActiveField(publisherWordBreak) &&
		currBlockAttributes.publisherWordBreak !==
			attributes.publisherWordBreak.default &&
		currBlockAttributes.publisherWordBreak !== 'normal'
	) {
		properties['word-break'] = currBlockAttributes.publisherWordBreak;
	}

	//
	if (properties) {
		generators.push(
			computedCssRules(
				{
					publisherTypography: [
						{
							type: 'static',
							media,
							selector,
							properties: { ...properties },
						},
					],
				},
				{ attributes: currBlockAttributes, ...blockProps }
			)
		);
	}

	if (
		isActiveField(publisherTextShadow) &&
		!arrayEquals(
			attributes.publisherTextShadow.default,
			currBlockAttributes.publisherTextShadow
		)
	) {
		generators.push(
			computedCssRules(
				{
					publisherTextShadow: [
						{
							media,
							selector,
							type: 'function',
							function: TextShadowGenerator,
						},
					],
					...(publisherTextShadow?.cssGenerators || {}),
				},
				{ attributes: currBlockAttributes, ...blockProps }
			)
		);
	}

	generators.push(
		computedCssRules(
			{
				...(cssGenerators || {}),
			},
			{ attributes: currBlockAttributes, ...blockProps }
		)
	);

	return generators.length > 1 ? generators.join('\n') : generators.join('');
}
