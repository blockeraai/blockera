// @flow
/**
 * Publisher dependencies
 */
import { isUndefined, isEmpty } from '@publisher/utils';
import { computedCssRules } from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';

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
	};
	blockProps: TBlockProps;
}

export function SizeStyles({
	sizeConfig: {
		cssGenerators,
		publisherWidth,
		publisherHeight,
		publisherOverflow,
	},
	blockProps,
}: IConfigs): string {
	const { attributes: currBlockAttributes, blockName } = blockProps;
	const selector = useCssSelector({
		blockName,
		supportId: 'publisherSize',
	});
	const generators = [];
	const properties: TSizeCssProps = {};

	if (isActiveField(publisherWidth)) {
		const width = getValueAddonRealValue(
			currBlockAttributes.publisherWidth
		);

		if (width !== attributes.publisherWidth.default)
			properties.width = width;
		else if (
			!isUndefined(currBlockAttributes.width) &&
			!isEmpty(currBlockAttributes.width)
		) {
			properties.width = currBlockAttributes.width;
		}
	}

	if (isActiveField(publisherHeight)) {
		const height = getValueAddonRealValue(
			currBlockAttributes.publisherHeight
		);

		if (
			currBlockAttributes.publisherHeight !==
			attributes.publisherHeight.default
		)
			properties.height = height;
		else if (
			!isUndefined(currBlockAttributes.height) &&
			!isEmpty(currBlockAttributes.height)
		) {
			properties.height = currBlockAttributes.height;
		}
	}

	if (isActiveField(publisherOverflow)) {
		const overflow = getValueAddonRealValue(
			currBlockAttributes.publisherOverflow
		);

		if (
			currBlockAttributes.publisherOverflow !==
			attributes.publisherOverflow.default
		)
			properties.overflow = overflow;
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
