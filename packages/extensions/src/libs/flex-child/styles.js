// @flow

/**
 * Publisher dependencies
 */
import {
	getCssSelector,
	computedCssDeclarations,
} from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';

/**
 * Internal dependencies
 */
import * as config from '../base/config';
import { attributes } from './attributes';
import type { StylesProps } from '../types';
import { isActiveField } from '../../api/utils';
import type { CssRule } from '@publisher/style-engine/src/types';

export const FlexChildStyles = ({
	state,
	clientId,
	blockName,
	currentBlock,
	// supports,
	// activeDeviceType,
	selectors: blockSelectors,
	attributes: currentBlockAttributes,
}: StylesProps): Array<CssRule> => {
	const {
		publisherFlexChildSizing,
		publisherFlexChildAlign,
		publisherFlexChildOrder,
	} = config.flexChildConfig;
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
	const styleGroup: Array<CssRule> = [];

	if (
		isActiveField(publisherFlexChildSizing) &&
		_attributes.publisherFlexChildSizing !==
			attributes.publisherFlexChildSizing.default
	) {
		const properties: { [key: string]: string } = {};

		switch (_attributes.publisherFlexChildSizing) {
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
					_attributes.publisherFlexChildGrow
				);

				const shrink = getValueAddonRealValue(
					_attributes.publisherFlexChildShrink
				);

				const basis = getValueAddonRealValue(
					_attributes.publisherFlexChildBasis
				);

				properties.flex = `${grow ? grow : 0} ${shrink ? shrink : 0} ${
					basis ? basis : 'auto'
				}`;
				break;
		}

		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'publisherFlexChildSizing',
			support: 'publisherFlexChildSizing',
			fallbackSupportId: undefined,
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					publisherFlexChildSizing: [
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
		isActiveField(publisherFlexChildAlign) &&
		_attributes.publisherFlexChildAlign !==
			attributes.publisherFlexChildAlign.default
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'publisherFlexChildAlign',
			support: 'publisherFlexChildAlign',
			fallbackSupportId: undefined,
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					publisherFlexChildAlign: [
						{
							...staticDefinitionParams,
							properties: {
								'align-self':
									_attributes.publisherFlexChildAlign,
							},
						},
					],
				},
				blockProps
			),
		});
	}

	if (
		isActiveField(publisherFlexChildOrder) &&
		_attributes.publisherFlexChildOrder !==
			attributes.publisherFlexChildOrder.default
	) {
		const properties: { [key: string]: string } = {};

		switch (_attributes.publisherFlexChildOrder) {
			case 'first':
				properties.order = '-1';
				break;

			case 'last':
				properties.order = '100';
				break;

			case 'custom':
				const order = getValueAddonRealValue(
					_attributes.publisherFlexChildOrderCustom
				);

				if (order) properties.order = order;

				break;
		}

		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'publisherFlexChildOrder',
			support: 'publisherFlexChildOrder',
			fallbackSupportId: undefined,
		});

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					publisherFlexChildOrder: [
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
