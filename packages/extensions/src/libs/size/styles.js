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
		publisherMinWidth,
		publisherMinHeight,
		publisherMaxWidth,
		publisherMaxHeight,
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

	if (isActiveField(publisherMinWidth)) {
		const minWidth = getValueAddonRealValue(
			currBlockAttributes.publisherMinWidth
		);

		if (minWidth !== attributes.publisherMinWidth.default)
			properties['min-width'] = minWidth;
		else if (
			!isUndefined(currBlockAttributes.minWidth) &&
			!isEmpty(currBlockAttributes.minWidth)
		) {
			properties['min-width'] = currBlockAttributes.minWidth;
		}
	}

	if (isActiveField(publisherMaxWidth)) {
		const maxWidth = getValueAddonRealValue(
			currBlockAttributes.publisherMaxWidth
		);

		if (maxWidth !== attributes.publisherMaxWidth.default)
			properties['max-width'] = maxWidth;
		else if (
			!isUndefined(currBlockAttributes.maxWidth) &&
			!isEmpty(currBlockAttributes.maxWidth)
		) {
			properties['max-width'] = currBlockAttributes.maxWidth;
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

	if (isActiveField(publisherMinHeight)) {
		const minHeight = getValueAddonRealValue(
			currBlockAttributes.publisherMinHeight
		);

		if (
			currBlockAttributes.publisherMinHeight !==
			attributes.publisherMinHeight.default
		)
			properties['min-height'] = minHeight;
		else if (
			!isUndefined(currBlockAttributes.minHeight) &&
			!isEmpty(currBlockAttributes.minHeight)
		) {
			properties['min-height'] = currBlockAttributes.minHeight;
		}
	}

	if (isActiveField(publisherMaxHeight)) {
		const maxHeight = getValueAddonRealValue(
			currBlockAttributes.publisherMaxHeight
		);

		if (
			currBlockAttributes.publisherMaxHeight !==
			attributes.publisherMaxHeight.default
		)
			properties['max-height'] = maxHeight;
		else if (
			!isUndefined(currBlockAttributes.maxHeight) &&
			!isEmpty(currBlockAttributes.maxHeight)
		) {
			properties['max-height'] = currBlockAttributes.maxHeight;
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
