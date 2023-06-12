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

export function SizeStyles({
	sizeConfig: {
		cssGenerators,
		publisherWidth,
		publisherHeight,
		publisherOverflow,
	},
}) {
	const { attributes: _attributes, ...blockProps } =
		useContext(BlockEditContext);

	const generators = [];

	const properties = {};

	if (
		isActiveField(publisherWidth) &&
		_attributes.publisherWidth !== attributes.publisherWidth.default
	) {
		properties.width = _attributes.publisherWidth;
	}

	if (
		isActiveField(publisherHeight) &&
		_attributes.publisherHeight !== attributes.publisherHeight.default
	) {
		properties.height = _attributes.publisherHeight;
	}

	if (
		isActiveField(publisherOverflow) &&
		_attributes.publisherOverflow !== attributes.publisherOverflow.default
	) {
		properties.overflow = _attributes.publisherOverflow;
	}

	if (Object.keys(properties).length > 0) {
		generators.push(
			computedCssRules(
				{
					cssGenerators: {
						publisherWidth: [
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
