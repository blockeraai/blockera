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
import { arrayEquals } from '../utils';
import { attributes } from './attributes';
import type { TBlockProps } from '../types';
import { isActiveField } from '../../api/utils';
import type { TSizeCssProps } from './types/size-props';

interface IConfigs {
	sizeConfig: {
		cssGenerators: Object,
		publisherWidth: string,
		publisherHeight: string,
		publisherOverflow: string,
		publisherRatio: Object,
		publisherFit: string,
		publisherFitPosition: Object,
		publisherMinWidth: string,
		publisherMinHeight: string,
		publisherMaxWidth: string,
		publisherMaxHeight: string,
	};
	blockProps: TBlockProps;
	selector: string;
	media: string;
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
		publisherRatio,
		publisherFit,
	},
	blockProps,
	selector,
	media,
}: IConfigs): string {
	const { attributes: currBlockAttributes } = blockProps;
	const generators = [];
	const properties: TSizeCssProps = {};

	if (isActiveField(publisherWidth) && currBlockAttributes?.publisherWidth) {
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

	if (
		isActiveField(publisherMinWidth) &&
		currBlockAttributes?.publisherMinWidth
	) {
		const minWidth = getValueAddonRealValue(
			currBlockAttributes.publisherMinWidth
		);

		if (minWidth !== attributes.publisherMinWidth.default)
			properties['min-width'] = minWidth;
	}

	if (
		isActiveField(publisherMaxWidth) &&
		currBlockAttributes?.publisherMaxWidth
	) {
		const maxWidth = getValueAddonRealValue(
			currBlockAttributes.publisherMaxWidth
		);

		if (maxWidth !== attributes.publisherMaxWidth.default)
			properties['max-width'] = maxWidth;
	}

	if (
		isActiveField(publisherHeight) &&
		currBlockAttributes?.publisherHeight
	) {
		const height = getValueAddonRealValue(
			currBlockAttributes.publisherHeight
		);

		if (height !== attributes.publisherHeight.default)
			properties.height = height;
		else if (
			!isUndefined(currBlockAttributes.height) &&
			!isEmpty(currBlockAttributes.height)
		) {
			properties.height = currBlockAttributes.height;
		}
	}

	if (
		isActiveField(publisherMinHeight) &&
		currBlockAttributes?.publisherMinHeight
	) {
		const minHeight = getValueAddonRealValue(
			currBlockAttributes.publisherMinHeight
		);

		if (minHeight !== attributes.publisherMinHeight.default)
			properties['min-height'] = minHeight;
	}

	if (
		isActiveField(publisherMaxHeight) &&
		currBlockAttributes?.publisherMaxHeight
	) {
		const maxHeight = getValueAddonRealValue(
			currBlockAttributes.publisherMaxHeight
		);

		if (maxHeight !== attributes.publisherMaxHeight.default)
			properties['max-height'] = maxHeight;
	}

	if (
		isActiveField(publisherOverflow) &&
		currBlockAttributes?.publisherOverflow
	) {
		if (
			currBlockAttributes.publisherOverflow !==
			attributes.publisherOverflow.default
		)
			properties.overflow = currBlockAttributes.publisherOverflow;
	}

	if (isActiveField(publisherRatio) && currBlockAttributes?.publisherRatio) {
		const ratio = currBlockAttributes.publisherRatio.value;

		if (ratio !== attributes.publisherRatio.default.value)
			switch (ratio) {
				case 'custom':
					{
						const width = getValueAddonRealValue(
							currBlockAttributes.publisherRatio.width
						);
						const height = getValueAddonRealValue(
							currBlockAttributes.publisherRatio.height
						);

						properties['aspect-ratio'] = `${width} ${
							width && height && ' / '
						} ${height}`;
					}
					break;
				default:
					properties['aspect-ratio'] = ratio;
			}
	}

	if (
		isActiveField(publisherFit) &&
		currBlockAttributes?.publisherFit &&
		currBlockAttributes.publisherFit !== attributes.publisherFit.default
	) {
		properties['object-fit'] = currBlockAttributes.publisherFit;
	}

	if (
		currBlockAttributes?.publisherFitPosition &&
		!arrayEquals(
			currBlockAttributes.publisherFitPosition,
			attributes.publisherFitPosition.default
		)
	) {
		properties['object-position'] = `${getValueAddonRealValue(
			currBlockAttributes.publisherFitPosition.top
		)} ${getValueAddonRealValue(
			currBlockAttributes.publisherFitPosition.left
		)}`;
	}

	if (Object.keys(properties).length > 0) {
		generators.push(
			computedCssRules(
				{
					publisherWidth: [
						{
							type: 'static',
							media,
							selector,
							properties,
							options: {
								important: true,
							},
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

	return generators.length > 1 ? generators.join('\n') : generators.join('');
}
