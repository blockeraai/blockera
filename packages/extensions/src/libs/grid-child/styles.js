// @flow
/**
 * Publisher dependencies
 */
import { computedCssRules } from '@publisher/style-engine';

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
		publisherGridChildLayout?: Object,
		publisherGridChildOrder?: Object,
	};
	blockProps: TBlockProps;
	selector: string;
	media: string;
}

export function GridChildStyles({
	gridChildConfig: {
		cssGenerators,
		publisherGridChildLayout,
		publisherGridChildOrder,
	},
	blockProps,
	selector,
	media,
}: IConfigs): string {
	const { attributes: _attributes } = blockProps;

	const generators = [];

	const properties: TCssProps = {};

	if (
		isActiveField(publisherGridChildLayout) &&
		_attributes.publisherGridChildLayout !==
			attributes.publisherGridChildLayout.default
	) {
		properties['align-self'] =
			_attributes.publisherGridChildLayout.alignItems;
		properties['justify-self'] =
			_attributes.publisherGridChildLayout.justifyContent;
	}

	if (
		isActiveField(publisherGridChildOrder) &&
		_attributes.publisherGridChildOrder !==
			attributes.publisherGridChildOrder.default
	) {
		switch (_attributes.publisherGridChildOrder.value) {
			case 'first':
				properties.order = '-1';
				break;
			case 'last':
				properties.order = '100';
				break;
			case 'manual':
				properties['grid-area'] =
					_attributes.publisherGridChildOrder.area;
				break;
		}
	}
	if (Object.keys(properties).length > 0) {
		generators.push(
			computedCssRules(
				{
					publisherGridChild: [
						{
							type: 'static',
							selector,
							media,
							properties,
						},
					],
				},
				{ attributes: _attributes, ...blockProps }
			)
		);
	}
	generators.push(
		computedCssRules(
			{
				...(cssGenerators || {}),
			},
			{ attributes: _attributes, ...blockProps }
		)
	);
	return generators.flat();
}
