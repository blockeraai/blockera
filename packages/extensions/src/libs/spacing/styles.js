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
		const marginTop = getValueAddonRealValue(spacingProps.margin.top);
		if (marginTop !== '') {
			properties['margin-top'] = marginTop;
		}

		const marginRight = getValueAddonRealValue(spacingProps.margin.right);
		if (marginRight !== '') {
			properties['margin-right'] = marginRight;
		}

		const marginBottom = getValueAddonRealValue(spacingProps.margin.bottom);
		if (marginBottom !== '') {
			properties['margin-bottom'] = marginBottom;
		}

		const marginLeft = getValueAddonRealValue(spacingProps.margin.left);
		if (marginLeft !== '') {
			properties['margin-left'] = marginLeft;
		}
	}

	if (!isUndefined(spacingProps.padding)) {
		const paddingTop = getValueAddonRealValue(spacingProps.padding.top);
		if (paddingTop !== '') {
			properties['padding-top'] = paddingTop;
		}

		const paddingRight = getValueAddonRealValue(spacingProps.padding.right);
		if (paddingRight !== '') {
			properties['padding-right'] = paddingRight;
		}

		const paddingBottom = getValueAddonRealValue(
			spacingProps.padding.bottom
		);
		if (paddingBottom !== '') {
			properties['padding-bottom'] = paddingBottom;
		}

		const paddingLeft = getValueAddonRealValue(spacingProps.padding.left);
		if (paddingLeft !== '') {
			properties['padding-left'] = paddingLeft;
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
