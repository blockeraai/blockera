// @flow
/**
 * Publisher dependencies
 */
import { computedCssRules } from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';
import type { GeneratorReturnType } from '@publisher/style-engine/src/types';

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
	selector: string;
	media: string;
}

export function PositionStyles({
	positionConfig: { cssGenerators, publisherPosition, publisherZIndex },
	blockProps,
	selector,
	media,
}: IConfigs): Array<GeneratorReturnType> {
	const { attributes: _attributes } = blockProps;

	const generators = [];

	const properties: cssProps = {};

	if (
		isActiveField(publisherPosition) &&
		_attributes?.publisherPosition &&
		_attributes.publisherPosition !==
			attributes.publisherPosition.default &&
		_attributes.publisherPosition.type !== 'static'
	) {
		properties.position = _attributes.publisherPosition.type;

		const positionTop = getValueAddonRealValue(
			_attributes.publisherPosition.position?.top
		);
		if (positionTop !== '') {
			properties.top = positionTop;
		}

		const positionRight = getValueAddonRealValue(
			_attributes.publisherPosition.position?.right
		);
		if (positionRight !== '') {
			properties.right = positionRight;
		}

		const positionBottom = getValueAddonRealValue(
			_attributes.publisherPosition.position?.bottom
		);
		if (positionBottom !== '') {
			properties.bottom = positionBottom;
		}

		const positionLeft = getValueAddonRealValue(
			_attributes.publisherPosition.position?.left
		);
		if (positionLeft !== '') {
			properties.left = positionLeft;
		}

		if (isActiveField(publisherZIndex)) {
			const zIndex = getValueAddonRealValue(_attributes.publisherZIndex);

			if (zIndex !== attributes.publisherZIndex.default)
				properties['z-index'] = zIndex;
		}
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
