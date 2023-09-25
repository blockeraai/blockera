/**
 * Publisher dependencies
 */
import { computedCssRules } from '@publisher/style-engine';

/**
 * Internal dependencies
 */
import { arrayEquals } from '../utils';
import { attributes } from './attributes';
import { isActiveField } from '../../api/utils';
import {
	OutlineGenerator,
	BoxShadowGenerator,
	BoxBorderGenerator,
	BorderRadiusGenerator,
} from './css-generators';
import type { TBlockProps } from '../types';
import { isSupportBorder } from '../../wordpress';

interface IConfigs {
	borderAndShadowConfig: {
		cssGenerators: Object,
		publisherBorder?: Object,
		publisherOutline?: Object,
		publisherBoxShadow?: Object,
		publisherBorderRadius?: Object,
	};
	blockProps: TBlockProps;
}

export function BorderAndShadowStyles({
	borderAndShadowConfig: {
		publisherBorder,
		publisherOutline,
		publisherBoxShadow,
		publisherBorderRadius,
	},
	blockProps,
}: IConfigs) {
	const generators = [];
	const { blockName } = blockProps;

	if (
		isActiveField(publisherBoxShadow) &&
		!arrayEquals(
			attributes.publisherBoxShadow.default,
			blockProps.attributes.publisherBoxShadow
		)
	) {
		generators.push(
			computedCssRules(
				{
					cssGenerators: {
						publisherBoxShadow: [
							{
								type: 'function',
								function: BoxShadowGenerator,
							},
						],
						...(publisherBoxShadow?.cssGenerators || {}),
					},
				},
				blockProps
			)
		);
	}

	if (
		isActiveField(publisherOutline) &&
		!arrayEquals(
			attributes.publisherOutline.default,
			blockProps.attributes.publisherOutline
		)
	) {
		generators.push(
			computedCssRules(
				{
					cssGenerators: {
						publisherOutline: [
							{
								type: 'function',
								function: OutlineGenerator,
							},
						],
						...(publisherOutline?.cssGenerators || {}),
					},
				},
				blockProps
			)
		);
	}

	if (
		isActiveField(publisherBorder) &&
		!arrayEquals(
			attributes.publisherBorder.default,
			blockProps.attributes.publisherBorder
		) &&
		!isSupportBorder(blockName)
	) {
		generators.push(
			computedCssRules(
				{
					cssGenerators: {
						publisherBorder: [
							{
								type: 'function',
								function: BoxBorderGenerator,
							},
						],
						...(publisherBorder?.cssGenerators || {}),
					},
				},
				blockProps
			)
		);
	}

	if (
		isActiveField(publisherBorderRadius) &&
		!arrayEquals(
			attributes.publisherBorderRadius.default,
			blockProps.attributes.publisherBorderRadius
		) &&
		!isSupportBorder(blockName, true)
	) {
		generators.push(
			computedCssRules(
				{
					cssGenerators: {
						publisherBorder: [
							{
								type: 'function',
								function: BorderRadiusGenerator,
							},
						],
						...(publisherBorderRadius?.cssGenerators || {}),
					},
				},
				blockProps
			)
		);
	}

	return generators.length > 1 ? generators.join('\n') : generators.join('');
}
