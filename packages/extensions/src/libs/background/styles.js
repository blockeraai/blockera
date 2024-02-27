// @flow
/**
 * Publisher dependencies
 */
import { getValueAddonRealValue } from '@publisher/hooks';
import type { CssRule } from '@publisher/style-engine/src/types';

/**
 * Internal dependencies
 */
import { arrayEquals } from '../utils';
import * as config from '../base/config';
import { attributes } from './attributes';
import type { StylesProps } from '../types';
import { isActiveField } from '../../api/utils';
import { backgroundGenerator, backgroundClipGenerator } from './css-generators';
import {
	computedCssDeclarations,
	getCssSelector,
} from '@publisher/style-engine';

export const BackgroundStyles = ({
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
		publisherBackground,
		publisherBackgroundColor,
		publisherBackgroundClip,
	} = config.backgroundConfig;
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
		isActiveField(publisherBackground) &&
		!arrayEquals(
			attributes.publisherBackground.default,
			blockProps.attributes.publisherBackground
		)
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'publisherBackground',
			support: 'publisherBackground',
			fallbackSupportId: 'background',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					publisherBackground: [
						{
							type: 'function',
							function: backgroundGenerator,
						},
					],
				},
				blockProps
			),
		});
	}

	if (isActiveField(publisherBackgroundColor)) {
		const publisherBackgroundColor = getValueAddonRealValue(
			blockProps.attributes.publisherBackgroundColor
		);

		if (
			publisherBackgroundColor !==
			attributes.publisherBackgroundColor.default
		) {
			const pickedSelector = getCssSelector({
				...sharedParams,
				query: 'publisherBackgroundColor',
				support: 'publisherBackgroundColor',
				fallbackSupportId: 'backgroundColor',
			});

			styleGroup.push({
				selector: pickedSelector,
				declarations: computedCssDeclarations(
					{
						publisherBackgroundColor: [
							{
								type: 'static',
								properties: {
									'background-color':
										publisherBackgroundColor,
								},
							},
						],
					},
					blockProps
				),
			});
		}
	}

	if (
		isActiveField(publisherBackgroundClip) &&
		blockProps.attributes.publisherBackgroundClip !==
			attributes.publisherBackgroundClip.default
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'publisherBackgroundClip',
			support: 'publisherBackgroundClip',
			fallbackSupportId: 'backgroundClip',
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					publisherBackgroundClip: [
						{
							type: 'function',
							function: backgroundClipGenerator,
						},
					],
				},
				blockProps
			),
		});
	}

	return styleGroup;
};
