// @flow
/**
 * Publisher dependencies
 */
import { computedCssRules } from '@publisher/style-engine';

/**
 * Internal dependencies
 */
import { attributes } from './attributes';
import type { TBlockProps } from '../types';
import { useBlocksStore, useCssSelector } from '../../hooks';
import { isUndefined } from '@publisher/utils';
import { isActiveField } from '../../api/utils';
import type { TSpacingDefaultProps, TCssProps } from './types/spacing-props';

interface IConfigs {
	spacingConfig: {
		cssGenerators: Object,
		publisherSpacing: TSpacingDefaultProps,
	};
	blockProps: TBlockProps;
}

function updateCssProps(spacingProps: TSpacingDefaultProps): TCssProps {
	const properties: TCssProps = {};

	if (isUndefined(spacingProps)) {
		return properties;
	}

	if (!isUndefined(spacingProps.margin)) {
		if (spacingProps.margin.top !== '') {
			properties['margin-top'] = spacingProps.margin.top;
		}

		if (spacingProps.margin.right !== '') {
			properties['margin-right'] = spacingProps.margin.right;
		}

		if (spacingProps.margin.bottom !== '') {
			properties['margin-bottom'] = spacingProps.margin.bottom;
		}

		if (spacingProps.margin.left !== '') {
			properties['margin-left'] = spacingProps.margin.left;
		}
	}

	if (!isUndefined(spacingProps.padding)) {
		if (spacingProps.padding.top !== '') {
			properties['padding-top'] = spacingProps.padding.top;
		}

		if (spacingProps.padding.right !== '') {
			properties['padding-right'] = spacingProps.padding.right;
		}

		if (spacingProps.padding.bottom !== '') {
			properties['padding-bottom'] = spacingProps.padding.bottom;
		}

		if (spacingProps.padding.left !== '') {
			properties['padding-left'] = spacingProps.padding.left;
		}
	}

	return properties;
}

export function SpacingStyles({
	spacingConfig: { cssGenerators, publisherSpacing },
	blockProps,
}: IConfigs): string {
	const { attributes: _attributes, blockName } = blockProps;
	const selector = useCssSelector({
		blockName,
		supportId: 'publisherSpacing',
		fallbackSupportId: 'spacing',
	});
	const { hasBlockSupport } = useBlocksStore();
	const generators = [];
	const fallbackProps = !hasBlockSupport(blockName, 'spacing')
		? {}
		: updateCssProps(_attributes?.style?.spacing);
	const properties: TCssProps =
		isActiveField(publisherSpacing) &&
		_attributes.publisherSpacing !== attributes.publisherSpacing.default
			? updateCssProps(_attributes.publisherSpacing)
			: fallbackProps;

	if (Object.keys(properties).length > 0) {
		generators.push(
			computedCssRules(
				{
					cssGenerators: {
						publisherSpacing: [
							{
								type: 'static',
								selector,
								properties,
								options: {
									important: true,
								},
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
