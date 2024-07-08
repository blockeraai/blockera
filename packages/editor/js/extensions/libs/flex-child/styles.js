// @flow

/**
 * Blockera dependencies
 */
import { getValueAddonRealValue } from '@blockera/controls';

/**
 * Internal dependencies
 */
import * as config from '../base/config';
import { attributes } from './attributes';
import type { StylesProps } from '../types';
import { isActiveField } from '../../api/utils';
import type { CssRule } from '../../../style-engine/types';
import { getCssSelector, computedCssDeclarations } from '../../../style-engine';

export const FlexChildStyles = ({
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
	const {
		blockeraFlexChildSizing,
		blockeraFlexChildAlign,
		blockeraFlexChildOrder,
	} = config.flexChildConfig;
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

		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'blockeraFlexChildSizing',
			support: 'blockeraFlexChildSizing',
			fallbackSupportId: undefined,
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
				blockProps
			),
		});
	}

	if (
		isActiveField(blockeraFlexChildAlign) &&
		_attributes.blockeraFlexChildAlign !==
			attributes.blockeraFlexChildAlign.default
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'blockeraFlexChildAlign',
			support: 'blockeraFlexChildAlign',
			fallbackSupportId: undefined,
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
				blockProps
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

		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'blockeraFlexChildOrder',
			support: 'blockeraFlexChildOrder',
			fallbackSupportId: undefined,
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
				blockProps
			),
		});
	}

	return styleGroup;
};
