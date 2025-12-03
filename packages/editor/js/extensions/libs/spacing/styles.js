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
import type {
	TSpacingDefaultPropsMinimized,
	TCssProps,
} from './types/spacing-props';
import {
	getCompatibleBlockCssSelector,
	computedCssDeclarations,
} from '../../../style-engine';
import { getBlockSupportCategory, getBlockSupportFallback } from '../../utils';

const supports = getBlockSupportCategory('spacing');

function updateCssProps(
	spacingProps: TSpacingDefaultPropsMinimized
): TCssProps {
	const properties: TCssProps = {};

	if (isUndefined(spacingProps)) {
		return properties;
	}

	if (!isUndefined(spacingProps?.margin)) {
		const marginTop = getValueAddonRealValue(spacingProps?.margin?.top);
		if (marginTop !== '') {
			properties['margin-top'] = marginTop;
		}

		const marginRight = getValueAddonRealValue(spacingProps?.margin?.right);
		if (marginRight !== '') {
			properties['margin-right'] = marginRight + ' !important';
		}

		const marginBottom = getValueAddonRealValue(
			spacingProps?.margin?.bottom
		);
		if (marginBottom !== '') {
			properties['margin-bottom'] = marginBottom;
		}

		const marginLeft = getValueAddonRealValue(spacingProps?.margin?.left);
		if (marginLeft !== '') {
			properties['margin-left'] = marginLeft + ' !important';
		}
	}

	if (!isUndefined(spacingProps?.padding)) {
		const paddingTop = getValueAddonRealValue(spacingProps?.padding?.top);
		if (paddingTop !== '') {
			properties['padding-top'] = paddingTop;
		}

		const paddingRight = getValueAddonRealValue(
			spacingProps?.padding?.right
		);
		if (paddingRight !== '') {
			properties['padding-right'] = paddingRight;
		}

		const paddingBottom = getValueAddonRealValue(
			spacingProps?.padding?.bottom
		);
		if (paddingBottom !== '') {
			properties['padding-bottom'] = paddingBottom;
		}

		const paddingLeft = getValueAddonRealValue(spacingProps?.padding?.left);
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
	const { hasBlockSupport } = useBlocksStore();

	const { blockeraSpacing } = config.spacingConfig;

	if (!hasBlockSupport(blockName, 'spacing')) {
		return [];
	}

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

	const isActive =
		isActiveField(blockeraSpacing) &&
		_attributes.blockeraSpacing !== attributes.blockeraSpacing.default;

	if (!isActive) {
		return [];
	}

	const paddingProperties: TCssProps = updateCssProps({
		padding: _attributes.blockeraSpacing?.padding,
	});

	const marginProperties: TCssProps = updateCssProps({
		margin: _attributes.blockeraSpacing?.margin,
	});

	const styleGroup = [];

	if (Object.keys(marginProperties).length > 0) {
		const marginPickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraMargin',
			support: 'blockeraMargin',
			fallbackSupportId: getBlockSupportFallback(
				supports,
				'blockeraMargin'
			),
		});

		styleGroup.push({
			selector: marginPickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraSpacing: [
						{
							...staticDefinitionParams,
							properties: marginProperties,
						},
					],
				},
				blockProps,
				marginPickedSelector
			),
		});
	}

	if (Object.keys(paddingProperties).length > 0) {
		const paddingPickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraPadding',
			support: 'blockeraPadding',
			fallbackSupportId: getBlockSupportFallback(
				supports,
				'blockeraPadding'
			),
		});

		styleGroup.push({
			selector: paddingPickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraSpacing: [
						{
							...staticDefinitionParams,
							properties: paddingProperties,
						},
					],
				},
				blockProps,
				paddingPickedSelector
			),
		});
	}

	return styleGroup;
};
