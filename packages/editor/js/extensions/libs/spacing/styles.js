// @flow

/**
 * Blockera dependencies
 */
import { isUndefined } from '@blockera/utils';
import { getValueAddonRealValue } from '@blockera/controls';

/**
 * Internal dependencies
 */
import * as config from '../base/config';
import { attributes } from './attributes';
import type { StylesProps } from '../types';
import { useBlocksStore } from '../../../hooks';
import { isActiveField } from '../../api/utils';
import type { CssRule } from '../../../style-engine/types';
import type { TSpacingDefaultProps, TCssProps } from './types/spacing-props';
import { getCssSelector, computedCssDeclarations } from '../../../style-engine';

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
	activeDeviceType,
	selectors: blockSelectors,
	attributes: currentBlockAttributes,
	...props
}: StylesProps): Array<CssRule> => {
	const { blockeraSpacing } = config.spacingConfig;
	const blockProps = {
		clientId,
		blockName,
		attributes: currentBlockAttributes,
	};
	const { attributes: _attributes } = blockProps;
	const sharedParams = {
		...props,
		state,
		clientId,
		currentBlock,
		blockSelectors,
		device: activeDeviceType,
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
		isActiveField(blockeraSpacing) &&
		_attributes.blockeraSpacing !== attributes.blockeraSpacing.default
			? updateCssProps(_attributes.blockeraSpacing)
			: fallbackProps;

	const pickedSelector = getCssSelector({
		...sharedParams,
		query: 'blockeraSpacing',
		support: 'blockeraSpacing',
		fallbackSupportId: 'spacing',
	});

	return [
		{
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraSpacing: [
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
