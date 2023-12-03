// @flow
/**
 * Publisher dependencies
 */
import { computedCssRules } from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';

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
		publisherGapRows: string,
		publisherGapColumns: string,
		publisherFlexWrap: string,
		publisherAlignContent: string,
	};
	blockProps: TBlockProps;
}

export function LayoutStyles({
	layoutConfig: {
		cssGenerators,
		publisherDisplay,
		publisherFlexDirection,
		publisherAlignItems,
		publisherJustifyContent,
		publisherGapRows,
		publisherGapColumns,
		publisherFlexWrap,
		publisherAlignContent,
	},
	blockProps,
}: IConfigs): string {
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
			properties['flex-direction'] = _attributes.publisherFlexDirection;
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

		// todo add support for locked gap

		if (isActiveField(publisherGapRows)) {
			const gapRow = getValueAddonRealValue(_attributes.publisherGapRows);

			if (gapRow !== attributes.publisherGapRows.default)
				properties['row-gap'] = gapRow;
		}

		if (isActiveField(publisherGapColumns)) {
			const gapColumns = getValueAddonRealValue(
				_attributes.publisherGapColumns
			);

			if (gapColumns !== attributes.publisherGapColumns.default)
				properties['column-gap'] = gapColumns;
		}

		if (
			isActiveField(publisherFlexWrap) &&
			_attributes.publisherFlexWrap !==
				attributes.publisherFlexWrap.default
		) {
			properties['flex-wrap'] = _attributes.publisherFlexWrap;
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
					cssGenerators: {
						publisherWidth: [
							{
								type: 'static',
								selector: '.{{BLOCK_ID}}',
								properties,
							},
						],
					},
				},
				{ attributes: _attributes, ...blockProps }
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
			{ attributes: _attributes, ...blockProps }
		)
	);

	return generators.length > 1 ? generators.join('\n') : generators.join('');
}
