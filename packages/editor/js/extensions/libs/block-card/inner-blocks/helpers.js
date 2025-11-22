// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import memoize from 'fast-memoize';
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import { prepareBlockeraDefaultAttributesValues } from '../../../components';
import type { InnerBlocks, InnerBlockType } from './types';

/**
 * Preparing inner blocks.
 *
 * @param {Object} registeredInnerBlocks The register inner blocks on outside of core.
 * @param {Object} rootAttributes The block root attributes.
 * @return {InnerBlocks} The inner blocks each item includes prepared attributes of master blocks as default value.
 */
export function prepareInnerBlockTypes(
	registeredInnerBlocks: InnerBlocks,
	rootAttributes: Object
): InnerBlocks {
	const keys: Array<InnerBlockType | string> = Object.keys(
		registeredInnerBlocks
	);

	if (!keys.length) {
		return {};
	}

	const getMemoizedInnerBlockAttributes = memoize(
		prepareBlockeraDefaultAttributesValues
	);

	const innerBlockAttributes =
		getMemoizedInnerBlockAttributes(rootAttributes);
	const getMemoizedInnerBlocks = memoize(
		(innerBlockTypes: Array<InnerBlockType>): InnerBlocks => {
			const innerBlocks: InnerBlocks = {};

			innerBlockTypes.forEach((innerBlockType: InnerBlockType): void => {
				if (innerBlocks[innerBlockType]) {
					return;
				}

				innerBlocks[innerBlockType] = {
					...registeredInnerBlocks[innerBlockType],
					attributes: innerBlockAttributes,
				};
			});

			return innerBlocks;
		}
	);

	return getMemoizedInnerBlocks(keys);
}

export const getVirtualInnerBlockDescription = (): MixedElement => {
	return (
		<>
			<h5>{__('What is a Virtual Inner Block?', 'blockera')}</h5>
			<p>
				{__(
					'A Virtual Inner Block is a child inner element of a block that there is no way to select and customize it in editor.',
					'blockera'
				)}
			</p>
			<p>
				{__(
					"We've included these elements as Virtual Inner Blocks so you can fully customize them.",
					'blockera'
				)}
			</p>
		</>
	);
};
