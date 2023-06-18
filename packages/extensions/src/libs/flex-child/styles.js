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

export function FlexChildStyles({
	flexChildConfig: {
		cssGenerators,
		publisherFlexChildSizing,
		publisherFlexChildAlign,
		publisherFlexChildOrder,
	},
}) {
	const { attributes: _attributes, ...blockProps } =
		useContext(BlockEditContext);

	const generators = [];

	const properties = {};

	if (
		isActiveField(publisherFlexChildSizing) &&
		_attributes.publisherFlexChildSizing !==
			attributes.publisherFlexChildSizing.default
	) {
		switch (_attributes.publisherFlexChildSizing) {
			case 'shrink':
				properties.flex = '0 1 auto';
				break;

			case 'grow':
				properties.flex = '1 1 0%';
				break;

			case 'no':
				properties.flex = '0 0 auto';
				break;

			case 'custom':
				properties.flex = `${
					_attributes.publisherFlexChildGrow
						? _attributes.publisherFlexChildGrow
						: 0
				}`;
				properties.flex += ` ${
					_attributes.publisherFlexChildShrink
						? _attributes.publisherFlexChildShrink
						: 0
				}`;
				properties.flex += ` ${
					_attributes.publisherFlexChildBasis
						? _attributes.publisherFlexChildBasis
						: 'auto'
				}`;
				break;
		}
	}

	if (
		isActiveField(publisherFlexChildAlign) &&
		_attributes.publisherFlexChildAlign !==
			attributes.publisherFlexChildAlign.default
	) {
		properties['align-self'] = _attributes.publisherFlexChildAlign;
	}

	if (
		isActiveField(publisherFlexChildOrder) &&
		_attributes.publisherFlexChildOrder !==
			attributes.publisherFlexChildOrder.default
	) {
		console.log(_attributes.publisherFlexChildOrder);
		switch (_attributes.publisherFlexChildOrder) {
			case 'first':
				properties.order = '-1';
				break;

			case 'last':
				properties.order = '100';
				break;

			case 'custom':
				if (_attributes.publisherFlexChildOrderCustom)
					properties.order =
						_attributes.publisherFlexChildOrderCustom;
				break;
		}
	}

	if (Object.keys(properties).length > 0) {
		generators.push(
			computedCssRules(
				{
					cssGenerators: {
						publisherFlexChild: [
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
