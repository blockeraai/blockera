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

export function BackgroundStyles({
	backgroundConfig: { cssGenerators, publisherBackgroundColor },
}) {
	const { attributes: _attributes, ...blockProps } =
		useContext(BlockEditContext);

	const generators = [];

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
