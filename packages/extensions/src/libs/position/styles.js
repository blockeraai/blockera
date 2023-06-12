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

export function PositionStyles({
	positionConfig: { cssGenerators, publisherPosition, publisherZIndex },
}) {
	const { attributes: _attributes, ...blockProps } =
		useContext(BlockEditContext);

	const generators = [];

	const properties = {};

	if (
		isActiveField(publisherPosition) &&
		_attributes.publisherPosition !==
			attributes.publisherPosition.default &&
		_attributes.publisherPosition.type !== 'static'
	) {
		properties.position = _attributes.publisherPosition.type;

		if (_attributes.publisherPosition.position.top !== '') {
			properties.top = _attributes.publisherPosition.position.top;
		}

		if (_attributes.publisherPosition.position.right !== '') {
			properties.right = _attributes.publisherPosition.position.right;
		}

		if (_attributes.publisherPosition.position.bottom !== '') {
			properties.bottom = _attributes.publisherPosition.position.bottom;
		}

		if (_attributes.publisherPosition.position.left !== '') {
			properties.left = _attributes.publisherPosition.position.left;
		}

		if (
			isActiveField(publisherZIndex) &&
			_attributes.publisherZIndex !== attributes.publisherZIndex.default
		) {
			properties['z-index'] = _attributes.publisherZIndex;
		}
	}

	if (Object.keys(properties).length > 0) {
		generators.push(
			computedCssRules(
				{
					cssGenerators: {
						publisherPosition: [
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
