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

export function SpacingStyles({
	spacingConfig: { cssGenerators, publisherSpacing },
}) {
	const { attributes: _attributes, ...blockProps } =
		useContext(BlockEditContext);

	const generators = [];

	const properties = {};

	if (
		isActiveField(publisherSpacing) &&
		_attributes.publisherSpacing !== attributes.publisherSpacing.default
	) {
		if (_attributes.publisherSpacing.margin.top !== '') {
			properties['margin-top'] = _attributes.publisherSpacing.margin.top;
		}

		if (_attributes.publisherSpacing.margin.right !== '') {
			properties['margin-right'] =
				_attributes.publisherSpacing.margin.right;
		}

		if (_attributes.publisherSpacing.margin.bottom !== '') {
			properties['margin-bottom'] =
				_attributes.publisherSpacing.margin.bottom;
		}

		if (_attributes.publisherSpacing.margin.left !== '') {
			properties['margin-left'] =
				_attributes.publisherSpacing.margin.left;
		}

		if (_attributes.publisherSpacing.padding.top !== '') {
			properties['padding-top'] =
				_attributes.publisherSpacing.padding.top;
		}

		if (_attributes.publisherSpacing.padding.right !== '') {
			properties['padding-right'] =
				_attributes.publisherSpacing.padding.right;
		}

		if (_attributes.publisherSpacing.padding.bottom !== '') {
			properties['padding-bottom'] =
				_attributes.publisherSpacing.padding.bottom;
		}

		if (_attributes.publisherSpacing.padding.left !== '') {
			properties['padding-left'] =
				_attributes.publisherSpacing.padding.left;
		}
	}

	if (Object.keys(properties).length > 0) {
		generators.push(
			computedCssRules(
				{
					cssGenerators: {
						publisherSpacing: [
							{
								type: 'static',
								selector: '.{{BLOCK_ID}}',
								properties,
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
