// @flow

/**
 * Publisher dependencies
 */
import {
	getCssSelector,
	computedCssDeclarations,
} from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';
import type { CssRule } from '@publisher/style-engine/src/types';

/**
 * Internal dependencies
 */
import * as config from '../base/config';
import { attributes } from './attributes';
import type { StylesProps } from '../types';
import { useBlocksStore } from '../../hooks';
import { isUndefined } from '@publisher/utils';
import { isActiveField } from '../../api/utils';
import type { TSpacingDefaultProps, TCssProps } from './types/spacing-props';

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

export const SpacingStyles = ({
	state,
	clientId,
	blockName,
	currentBlock,
	// supports,
	// activeDeviceType,
	selectors: blockSelectors,
	attributes: currentBlockAttributes,
}: StylesProps): Array<CssRule> => {
	const { publisherSpacing } = config.spacingConfig;
	const blockProps = {
		clientId,
		blockName,
		attributes: currentBlockAttributes,
	};
	const { attributes: _attributes } = blockProps;
	const sharedParams = {
		state,
		clientId,
		currentBlock,
		blockSelectors,
		className: currentBlockAttributes?.className,
	};
	const staticDefinitionParams = {
		type: 'static',
		options: {
			important: true,
		},
	};

	const { hasBlockSupport } = useBlocksStore();

	const fallbackProps = !hasBlockSupport(blockName, 'spacing')
		? {}
		: updateCssProps(_attributes?.style?.spacing);
	const properties: TCssProps =
		isActiveField(publisherSpacing) &&
		_attributes.publisherSpacing !== attributes.publisherSpacing.default
			? updateCssProps(_attributes.publisherSpacing)
			: fallbackProps;

	const pickedSelector = getCssSelector({
		...sharedParams,
		query: 'publisherSpacing',
		support: 'publisherSpacing',
		fallbackSupportId: 'spacing',
	});

	return [
		{
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					publisherSpacing: [
						{
							...staticDefinitionParams,
							properties,
						},
					],
				},
				blockProps
			),
		},
	];
};
