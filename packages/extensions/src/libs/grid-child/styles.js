// @flow
/**
 * Publisher dependencies
 */
import {
	getCssSelector,
	computedCssDeclarations,
} from '@publisher/style-engine';

/**
 * Internal dependencies
 */
import { attributes } from './attributes';
import { isActiveField } from '../../api/utils';
import * as config from '../base/config';
import type { StylesProps } from '../types';
import type { CssRule } from '@publisher/style-engine/src/types';

export function GridChildStyles({
	state,
	clientId,
	blockName,
	currentBlock,
	// supports,
	// activeDeviceType,
	selectors: blockSelectors,
	attributes: currentBlockAttributes,
}: StylesProps): Array<CssRule> {
	const { publisherGridChildOrder, publisherGridChildLayout } =
		config.gridChildConfig;
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
		isActiveField(publisherGridChildLayout) &&
		_attributes.publisherGridChildLayout !==
			attributes.publisherGridChildLayout.default
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'publisherGridChildLayout',
			support: 'publisherGridChildLayout',
			////????
			fallbackSupportId: undefined,
		});

		const properties: { [key: string]: string } = {};

		properties['align-self'] =
			_attributes.publisherGridChildLayout.alignItems;
		properties['justify-self'] =
			_attributes.publisherGridChildLayout.justifyContent;

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					publisherGridChildLayout: [
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
		isActiveField(publisherGridChildOrder) &&
		_attributes.publisherGridChildOrder !==
			attributes.publisherGridChildOrder.default
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'publisherGridChildOrder',
			support: 'publisherGridChildOrder',
			////????
			fallbackSupportId: undefined,
		});

		const properties: { [key: string]: string } = {};

		switch (_attributes.publisherGridChildOrder.value) {
			case 'first':
				properties.order = '-1';
				break;
			case 'last':
				properties.order = '100';
				break;
			case 'manual':
				properties['grid-area'] =
					_attributes.publisherGridChildOrder.area;
				break;
		}

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					publisherGridChildOrder: [
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
}
