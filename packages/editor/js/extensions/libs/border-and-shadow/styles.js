// @flow

/**
 * Internal dependencies
 */
import * as config from '../base/config';
import { arrayEquals } from '../utils';
import { attributes } from './attributes';
import { isActiveField } from '../../api/utils';
import {
	OutlineGenerator,
	BoxShadowGenerator,
	BoxBorderGenerator,
	BorderRadiusGenerator,
} from './css-generators';
import type { StylesProps } from '../types';
import type { CssRule } from '../../../style-engine/types';
import { computedCssDeclarations, getCssSelector } from '../../../style-engine';

export const BorderAndShadowStyles = ({
	state,
	clientId,
	blockName,
	currentBlock,
	// supports,
	// activeDeviceType,
	selectors: blockSelectors,
	attributes: currentBlockAttributes,
	...props
}: StylesProps): Array<CssRule> => {
	const {
		blockeraBorder,
		blockeraOutline,
		blockeraBoxShadow,
		blockeraBorderRadius,
	} = config.borderAndShadowConfig;

	const blockProps = {
		clientId,
		blockName,
		attributes: currentBlockAttributes,
	};

	const sharedParams = {
		...props,
		state,
		clientId,
		currentBlock,
		blockSelectors,
		className: currentBlockAttributes?.className,
	};

	const styleGroup: Array<CssRule> = [];

	if (
		isActiveField(blockeraBoxShadow) &&
		!arrayEquals(
			attributes.blockeraBoxShadow.default,
			blockProps.attributes.blockeraBoxShadow
		)
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'blockeraBoxShadow',
			support: 'blockeraBoxShadow',
			fallbackSupportId: 'box-shadow',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraBoxShadow: [
						{
							type: 'function',
							function: BoxShadowGenerator,
						},
					],
				},
				blockProps
			),
		});
	}

	if (isActiveField(blockeraOutline)) {
		const blockeraOutline = blockProps.attributes.blockeraOutline;

		if (blockeraOutline !== attributes.blockeraOutline.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraOutline',
				support: 'blockeraOutline',
				fallbackSupportId: 'outline',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraOutline: [
							{
								type: 'function',
								function: OutlineGenerator,
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (isActiveField(blockeraBorder)) {
		const blockeraBorder = blockProps.attributes.blockeraBorder;

		if (blockeraBorder !== attributes.blockeraBorder.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraBorder',
				support: 'blockeraBorder',
				fallbackSupportId: 'border',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraBorder: [
							{
								type: 'function',
								function: BoxBorderGenerator,
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (isActiveField(blockeraBorderRadius)) {
		const blockeraBorderRadius = blockProps.attributes.blockeraBorderRadius;

		if (blockeraBorderRadius !== attributes.blockeraBorderRadius.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'blockeraBorderRadius',
				support: 'blockeraBorderRadius',
				fallbackSupportId: 'border-radius',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						blockeraBorderRadius: [
							{
								type: 'function',
								function: BorderRadiusGenerator,
							},
						],
					},
					blockProps
				),
			});
		}
	}

	return styleGroup;
};
