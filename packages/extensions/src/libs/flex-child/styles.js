// @flow
/**
 * Publisher dependencies
 */
import { computedCssRules } from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';

/**
 * Internal dependencies
 */
import { attributes } from './attributes';
import { isActiveField } from '../../api/utils';
import type { TBlockProps } from '../types';
import type { TCssProps } from './types/flex-child-props';

interface IConfigs {
	flexChildConfig: {
		cssGenerators: Object,
		publisherFlexChildSizing?: string,
		publisherFlexChildAlign?: string,
		publisherFlexChildOrder?: string,
	};
	blockProps: TBlockProps;
}

export function FlexChildStyles({
	flexChildConfig: {
		cssGenerators,
		publisherFlexChildSizing,
		publisherFlexChildAlign,
		publisherFlexChildOrder,
	},
	blockProps,
}: IConfigs): string {
	const { attributes: _attributes } = blockProps;

	const generators = [];

	const properties: TCssProps = {};

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
				const grow = getValueAddonRealValue(
					_attributes.publisherFlexChildGrow
				);

				const shrink = getValueAddonRealValue(
					_attributes.publisherFlexChildShrink
				);

				const basis = getValueAddonRealValue(
					_attributes.publisherFlexChildBasis
				);

				properties.flex = `${grow ? grow : 0} ${shrink ? shrink : 0} ${
					basis ? basis : 'auto'
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
		switch (_attributes.publisherFlexChildOrder) {
			case 'first':
				properties.order = '-1';
				break;

			case 'last':
				properties.order = '100';
				break;

			case 'custom':
				const order = getValueAddonRealValue(
					_attributes.publisherFlexChildOrderCustom
				);

				if (order) properties.order = order;

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
