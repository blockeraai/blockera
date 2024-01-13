// @flow
/**
 * Publisher dependencies
 */
import { computedCssRules } from '@publisher/style-engine';
import type { GeneratorReturnType } from '@publisher/style-engine/src/types';

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
	selector: string;
	media: string;
}

export function BorderAndShadowStyles({
	borderAndShadowConfig: {
		publisherBorder,
		publisherOutline,
		publisherBoxShadow,
		publisherBorderRadius,
	},
	blockProps,
	selector,
	media,
}: IConfigs): Array<GeneratorReturnType> {
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
					publisherBoxShadow: [
						{
							media,
							selector,
							type: 'function',
							function: BoxShadowGenerator,
						},
					],
					...(publisherBoxShadow?.cssGenerators || {}),
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
					publisherOutline: [
						{
							media,
							selector,
							type: 'function',
							function: OutlineGenerator,
						},
					],
					...(publisherOutline?.cssGenerators || {}),
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
					publisherBorder: [
						{
							media,
							selector,
							type: 'function',
							function: BoxBorderGenerator,
						},
					],
					...(publisherBorder?.cssGenerators || {}),
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
					publisherBorder: [
						{
							media,
							selector,
							type: 'function',
							function: BorderRadiusGenerator,
						},
					],
					...(publisherBorderRadius?.cssGenerators || {}),
				},
				blockProps
			)
		);
	}

	return generators.flat();
}
