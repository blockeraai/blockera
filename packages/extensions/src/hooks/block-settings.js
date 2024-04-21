// @flow
/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import type { MixedElement } from 'react';
import { SlotFillProvider, Slot } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { isObject, isFunction, mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../store/constants';
import {
	blockStatesAttributes,
	innerBlocksExtensionsAttributes,
} from '../index';
import { sanitizedBlockAttributes } from './utils';
import { BlockBase, BlockPortals } from '../components';
import { isBlockTypeExtension, isEnabledExtension } from '../api/utils';

const { getBlockExtension, getBlockExtensionBy } = select(STORE_NAME) || {};

/**
 * Filters registered WordPress block type settings, extending block settings with settings and block name.
 *
 * @param {Object} settings Original block settings.
 * @param {string} name block id or name.
 * @return {Object} Filtered block settings.
 */
export default function withBlockSettings(
	settings: Object,
	name: Object
): Object {
	const sharedExtension = getBlockExtension('Shared');
	const blockExtension = getBlockExtensionBy('targetBlock', name);

	if (blockExtension && isBlockTypeExtension(blockExtension)) {
		return mergeBlockSettings(
			settings,
			mergeObject(sharedExtension, blockExtension)
		);
	}

	return mergeBlockSettings(settings, sharedExtension);
}

/**
 * Merge settings of block type.
 *
 * @param {Object} settings The default WordPress block type settings
 * @param {Object} additional The additional settings of extension
 * @return {Object} merged settings!
 */
function mergeBlockSettings(settings: Object, additional: Object): Object {
	if (!isEnabledExtension(additional)) {
		return settings;
	}

	const overrideAttributes = mergeObject(
		settings.attributes,
		mergeObject(additional.attributes, blockStatesAttributes)
	);

	const defaultAttributes = mergeObject(overrideAttributes, {
		blockeraInnerBlocks:
			innerBlocksExtensionsAttributes.blockeraInnerBlocks,
		blockeraPropsId: {
			type: 'string',
			default: '',
		},
		blockeraCompatId: {
			type: 'string',
			default: '',
		},
	});

	return {
		...settings,
		attributes: defaultAttributes,
		supports: mergeObject(settings.supports, additional.supports),
		selectors: mergeObject(settings.selectors, additional.selectors),
		transforms: {
			...(settings?.transforms || {}),
			...(additional?.transforms || {}),
		},
		variations: [
			...(settings?.variations || []),
			...(additional.variations || []),
		],
		edit(props: Object): MixedElement {
			if (isFunction(additional?.edit)) {
				return (
					<>
						<BlockBase
							{...{
								...props,
								additional,
								defaultAttributes,
							}}
						>
							<SlotFillProvider>
								<Slot name={'blockera-core-block-before'} />

								<BlockPortals
									blockId={`#block-${props.clientId}`}
									mainSlot={'blockera-core-block-slot'}
									slots={
										// slot selectors is feature on configuration block to create custom slots for anywhere.
										// we can add slotSelectors property on block configuration to handle custom preview of block.
										additional?.slotSelectors || {}
									}
								/>

								<Slot name={'blockera-core-block-after'} />
							</SlotFillProvider>
						</BlockBase>
						{settings.edit(props)}
					</>
				);
			}

			return settings.edit(props);
		},
		save(props: Object): MixedElement {
			props = {
				...props,
				attributes: sanitizedBlockAttributes(props.attributes),
			};

			return settings.save(props);
		},
		deprecated: [
			{
				attributes: settings.attributes,
				supports: settings.supports,
				migrate(attributes: Object): Object {
					return additional.migrate(attributes);
				},
				edit(blockProps: Object): MixedElement {
					return settings.edit(blockProps);
				},
				save(blockProps: Object): MixedElement {
					return settings.save(blockProps);
				},
			},
			...(settings?.deprecated || []),
		].filter(isObject),
	};
}
