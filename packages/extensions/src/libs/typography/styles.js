/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { computedCssRules } from '@publisher/style-engine';

/**
 * Internal dependencies
 */
import { attributes } from './attributes';
import { BlockEditContext } from '../../hooks';
import { isActiveField } from '../../api/utils';
import { arrayEquals } from '../utils';
import { TextShadowFieldStyle } from '@publisher/fields';

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
	const { attributes: _attributes, ...blockProps } =
		useContext(BlockEditContext);

	const properties = {};
	const generators = [];

	if (
		isActiveField(publisherFontColor) &&
		_attributes.publisherFontColor !== attributes.publisherFontColor.default
	) {
		properties.color = _attributes.publisherFontColor;
	}

	if (
		isActiveField(publisherFontSize) &&
		_attributes.publisherFontSize !== attributes.publisherFontSize.default
	) {
		properties['font-size'] = _attributes.publisherFontSize;
	}

	if (
		isActiveField(publisherLineHeight) &&
		_attributes.publisherLineHeight !==
			attributes.publisherLineHeight.default
	) {
		properties['line-height'] = _attributes.publisherLineHeight;
	}

	if (
		isActiveField(publisherTextAlign) &&
		_attributes.publisherTextAlign !== attributes.publisherTextAlign.default
	) {
		properties['text-align'] = _attributes.publisherTextAlign;
	}

	if (
		isActiveField(publisherTextDecoration) &&
		_attributes.publisherTextDecoration !==
			attributes.publisherTextDecoration.default
	) {
		properties['text-decoration'] = _attributes.publisherTextDecoration;
	}

	if (
		isActiveField(publisherFontStyle) &&
		_attributes.publisherFontStyle !== attributes.publisherFontStyle.default
	) {
		properties['font-style'] = _attributes.publisherFontStyle;
	}

	if (
		isActiveField(publisherTextTransform) &&
		_attributes.publisherTextTransform !==
			attributes.publisherTextTransform.default
	) {
		properties['text-transform'] = _attributes.publisherTextTransform;
	}

	if (
		isActiveField(publisherDirection) &&
		_attributes.publisherDirection !== attributes.publisherDirection.default
	) {
		properties.direction = _attributes.publisherDirection;
	}

	if (
		isActiveField(publisherLetterSpacing) &&
		_attributes.publisherLetterSpacing !==
			attributes.publisherLetterSpacing.default
	) {
		properties['letter-spacing'] = _attributes.publisherLetterSpacing;
	}

	if (
		isActiveField(publisherWordSpacing) &&
		_attributes.publisherWordSpacing !==
			attributes.publisherWordSpacing.default
	) {
		properties['word-spacing'] = _attributes.publisherWordSpacing;
	}

	if (
		isActiveField(publisherTextIndent) &&
		_attributes.publisherTextIndent !==
			attributes.publisherTextIndent.default
	) {
		properties['text-indent'] = _attributes.publisherTextIndent;
	}

	if (
		isActiveField(publisherTextOrientation) &&
		_attributes.publisherTextOrientation !==
			attributes.publisherTextOrientation.default
	) {
		switch (_attributes.publisherTextOrientation) {
			case 'style-1':
				properties['writing-mode'] = 'vertical-lr';
				properties['text-orientation'] = 'mixed';
				break;

			case 'style-2':
				properties['writing-mode'] = 'vertical-rl';
				properties['text-orientation'] = 'mixed';
				break;

			case 'style-3':
				properties['writing-mode'] = 'vertical-lr';
				properties['text-orientation'] = 'upright';
				break;

			case 'style-4':
				properties['writing-mode'] = 'vertical-rl';
				properties['text-orientation'] = 'upright';
				break;

			case 'none':
				properties['writing-mode'] = 'initial';
				properties['text-orientation'] = 'initial';
				break;
		}
	}

	if (
		isActiveField(publisherTextColumns) &&
		_attributes.publisherTextColumns !==
			attributes.publisherTextColumns.default
	) {
		switch (_attributes.publisherTextColumns) {
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

		switch (_attributes.publisherTextColumns) {
			case '2-columns':
			case '3-columns':
			case '4-columns':
			case '5-columns':
			case 'none':
				if (
					_attributes.publisherTextColumnsGap !==
					attributes.publisherTextColumnsGap.default
				) {
					properties['column-gap'] =
						_attributes.publisherTextColumnsGap;
				}

				if (
					_attributes.publisherTextColumnsDividerColor !==
					attributes.publisherTextColumnsDividerColor.default
				) {
					properties['column-rule-color'] =
						_attributes.publisherTextColumnsDividerColor;
				}

				if (
					_attributes.publisherTextColumnsDividerStyle !==
					attributes.publisherTextColumnsDividerStyle.default
				) {
					properties['column-rule-style'] =
						_attributes.publisherTextColumnsDividerStyle;
				}

				if (
					_attributes.publisherTextColumnsDividerWidth !==
					attributes.publisherTextColumnsDividerWidth.default
				) {
					properties['column-rule-width'] =
						_attributes.publisherTextColumnsDividerWidth + 'px';
				}

				break;
		}
	}

	if (
		isActiveField(publisherTextStrokeColor) &&
		_attributes.publisherTextStrokeColor !==
			attributes.publisherTextStrokeColor.default
	) {
		properties['-webkit-text-stroke'] =
			_attributes.publisherTextStrokeWidth +
			' ' +
			_attributes.publisherTextStrokeColor;
	}

	if (
		isActiveField(publisherWordBreak) &&
		_attributes.publisherWordBreak !==
			attributes.publisherWordBreak.default &&
		_attributes.publisherWordBreak !== 'normal'
	) {
		properties['word-break'] = _attributes.publisherWordBreak;
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
				{ attributes: _attributes, ...blockProps }
			)
		);
	}

	if (
		isActiveField(publisherTextShadow) &&
		!arrayEquals(
			attributes.publisherTextShadow.default,
			_attributes.publisherTextShadow
		)
	) {
		generators.push(TextShadowFieldStyle(publisherTextShadow));
	}

	generators.push(
		computedCssRules(
			{
				cssGenerators: {
					...(cssGenerators || {}),
				},
			},
			{ attributes: _attributes, ...blockProps }
		)
	);

	return generators.length > 1 ? generators.join('\n') : generators.join('');
}
