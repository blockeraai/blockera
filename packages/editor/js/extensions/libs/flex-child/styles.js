// @flow

/**
 * Blockera dependencies
 */
import { getValueAddonRealValue } from '@blockera/controls';

/**
 * Internal dependencies
 */
import type { StylesProps } from '../types';
import { isActiveField } from '../../api/utils';
import type { CssRule } from '../../../style-engine/types';
import {
	getCompatibleBlockCssSelector,
	computedCssDeclarations,
} from '../../../style-engine';
import { getBlockSupportCategory, getBlockSupportFallback } from '../../utils';

const supports = getBlockSupportCategory('layout');

export const FlexChildStyles = ({
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
	// Create cache key from inputs that affect output
	const cacheKey = JSON.stringify({
		blockeraFlexChildSizing: currentBlockAttributes.blockeraFlexChildSizing,
		blockeraFlexChildGrow: currentBlockAttributes.blockeraFlexChildGrow,
		blockeraFlexChildShrink: currentBlockAttributes.blockeraFlexChildShrink,
		blockeraFlexChildBasis: currentBlockAttributes.blockeraFlexChildBasis,
		blockeraFlexChildAlign: currentBlockAttributes.blockeraFlexChildAlign,
		blockeraFlexChildOrder: currentBlockAttributes.blockeraFlexChildOrder,
		blockeraFlexChildOrderCustom:
			currentBlockAttributes.blockeraFlexChildOrderCustom,
		state,
		clientId,
		blockName,
		masterState,
		activeDeviceType,
		blockSelectors,
		className: currentBlockAttributes?.className,
	});

	// Check if we have cached result
	if (FlexChildStyles.cache?.[cacheKey]) {
		return FlexChildStyles.cache[cacheKey];
	}

	const {
		blockeraFlexChildSizing,
		blockeraFlexChildAlign,
		blockeraFlexChildOrder,
	} = config.flexChildConfig;
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
	const styleGroup: Array<CssRule> = [];

	if (
		isActiveField(blockeraFlexChildSizing) &&
		_attributes.blockeraFlexChildSizing !==
			attributes.blockeraFlexChildSizing.default
	) {
		const properties: { [key: string]: string } = {};

		switch (_attributes.blockeraFlexChildSizing) {
			case 'shrink':
				properties.flex = '0 1 auto';
				break;

			case 'grow':
				properties.flex = '1 1 0%';
				break;

			case 'no':
				properties.flex = '0 0 auto';
				break;

			case 'custom':
				const grow = getValueAddonRealValue(
					_attributes.blockeraFlexChildGrow
				);

				const shrink = getValueAddonRealValue(
					_attributes.blockeraFlexChildShrink
				);

				const basis = getValueAddonRealValue(
					_attributes.blockeraFlexChildBasis
				);

				properties.flex = `${grow ? grow : 0} ${shrink ? shrink : 0} ${
					basis ? basis : 'auto'
				}`;
				break;
		}

		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraFlexChildSizing',
			support: 'blockeraFlexChildSizing',
			fallbackSupportId: getBlockSupportFallback(
				supports,
				'blockeraFlexChildSizing'
			),
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraFlexChildSizing: [
						{
							...staticDefinitionParams,
							properties,
						},
					],
				},
				blockProps,
				pickedSelector
			),
		});
	}

	if (
		isActiveField(blockeraFlexChildAlign) &&
		_attributes.blockeraFlexChildAlign !==
			attributes.blockeraFlexChildAlign.default
	) {
		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraFlexChildAlign',
			support: 'blockeraFlexChildAlign',
			fallbackSupportId: getBlockSupportFallback(
				supports,
				'blockeraFlexChildAlign'
			),
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraFlexChildAlign: [
						{
							...staticDefinitionParams,
							properties: {
								'align-self':
									_attributes.blockeraFlexChildAlign,
							},
						},
					],
				},
				blockProps,
				pickedSelector
			),
		});
	}

	if (
		isActiveField(blockeraFlexChildOrder) &&
		_attributes.blockeraFlexChildOrder !==
			attributes.blockeraFlexChildOrder.default
	) {
		const properties: { [key: string]: string } = {};

		switch (_attributes.blockeraFlexChildOrder) {
			case 'first':
				properties.order = '-1';
				break;

			case 'last':
				properties.order = '100';
				break;

			case 'custom':
				const order = getValueAddonRealValue(
					_attributes.blockeraFlexChildOrderCustom
				);

				if (order) properties.order = order;

				break;
		}

		const pickedSelector = getCompatibleBlockCssSelector({
			...sharedParams,
			query: 'blockeraFlexChildOrder',
			support: 'blockeraFlexChildOrder',
			fallbackSupportId: getBlockSupportFallback(
				supports,
				'blockeraFlexChildOrder'
			),
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraFlexChildOrder: [
						{
							...staticDefinitionParams,
							properties,
						},
					],
				},
				blockProps,
				pickedSelector
			),
		});
	}

	// Cache the result
	if (!FlexChildStyles.cache) {
		FlexChildStyles.cache = {};
	}
	FlexChildStyles.cache[cacheKey] = styleGroup;

	return styleGroup;
};
