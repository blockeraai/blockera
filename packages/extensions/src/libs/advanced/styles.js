// @flow
/**
 * Publisher dependencies
 */
import { computedCssRules } from '@publisher/style-engine';

/**
 * Internal dependencies
 */
import type { TBlockProps } from '../types';
import { arrayEquals } from '../utils';
import { attributes } from './attributes';
import { isActiveField } from '../../api/utils';
interface IConfigs {
	advancedConfig: {
		cssGenerators: Object,
		publisherCSSProperties: boolean,
	};
	blockProps: TBlockProps;
}

export function AdvancedStyles({
	advancedConfig: { cssGenerators, publisherCSSProperties },
	blockProps,
}: IConfigs): string {
	const { attributes: _attributes } = blockProps;

	const generators = [];

	const properties: Object = {};

	if (
		isActiveField(publisherCSSProperties) &&
		!arrayEquals(
			_attributes.publisherCSSProperties,
			attributes.publisherCSSProperties.default
		)
	) {
		_attributes.publisherCSSProperties?.map((item) => {
			if (!item.name || !item.value) {
				return '';
			}

			properties[item.name] = item.value;
			return null;
		});
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
				blockProps
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
			blockProps
		)
	);

	return generators.length > 1 ? generators.join('\n') : generators.join('');
}
