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
		publisherFontColor,
		publisherTextShadow,
	},
}) {
	const { attributes: _attributes, ...blockProps } =
		useContext(BlockEditContext);

	const generators = [];

	if (
		isActiveField(publisherFontColor) &&
		_attributes.publisherFontColor !== attributes.publisherFontColor.default
	) {
		generators.push(
			computedCssRules(
				{
					cssGenerators: {
						publisherFontColor: [
							{
								type: 'static',
								selector: '.{{BLOCK_ID}}',
								properties: {
									color: '{{publisherFontColor}}',
								},
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
