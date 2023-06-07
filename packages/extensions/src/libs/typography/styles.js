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
		publisherFontColor,
		publisherTextShadow,
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
		properties.color = '{{publisherFontColor}}';
	}

	if (
		isActiveField(publisherFontSize) &&
		_attributes.publisherFontSize !== attributes.publisherFontSize.default
	) {
		properties['font-size'] = '{{publisherFontSize}}';
	}

	if (
		isActiveField(publisherLineHeight) &&
		_attributes.publisherLineHeight !==
			attributes.publisherLineHeight.default
	) {
		properties['line-height'] = '{{publisherLineHeight}}';
	}

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
