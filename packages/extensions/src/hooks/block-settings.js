// @flow
/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { SlotFillProvider, Slot } from '@wordpress/components';

/**
 * Publisher dependencies
 */
import { isObject, isFunction } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../store/constants';
import {
	blockStatesAttributes,
	innerBlocksExtensionsAttributes,
	ignoreDefaultBlockAttributeKeysRegExp,
} from '../index';
import { sanitizedBlockAttributes } from './utils';
import { BlockBase, BlockPortals } from '../components';
import { isBlockTypeExtension, isEnabledExtension } from '../api/utils';

const { getBlockExtension, getBlockExtensionBy } = select(STORE_NAME);

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
		return mergeBlockSettings(settings, {
			...blockExtension,
			attributes: {
				...(sharedExtension?.attributes ?? {}),
				...blockExtension.attributes,
			},
			supports: {
				...(sharedExtension?.supports ?? {}),
				...blockExtension.supports,
			},
		});
	}

	return mergeBlockSettings(settings, sharedExtension);
}

/**
 * Preparing inner blocks.
 *
 * @param {Object} registeredInnerBlocks The register inner blocks on outside of core.
 * @param {Object} rootAttributes The block root attributes.
 * @return {{}|{default}} the merge-able object include "default" key when registered inner blocks has valid blocks, empty object when has not valid items.
 */
function prepareInnerBlockTypes(
	registeredInnerBlocks: Object,
	rootAttributes: Object
): Object {
	const values = Object.values(registeredInnerBlocks);

	if (!values.length) {
		return {};
	}

	// Extracting default prop of items and assigning to a new object
	const newRootAttributes: { [key: string]: any } = {};

	for (const key in rootAttributes) {
		if (ignoreDefaultBlockAttributeKeysRegExp().test(key)) {
			continue;
		}

		if (rootAttributes[key].default !== undefined) {
			newRootAttributes[key] = rootAttributes[key].default;

			continue;
		}

		switch (rootAttributes[key]?.type) {
			case 'string':
				newRootAttributes[key] = '';
				break;
			case 'object':
				newRootAttributes[key] = {};
				break;
			case 'array':
				newRootAttributes[key] = [];
				break;
			case 'boolean':
				newRootAttributes[key] = false;
				break;
			case 'number':
			case 'integer':
				newRootAttributes[key] = 0;
				break;
			case 'null':
				newRootAttributes[key] = null;
				break;
		}
	}

	const types = values.map((innerBlock) => ({
		...innerBlock,
		attributes: newRootAttributes,
	}));

	return { default: types };
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

	const overridedAttributes = {
		...settings.attributes,
		...additional.attributes,
		...blockStatesAttributes,
	};

	return {
		...settings,
		attributes: {
			...overridedAttributes,
			publisherInnerBlocks: {
				...innerBlocksExtensionsAttributes.publisherInnerBlocks,
				...prepareInnerBlockTypes(
					additional?.publisherInnerBlocks || {},
					overridedAttributes
				),
			},
			publisherPropsId: {
				type: 'string',
			},
		},
		supports: {
			...settings.supports,
			...additional.supports,
		},
		selectors: {
			...(settings.selectors || {}),
			...(additional.selectors || {}),
		},
		edit(props) {
			if (isFunction(additional?.edit)) {
				return (
					<>
						<SlotFillProvider>
							<BlockBase
								{...{
									...props,
									additional,
								}}
							>
								<Slot name={'publisher-core-block-before'} />

								<BlockPortals
									blockId={`#block-${props.clientId}`}
									mainSlot={'publisher-core-block-slot'}
									slots={
										// slot selectors is feature on configuration block to create custom slots for anywhere.
										// we can add slotSelectors property on block configuration to handle custom preview of block.
										additional?.slotSelectors || {}
									}
								/>

								<Slot name={'publisher-core-block-after'} />
							</BlockBase>
						</SlotFillProvider>
						{settings.edit(props)}
					</>
				);
			}

			return settings.edit(props);
		},
		save(props) {
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
				migrate(attributes: Object) {
					return additional.migrate(attributes);
				},
				edit(blockProps: Object) {
					return settings.edit(blockProps);
				},
				save(blockProps: Object) {
					return settings.save(blockProps);
				},
			},
			...(settings?.deprecated || []),
		].filter(isObject),
		publisherEditorProps: {
			...(settings.publisherEditorProps || {}),
			...additional.editorProps,
		},
		publisherSaveProps: {
			...(settings.publisherSaveProps || {}),
			...additional.saveProps,
		},
		publisherCssGenerators: {
			...additional.cssGenerators,
			...(settings?.publisherCssGenerators || {}),
		},
	};
}
