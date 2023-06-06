/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { computedCssRules } from '@publisher/style-engine';
import { BackgroundFieldStyle } from '@publisher/fields';

/**
 * Internal dependencies
 */
import { arrayEquals } from '../utils';
import { attributes } from './attributes';
import { BlockEditContext } from '../../hooks';
import { isActiveField } from '../../api/utils';
import { backgroundClipCSSGenerator } from './css-generator';

export function BackgroundStyles({
	backgroundConfig: {
		cssGenerators,
		publisherBackground,
		publisherBackgroundColor,
		publisherBackgroundClip,
	},
}) {
	const { attributes: _attributes, ...blockProps } =
		useContext(BlockEditContext);

	const generators = [];

	if (
		isActiveField(publisherBackground) &&
		!arrayEquals(
			attributes.publisherBackground.default,
			_attributes.publisherBackground
		)
	) {
		generators.push(BackgroundFieldStyle(publisherBackground));
	}

	if (
		isActiveField(publisherBackgroundColor) &&
		_attributes.publisherBackgroundColor !==
			attributes.publisherBackgroundColor.default
	) {
		generators.push(
			computedCssRules(
				{
					cssGenerators: {
						publisherBackgroundColor: [
							{
								type: 'static',
								selector: '.{{BLOCK_ID}}',
								properties: {
									'background-color':
										'{{publisherBackgroundColor}}',
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
		isActiveField(publisherBackgroundClip) &&
		_attributes.publisherBackgroundClip !==
			attributes.publisherBackgroundClip.default
	) {
		generators.push(
			computedCssRules(
				{
					cssGenerators: {
						publisherBackgroundClip: [
							{
								type: 'function',
								function: backgroundClipCSSGenerator,
							},
						],
						...(publisherBackgroundClip?.cssGenerators || {}),
					},
				},
				{ attributes: _attributes, ...blockProps }
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
			{ attributes: _attributes, ...blockProps }
		)
	);

	return generators.length > 1 ? generators.join('\n') : generators.join('');
}
