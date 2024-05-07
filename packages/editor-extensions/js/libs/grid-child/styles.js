// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import {
	getCssSelector,
	computedCssDeclarations,
} from '@blockera/style-engine';

/**
 * Internal dependencies
 */
import { attributes } from './attributes';
import { isActiveField } from '../../api/utils';
import * as config from '../base/config';
import type { StylesProps } from '../types';
import type { CssRule } from '@blockera/style-engine/src/types';

export function GridChildStyles({
	state,
	clientId,
	blockName,
	currentBlock,
	// supports,
	// activeDeviceType,
	selectors: blockSelectors,
	attributes: currentBlockAttributes,
	...props
}: StylesProps): Array<CssRule> {
	const { blockeraGridChildOrder, blockeraGridChildLayout } =
		config.gridChildConfig;
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
		className: currentBlockAttributes?.className,
	};
	const staticDefinitionParams = {
		type: 'static',
		options: {
			important: true,
		},
	};
	const styleGroup: Array<CssRule> = [];

	const parentClientIds =
		select('core/block-editor').getBlockParents(clientId);

	const directParentBlock = select('core/block-editor').getBlock(
		parentClientIds[parentClientIds.length - 1]
	);

	if (
		isActiveField(blockeraGridChildLayout) &&
		_attributes.blockeraGridChildLayout !==
			attributes.blockeraGridChildLayout.default
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'blockeraGridChildLayout',
			support: 'blockeraGridChildLayout',
			fallbackSupportId: undefined,
		});

		const properties: { [key: string]: string } = {};

		properties['align-self'] =
			_attributes.blockeraGridChildLayout.alignItems;
		properties['justify-self'] =
			_attributes.blockeraGridChildLayout.justifyContent;

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraGridChildLayout: [
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
		isActiveField(blockeraGridChildOrder) &&
		_attributes.blockeraGridChildOrder !==
			attributes.blockeraGridChildOrder.default
	) {
		const pickedSelector = getCssSelector({
			...sharedParams,
			query: 'blockeraGridChildOrder',
			support: 'blockeraGridChildOrder',
			////????
			fallbackSupportId: undefined,
		});

		const properties: { [key: string]: string } = {};

		switch (_attributes.blockeraGridChildOrder.value) {
			case 'first':
				properties.order = '-1';
				break;
			case 'last':
				properties.order = '100';
				break;
			case 'manual':
				const area = _attributes.blockeraGridChildOrder.area;
				const selectedArea =
					directParentBlock.attributes.blockeraGridAreas.find(
						(item) =>
							`${item['column-start']}/${item['column-end']}/${item['row-start']}/${item['row-end']}` ===
							area
					);

				if (selectedArea) properties['grid-area'] = selectedArea.name;
				break;
		}

		styleGroup.push({
			selector: pickedSelector,
			declarations: computedCssDeclarations(
				{
					blockeraGridChildOrder: [
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
