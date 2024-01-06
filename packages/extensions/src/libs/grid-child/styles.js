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
import type { TCssProps } from './types/grid-child-props';

interface IConfigs {
	gridChildConfig: {
		cssGenerators: Object,
		publisherGridChildPosition?: Object,
		publisherGridChildAlign?: string,
		publisherGridChildJustify?: string,
		publisherGridChildOrder?: string,
	};
	blockProps: TBlockProps;
}

export function GridChildStyles({
	gridChildConfig: {
		cssGenerators,
		publisherGridChildPosition,
		publisherGridChildAlign,
		publisherGridChildJustify,
		publisherGridChildOrder,
	},
	blockProps,
}: IConfigs): string {
	const { attributes: _attributes } = blockProps;
	const generators = [];
	const properties: TCssProps = {};

	if (
		isActiveField(publisherGridChildPosition) &&
		_attributes.publisherGridChildPosition !==
			attributes.publisherGridChildPosition.default
	) {
		switch (_attributes.publisherGridChildPosition['position-type']) {
			case 'auto':
				{
					properties['grid-column'] = `span ${
						_attributes.publisherGridChildPosition['column-span'] ||
						1
					}`;
					properties['grid-row'] = `span ${
						_attributes.publisherGridChildPosition['row-span'] || 1
					}`;
				}
				break;
			case 'area':
				{
					properties['grid-area'] =
						_attributes.publisherGridChildPosition.area;
				}

				break;
			case 'manual': {
				properties['grid-column'] = `${
					_attributes.publisherGridChildPosition['column-start']
				} ${
					_attributes.publisherGridChildPosition['column-start'] &&
					_attributes.publisherGridChildPosition['column-end'] &&
					'/'
				} ${_attributes.publisherGridChildPosition['column-end']}`;
				properties['grid-row'] = `${
					_attributes.publisherGridChildPosition['row-start']
				} ${
					_attributes.publisherGridChildPosition['row-start'] &&
					_attributes.publisherGridChildPosition['row-end'] &&
					'/'
				} ${_attributes.publisherGridChildPosition['row-end']}`;
			}
		}
	}

	if (
		isActiveField(publisherGridChildAlign) &&
		_attributes.publisherGridChildAlign !==
			attributes.publisherGridChildAlign.default
	) {
		properties['align-self'] = _attributes.publisherGridChildAlign;
	}

	if (
		isActiveField(publisherGridChildJustify) &&
		_attributes.publisherGridChildJustify !==
			attributes.publisherGridChildJustify.default
	) {
		properties['justify-self'] = _attributes.publisherGridChildJustify;
	}

	if (
		isActiveField(publisherGridChildOrder) &&
		_attributes.publisherGridChildOrder !==
			attributes.publisherGridChildOrder.default
	) {
		switch (_attributes.publisherGridChildOrder) {
			case 'first':
				properties.order = '-1';
				break;
			case 'last':
				properties.order = '100';
				break;
			case 'custom':
				const order = getValueAddonRealValue(
					_attributes.publisherGridChildOrderCustom
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
						publisherGridChild: [
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
