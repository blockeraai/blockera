/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { computedCssRules } from '@publisher/style-engine';

/**
 * Internal dependencies
 */
import { arrayEquals } from '../utils';
import { attributes } from './attributes';
import { BlockEditContext } from '../../hooks';
import { isActiveField } from '../../api/utils';
import {
	OutlineGenerator,
	BoxShadowGenerator,
	BoxBorderGenerator,
	BorderRadiusGenerator,
} from './css-generators';

export function BorderAndShadowStyles({
	borderAndShadowConfig: {
		publisherBoxShadow,
		publisherOutline,
		publisherBorder,
		publisherBorderRadius,
	},
}) {
	const blockProps = useContext(BlockEditContext);
	const generators = [];

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
		)
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
		)
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
