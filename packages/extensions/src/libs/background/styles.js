// @flow
/**
 * Publisher dependencies
 */
import { computedCssRules } from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';

/**
 * Internal dependencies
 */
import { arrayEquals } from '../utils';
import { attributes } from './attributes';
import type { TBlockProps } from '../types';
import { isActiveField } from '../../api/utils';
import { backgroundGenerator, backgroundClipGenerator } from './css-generators';

interface IConfigs {
	backgroundConfig: {
		cssGenerators: Object,
		publisherBackground?: Object,
		publisherBackgroundColor?: Object,
		publisherBackgroundClip?: Object,
	};
	blockProps: TBlockProps;
	selector: string;
	media: string;
}

export function BackgroundStyles({
	backgroundConfig: {
		cssGenerators,
		publisherBackground,
		publisherBackgroundColor,
		publisherBackgroundClip,
	},
	blockProps,
	selector,
	media,
}: IConfigs): string {
	const generators = [];

	if (
		isActiveField(publisherBackground) &&
		!arrayEquals(
			attributes.publisherBackground.default,
			blockProps.attributes.publisherBackground
		)
	) {
		generators.push(
			computedCssRules(
				{
					publisherBackground: [
						{
							media,
							selector: `${selector}, ${selector} .publisher-extension-ref, ${selector} .publisher-icon-element div[contentEditable="true"], .publisher-icon-element div`,
							type: 'function',
							function: backgroundGenerator,
						},
					],
					...(publisherBackground?.cssGenerators || {}),
				},
				blockProps
			)
		);
	}

	if (isActiveField(publisherBackgroundColor)) {
		const publisherBackgroundColor = getValueAddonRealValue(
			blockProps.attributes.publisherBackgroundColor
		);

		if (
			publisherBackgroundColor !==
			attributes.publisherBackgroundColor.default
		) {
			generators.push(
				computedCssRules(
					{
						publisherBackgroundColor: [
							{
								type: 'static',
								media,
								selector,
								properties: {
									'background-color':
										publisherBackgroundColor,
								},
							},
						],
					},
					blockProps
				)
			);
		}
	}

	if (
		isActiveField(publisherBackgroundClip) &&
		blockProps.attributes.publisherBackgroundClip !==
			attributes.publisherBackgroundClip.default
	) {
		generators.push(
			computedCssRules(
				{
					publisherBackgroundClip: [
						{
							media,
							selector,
							type: 'function',
							function: backgroundClipGenerator,
						},
					],
				},
				blockProps
			)
		);
	}

	generators.push(
		computedCssRules(
			{
				...(cssGenerators || {}),
			},
			blockProps
		)
	);

	return generators.length > 1 ? generators.join('\n') : generators.join('');
}
