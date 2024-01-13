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
import type { TCssProps } from './types/layout-props';

interface IConfigs {
	layoutConfig: {
		cssGenerators: Object,
		publisherDisplay: string,
		publisherFlexDirection: string,
		publisherAlignItems: string,
		publisherJustifyContent: string,
		publisherGap: string,
		publisherFlexWrap: string,
		publisherAlignContent: string,
	};
	blockProps: TBlockProps;
	selector: string;
	media: string;
}

export function LayoutStyles({
	layoutConfig: {
		cssGenerators,
		publisherDisplay,
		publisherFlexDirection,
		publisherAlignItems,
		publisherJustifyContent,
		publisherGap,
		publisherFlexWrap,
		publisherAlignContent,
	},
	blockProps,
	selector,
	media,
}: IConfigs): Array<GeneratorReturnType> {
	const { attributes: _attributes } = blockProps;

	const generators = [];

	const properties: TCssProps = {};

	if (
		isActiveField(publisherDisplay) &&
		_attributes.publisherDisplay !== attributes.publisherDisplay.default
	) {
		properties.display = _attributes.publisherDisplay;
	}

	if (_attributes.publisherDisplay === 'flex') {
		if (
			isActiveField(publisherFlexDirection) &&
			_attributes.publisherFlexDirection !==
				attributes.publisherFlexDirection.default
		) {
			properties['flex-direction'] =
				_attributes.publisherFlexDirection.value;

			if (_attributes.publisherFlexDirection.reverse)
				properties['flex-direction'] += '-reverse';
		}

		if (
			isActiveField(publisherAlignItems) &&
			_attributes.publisherAlignItems !==
				attributes.publisherAlignItems.default
		) {
			properties['align-items'] = _attributes.publisherAlignItems;
		}

		if (
			isActiveField(publisherJustifyContent) &&
			_attributes.publisherJustifyContent !==
				attributes.publisherJustifyContent.default
		) {
			properties['justify-content'] = _attributes.publisherJustifyContent;
		}

		if (
			isActiveField(publisherGap) &&
			_attributes.publisherGap !== attributes.publisherGap.default
		) {
			if (_attributes.publisherGap?.lock) {
				const gap = getValueAddonRealValue(
					_attributes.publisherGap?.gap
				);
				if (gap) properties.gap = gap;
			} else {
				const rows = getValueAddonRealValue(
					_attributes.publisherGap?.rows
				);
				if (rows) {
					properties['row-gap'] = rows;
				}

				const columns = getValueAddonRealValue(
					_attributes.publisherGap?.columns
				);
				if (columns) {
					properties['column-gap'] = columns;
				}
			}
		}

		if (
			isActiveField(publisherFlexWrap) &&
			_attributes.publisherFlexWrap !==
				attributes.publisherFlexWrap.default
		) {
			properties['flex-wrap'] = _attributes.publisherFlexWrap.value;

			if (
				_attributes.publisherFlexWrap.value === 'wrap' &&
				_attributes.publisherFlexWrap.reverse
			) {
				properties['flex-wrap'] += '-reverse';
			}
		}

		if (
			isActiveField(publisherAlignContent) &&
			_attributes.publisherAlignContent !==
				attributes.publisherAlignContent.default
		) {
			properties['align-content'] = _attributes.publisherAlignContent;
		}
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
