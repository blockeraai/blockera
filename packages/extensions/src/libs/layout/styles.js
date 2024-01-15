// @flow
/**
 * Publisher dependencies
 */
import { computedCssRules } from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';
import type { GeneratorReturnType } from '@publisher/style-engine/src/types';
import { arrayEquals } from '../utils';

/**
 * Internal dependencies
 */
import { attributes } from './attributes';
import { isActiveField } from '../../api/utils';
import type { TBlockProps } from '../types';
import type { TCssProps } from './types/layout-props';
import {
	GridColumnGenerator,
	GridRowGenerator,
	GridAreaGenerator,
} from './css-generators';

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
		publisherGridAlignItems: string,
		publisherGridJustifyItems: string,
		publisherGridAlignContent: string,
		publisherGridJustifyContent: string,
		publisherGridGap: Object,
		publisherGridDirection: Object,
		publisherGridColumns: Array<Object>,
		publisherGridRows: Array<Object>,
		publisherGridAreas: Array<Object>,
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
		publisherGridAlignItems,
		publisherGridJustifyItems,
		publisherGridAlignContent,
		publisherGridJustifyContent,
		publisherGridGap,
		publisherGridDirection,
		publisherGridColumns,
		publisherGridRows,
		publisherGridAreas,
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

	if (_attributes.publisherDisplay === 'grid') {
		if (
			isActiveField(publisherGridAlignItems) &&
			_attributes.publisherGridAlignItems !==
				attributes.publisherGridAlignItems.default
		) {
			properties['align-items'] = _attributes.publisherGridAlignItems;
		}

		if (
			isActiveField(publisherGridJustifyItems) &&
			_attributes.publisherGridJustifyItems !==
				attributes.publisherGridJustifyItems.default
		) {
			properties['justify-items'] = _attributes.publisherGridJustifyItems;
		}

		if (
			isActiveField(publisherGridAlignContent) &&
			_attributes.publisherGridAlignContent !==
				attributes.publisherGridAlignContent.default
		) {
			properties['align-content'] = _attributes.publisherGridAlignContent;
		}

		if (
			isActiveField(publisherGridJustifyContent) &&
			_attributes.publisherGridJustifyContent !==
				attributes.publisherGridJustifyContent.default
		) {
			properties['justify-content'] =
				_attributes.publisherGridJustifyContent;
		}

		if (
			isActiveField(publisherGridGap) &&
			_attributes.publisherGridGap !== attributes.publisherGridGap.default
		) {
			if (_attributes.publisherGridGap?.lock) {
				const gap = getValueAddonRealValue(
					_attributes.publisherGridGap?.gap
				);
				if (gap) properties.gap = gap;
			} else {
				const rows = getValueAddonRealValue(
					_attributes.publisherGridGap?.rows
				);
				if (rows) {
					properties['row-gap'] = rows;
				}

				const columns = getValueAddonRealValue(
					_attributes.publisherGridGap?.columns
				);
				if (columns) {
					properties['column-gap'] = columns;
				}
			}
		}

		if (
			isActiveField(publisherGridDirection) &&
			!arrayEquals(
				_attributes.publisherGridDirection,
				attributes.publisherGridDirection.default
			)
		) {
			properties['grid-auto-flow'] = `${
				_attributes.publisherGridDirection.value || 'row'
			} ${_attributes.publisherGridDirection.dense ? 'dense' : ''}`;
		}

		if (
			isActiveField(publisherGridColumns)
			// !arrayEquals(
			// 	attributes.publisherGridColumns.default,
			// 	blockProps.attributes.publisherGridColumns
			// )
		) {
			generators.push(
				computedCssRules(
					{
						publisherGridColumns: [
							{
								media,
								selector,
								type: 'function',
								function: GridColumnGenerator,
							},
						],
					},
					blockProps
				)
			);
		}

		if (
			isActiveField(publisherGridRows)
			// !arrayEquals(
			// 	attributes.publisherGridRows.default,
			// 	blockProps.attributes.publisherGridRows
			// )
		) {
			generators.push(
				computedCssRules(
					{
						publisherGridRows: [
							{
								media,
								selector,
								type: 'function',
								function: GridRowGenerator,
							},
						],
					},
					blockProps
				)
			);
		}

		if (
			isActiveField(publisherGridAreas) &&
			!arrayEquals(
				attributes.publisherGridAreas.default,
				blockProps.attributes.publisherGridAreas
			)
		) {
			generators.push(
				computedCssRules(
					{
						cssGenerators: {
							publisherGridAreas: [
								{
									type: 'function',
									function: GridAreaGenerator,
								},
							],
						},
					},
					{
						...blockProps,
						cssGeneratorEntity: {
							property: 'grid-template-areas',
							id: 'publisherGridAreas',
						},
					}
				)
			);
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
