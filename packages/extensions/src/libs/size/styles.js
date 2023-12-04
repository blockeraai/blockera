// @flow
/**
 * Publisher dependencies
 */
import { isUndefined } from '@publisher/utils';
import { computedCssRules } from '@publisher/style-engine';

/**
 * Internal dependencies
 */
import { attributes } from './attributes';
import type { TBlockProps } from '../types';
import { useCssSelector } from '../../hooks';
import { isActiveField } from '../../api/utils';
import type { TSizeCssProps } from './types/size-props';

interface IConfigs {
	sizeConfig: {
		cssGenerators: Object,
		publisherWidth: string,
		publisherHeight: string,
		publisherOverflow: string,
		publisherRatio: string,
		publisherCustomRatio: Object,
	};
	blockProps: TBlockProps;
}

export function SizeStyles({
	sizeConfig: {
		cssGenerators,
		publisherWidth,
		publisherHeight,
		publisherOverflow,
		publisherRatio,
	},
	blockProps,
}: IConfigs): string {
	const { attributes: _attributes, blockName } = blockProps;
	const selector = useCssSelector({
		blockName,
		supportId: 'publisherSize',
	});
	const generators = [];
	const properties: TSizeCssProps = {};

	if (
		isActiveField(publisherWidth) &&
		_attributes.publisherWidth !== attributes.publisherWidth.default
	) {
		properties.width = _attributes.publisherWidth;
	} else if (
		isUndefined(properties.width) &&
		!isUndefined(_attributes.width)
	) {
		properties.width = _attributes.width;
	}

	if (
		isActiveField(publisherHeight) &&
		_attributes.publisherHeight !== attributes.publisherHeight.default
	) {
		properties.height = _attributes.publisherHeight;
	} else if (
		isUndefined(properties.height) &&
		!isUndefined(_attributes.height)
	) {
		properties.height = _attributes.height;
	}

	if (
		isActiveField(publisherOverflow) &&
		_attributes.publisherOverflow !== attributes.publisherOverflow.default
	) {
		properties.overflow = _attributes.publisherOverflow;
	}
	if (
		isActiveField(publisherRatio) &&
		_attributes.publisherRatio !== attributes.publisherRatio.default
	) {
		switch (_attributes.publisherRatio) {
			case 'none':
				{
					properties['aspect-ratio'] = 'auto';
				}
				break;
			case 'custom':
				{
					properties['aspect-ratio'] = `${
						_attributes.publisherCustomRatio.width
					} ${
						_attributes.publisherCustomRatio.width &&
						_attributes.publisherCustomRatio.height &&
						' / '
					} ${_attributes.publisherCustomRatio.height}`;
				}
				break;
			default:
				properties['aspect-ratio'] = _attributes.publisherRatio;
		}
	}

	if (Object.keys(properties).length > 0) {
		generators.push(
			computedCssRules(
				{
					cssGenerators: {
						publisherWidth: [
							{
								type: 'static',
								selector,
								properties,
								options: {
									important: true,
								},
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
