// @flow
/**
 * Publisher dependencies
 */
import {
	computedCssDeclarations,
	getCssSelector,
} from '@publisher/style-engine';
import type { CssRule } from '@publisher/style-engine/src/types';

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

export const BorderAndShadowStyles = ({
	state,
	clientId,
	blockName,
	currentBlock,
	// supports,
	// activeDeviceType,
	selectors: blockSelectors,
	attributes: currentBlockAttributes,
}: StylesProps): Array<CssRule> => {
	const {
		publisherBorder,
		publisherOutline,
		publisherBoxShadow,
		publisherBorderRadius,
	} = config.borderAndShadowConfig;

	const blockProps = {
		clientId,
		blockName,
		attributes: currentBlockAttributes,
	};

	const sharedParams = {
		state,
		clientId,
		currentBlock,
		blockSelectors,
		className: currentBlockAttributes?.className,
	};

	const styleGroup: Array<CssRule> = [];

	if (
		isActiveField(publisherBoxShadow) &&
		!arrayEquals(
			attributes.publisherBoxShadow.default,
			blockProps.attributes.publisherBoxShadow
		)
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'publisherBoxShadow',
			support: 'publisherBoxShadow',
			fallbackSupportId: 'box-shadow',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					publisherBoxShadow: [
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

	if (isActiveField(publisherOutline)) {
		const publisherOutline = blockProps.attributes.publisherOutline;

		if (publisherOutline !== attributes.publisherOutline.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherOutline',
				support: 'publisherOutline',
				fallbackSupportId: 'outline',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherOutline: [
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

	if (isActiveField(publisherBorder)) {
		const publisherBorder = blockProps.attributes.publisherBorder;

		if (publisherBorder !== attributes.publisherBorder.default) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherBorder',
				support: 'publisherBorder',
				fallbackSupportId: 'border',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherBorder: [
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

	if (isActiveField(publisherBorderRadius)) {
		const publisherBorderRadius =
			blockProps.attributes.publisherBorderRadius;

		if (
			publisherBorderRadius !== attributes.publisherBorderRadius.default
		) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherBorderRadius',
				support: 'publisherBorderRadius',
				fallbackSupportId: 'border-radius',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherBorderRadius: [
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
