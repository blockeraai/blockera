// @flow

/**
 * Blockera dependencies
 */
import { isUndefined } from '@blockera/utils';
import { getValueAddonRealValue } from '@blockera/controls';

/**
 * Internal dependencies
 */
import type { StylesProps } from '../types';
import { useBlocksStore } from '../../../hooks';
import { isActiveField } from '../../api/utils';
import type { CssRule } from '../../../style-engine/types';
import type { TSpacingDefaultProps, TCssProps } from './types/spacing-props';
import {
	getCompatibleBlockCssSelector,
	computedCssDeclarations,
} from '../../../style-engine';
import { getBlockSupportCategory, getBlockSupportFallback } from '../../utils';

const supports = getBlockSupportCategory('spacing');

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
			properties['margin-right'] = marginRight + ' !important';
		}

		const marginBottom = getValueAddonRealValue(spacingProps.margin.bottom);
		if (marginBottom !== '') {
			properties['margin-bottom'] = marginBottom;
		}

		const marginLeft = getValueAddonRealValue(spacingProps.margin.left);
		if (marginLeft !== '') {
			properties['margin-left'] = marginLeft + ' !important';
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
	config,
	clientId,
	blockName,
	masterState,
	currentBlock,
	activeDeviceType,
	supports: blockSupports,
	selectors: blockSelectors,
	defaultAttributes: attributes,
	attributes: currentBlockAttributes,
	...props
}: StylesProps): Array<CssRule> => {
	const { blockeraSpacing } = config.spacingConfig;
	const blockProps = {
		state,
		clientId,
		blockName,
		currentBlock,
		attributes: currentBlockAttributes,
	};
	const { attributes: _attributes } = blockProps;
	const sharedParams = {
		...props,
		state,
		clientId,
		blockName,
		masterState,
		currentBlock,
		blockSelectors,
		activeDeviceType,
		supports: blockSupports,
		className: currentBlockAttributes?.className,
	};
	const staticDefinitionParams = {
		type: 'static',
		options: {
			important: true,
		},
	};

	const { hasBlockSupport } = useBlocksStore();

	// Create cache key from inputs that affect output
	const cacheKey = JSON.stringify({
		blockeraSpacing: currentBlockAttributes?.blockeraSpacing,
		state,
		clientId,
		blockName,
		masterState,
		activeDeviceType,
		blockSelectors,
		className: currentBlockAttributes?.className,
		style: currentBlockAttributes?.style?.spacing,
	});

	// Check if we have cached result
	if ((SpacingStyles: any).cache?.[cacheKey]) {
		return (SpacingStyles: any).cache[cacheKey];
	}

	const fallbackProps = !hasBlockSupport(blockName, 'spacing')
		? {}
		: updateCssProps(_attributes?.style?.spacing);
	const properties: TCssProps =
		isActiveField(blockeraSpacing) &&
		_attributes.blockeraSpacing !== attributes.blockeraSpacing.default
			? updateCssProps(_attributes.blockeraSpacing)
			: fallbackProps;

	const pickedSelector = getCompatibleBlockCssSelector({
		...sharedParams,
		query: 'blockeraSpacing',
		support: 'blockeraSpacing',
		fallbackSupportId: getBlockSupportFallback(supports, 'blockeraSpacing'),
	});

	const styleGroup = [
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
				blockProps,
				pickedSelector
			),
		},
	];

	// Cache the result
	if (!(SpacingStyles: any).cache) {
		(SpacingStyles: any).cache = {};
	}
	(SpacingStyles: any).cache[cacheKey] = styleGroup;

	return styleGroup;
};
