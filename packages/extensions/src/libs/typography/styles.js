/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

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
import { BlockEditContext } from '../../hooks';
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
		publisherTextStrokeColor,
		publisherWordBreak,
	},
}) {
	const { attributes: currBlockAttributes, ...blockProps } =
		useContext(BlockEditContext);

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
		currBlockAttributes.publisherTextColumns !==
			attributes.publisherTextColumns.default
	) {
		switch (currBlockAttributes.publisherTextColumns) {
			case '2-columns':
				properties['column-count'] = '2';
				break;

			case '3-columns':
				properties['column-count'] = '3';
				break;

			case '4-columns':
				properties['column-count'] = '4';
				break;

			case '5-columns':
				properties['column-count'] = '5';
				break;

			case 'none':
				properties['column-count'] = 'initial';
				break;
		}

		switch (currBlockAttributes.publisherTextColumns) {
			case '2-columns':
			case '3-columns':
			case '4-columns':
			case '5-columns':
			case 'none':
				const gap = getValueAddonRealValue(
					currBlockAttributes.publisherTextColumnsGap
				);

				if (gap !== attributes.publisherTextColumnsGap.default) {
					properties['column-gap'] = gap;
				}

				const color = getValueAddonRealValue(
					currBlockAttributes.publisherTextColumnsDividerColor
				);

				if (
					color !==
					attributes.publisherTextColumnsDividerColor.default
				) {
					properties['column-rule-color'] = color;
				}

				if (
					currBlockAttributes.publisherTextColumnsDividerStyle !==
					attributes.publisherTextColumnsDividerStyle.default
				) {
					properties['column-rule-style'] =
						currBlockAttributes.publisherTextColumnsDividerStyle;
				}

				if (
					currBlockAttributes.publisherTextColumnsDividerWidth !==
					attributes.publisherTextColumnsDividerWidth.default
				) {
					properties['column-rule-width'] =
						currBlockAttributes.publisherTextColumnsDividerWidth;
				}

				break;
		}
	}

	if (
		isActiveField(publisherTextStrokeColor) &&
		currBlockAttributes.publisherTextStrokeColor !==
			attributes.publisherTextStrokeColor.default
	) {
		properties['-webkit-text-stroke'] =
			getValueAddonRealValue(
				currBlockAttributes.publisherTextStrokeWidth
			) +
			' ' +
			currBlockAttributes.publisherTextStrokeColor;
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
					cssGenerators: {
						publisherTypography: [
							{
								type: 'static',
								selector: '.{{BLOCK_ID}}',
								properties: { ...properties },
							},
						],
					},
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
					cssGenerators: {
						publisherTextShadow: [
							{
								type: 'function',
								function: TextShadowGenerator,
							},
						],
						...(publisherTextShadow?.cssGenerators || {}),
					},
				},
				{ attributes: currBlockAttributes, ...blockProps }
			)
		);
	}

	generators.push(
		computedCssRules(
			{
				cssGenerators: {
					...(cssGenerators || {}),
				},
			},
			{ attributes: currBlockAttributes, ...blockProps }
		)
	);

	return generators.length > 1 ? generators.join('\n') : generators.join('');
}
