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

type cssProps = {
	position?: string,
	top?: string,
	right?: string,
	bottom?: string,
	left?: string,
	'z-index'?: string,
};

interface IConfigs {
	positionConfig: {
		cssGenerators: Object,
		publisherPosition: cssProps,
		publisherZIndex: string,
	};
	blockProps: TBlockProps;
}

export function PositionStyles({
	positionConfig: { cssGenerators, publisherPosition, publisherZIndex },
	blockProps,
}: IConfigs): string {
	const { attributes: _attributes } = blockProps;

	const generators = [];

	const properties: cssProps = {};

	if (
		isActiveField(publisherPosition) &&
		_attributes.publisherPosition !==
			attributes.publisherPosition.default &&
		_attributes.publisherPosition.type !== 'static'
	) {
		properties.position = _attributes.publisherPosition.type;

		if (_attributes.publisherPosition.position?.top !== '') {
			properties.top = _attributes.publisherPosition.position?.top;
		}

		if (_attributes.publisherPosition.position?.right !== '') {
			properties.right = _attributes.publisherPosition.position?.right;
		}

		if (_attributes.publisherPosition.position?.bottom !== '') {
			properties.bottom = _attributes.publisherPosition.position?.bottom;
		}

		if (_attributes.publisherPosition.position?.left !== '') {
			properties.left = _attributes.publisherPosition.position?.left;
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
