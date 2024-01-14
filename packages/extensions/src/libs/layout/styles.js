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
		console.log('publisherFlexLayout', _attributes?.publisherFlexLayout);
		if (_attributes?.publisherFlexLayout !== undefined) {
			if (_attributes?.publisherFlexLayout.direction) {
				properties['flex-direction'] =
					_attributes.publisherFlexLayout.direction;
			}

			if (_attributes?.publisherFlexLayout.alignItems) {
				properties['align-items'] =
					_attributes.publisherFlexLayout.alignItems;
			}

			if (_attributes?.publisherFlexLayout.justifyContent) {
				properties['justify-content'] =
					_attributes.publisherFlexLayout.justifyContent;
			}
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
