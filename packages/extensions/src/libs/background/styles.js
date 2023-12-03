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
import { useCssSelector } from '../../hooks';

interface IConfigs {
	backgroundConfig: {
		cssGenerators: Object,
		publisherBackground?: Object,
		publisherBackgroundColor?: Object,
		publisherBackgroundClip?: Object,
	};
	blockProps: TBlockProps;
}

export function BackgroundStyles({
	backgroundConfig: {
		cssGenerators,
		publisherBackground,
		publisherBackgroundColor,
		publisherBackgroundClip,
	},
	blockProps,
}: IConfigs): string {
	const generators = [];
	const selector = useCssSelector({
		blockName: blockProps.blockName,
		supportId: 'publisherBackground',
	});

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
					cssGenerators: {
						publisherBackground: [
							{
								selector: `${selector}, ${selector} .publisher-extension-ref, ${selector} .publisher-icon-element div[contentEditable="true"], .publisher-icon-element div`,
								type: 'function',
								function: backgroundGenerator,
							},
						],
						...(publisherBackground?.cssGenerators || {}),
					},
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
						cssGenerators: {
							publisherBackgroundColor: [
								{
									type: 'static',
									selector: '.{{BLOCK_ID}}',
									properties: {
										'background-color':
											publisherBackgroundColor,
									},
								},
							],
						},
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
					cssGenerators: {
						publisherBackgroundClip: [
							{
								type: 'function',
								function: backgroundClipGenerator,
							},
						],
					},
				},
				blockProps
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
			blockProps
		)
	);

	return generators.length > 1 ? generators.join('\n') : generators.join('');
}
