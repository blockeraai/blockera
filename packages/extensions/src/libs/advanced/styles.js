// @flow
/**
 * Publisher dependencies
 */
import { computedCssRules } from '@publisher/style-engine';
import type { GeneratorReturnType } from '@publisher/style-engine/src/types';

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
	selector: string;
	media: string;
}

export function AdvancedStyles({
	advancedConfig: { cssGenerators, publisherCSSProperties },
	blockProps,
	selector,
	media,
}: IConfigs): Array<GeneratorReturnType> {
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
					publisherPosition: [
						{
							type: 'static',
							media,
							selector,
							properties,
						},
					],
				},
				blockProps
			)
		);
	}

	generators.push(
		computedCssRules(
			{
				...(cssGenerators || {}),
			},
			blockProps
		)
	);

	return generators.flat();
}
