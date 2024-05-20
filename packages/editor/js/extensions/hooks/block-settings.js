// @flow
/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import type { MixedElement } from 'react';
import { useEffect } from '@wordpress/element';
import { SlotFillProvider, Slot } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { BaseControlContext } from '@blockera/controls';
import { isObject, isFunction, mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	blockStatesAttributes,
	innerBlocksExtensionsAttributes,
} from '../index';
import {
	EditorFeatureWrapper,
	EditorAdvancedLabelControl,
} from '../../components';
import { STORE_NAME } from '../store/constants';
import { useStoreSelectors } from '../../hooks';
import { sanitizedBlockAttributes } from './utils';
import { BlockBase, BlockPortals } from '../components';
import { isBlockTypeExtension, isEnabledExtension } from '../api/utils';

const EdiBlockWithoutExtensions = ({
	settings,
	...props
}: Object): MixedElement => {
	const {
		blockEditor: { getSelectedBlock },
	} = useStoreSelectors();
	const selectedBlock = getSelectedBlock();

	useEffect(() => {
		const blockCard = document.querySelector('.block-editor-block-card');

		if (blockCard) {
			blockCard.style.display = 'flex';
		}

		const blockVariations = document.querySelector(
			'.block-editor-block-inspector > .block-editor-block-variation-transforms'
		);

		if (blockVariations) {
			blockVariations.style.display = 'block';
		}

		const tabs = document.querySelector(
			'.block-editor-block-inspector .block-editor-block-inspector__tabs'
		);

		if (tabs) {
			tabs.style.display = 'block';
		}
	}, [selectedBlock]);

	return settings.edit(props);
};

/**
 * Filters registered WordPress block type settings, extending block settings with settings and block name.
 *
 * @param {Object} settings Original block settings.
 * @param {string} name block id or name.
 * @param {Array<string>} unsupportedBlocks the list of disabled blocks on blockera block-manager panel.
 * @return {Object} Filtered block settings.
 */
export default function withBlockSettings(
	settings: Object,
	name: Object,
	unsupportedBlocks: Array<string> = []
): Object {
	const {
		// getBlockExtension,
		getBlockExtensionBy,
	} = select(STORE_NAME) || {};

	// const sharedExtension = getBlockExtension('Shared');
	const blockExtension = getBlockExtensionBy('targetBlock', name);

	if (
		blockExtension &&
		isBlockTypeExtension(blockExtension) &&
		!unsupportedBlocks.includes(name)
	) {
		// mergeObject(sharedExtension, blockExtension)
		return mergeBlockSettings(settings, blockExtension);
	}

	// return mergeBlockSettings(settings, sharedExtension);

	return {
		...settings,
		edit: (props) => (
			<EdiBlockWithoutExtensions {...{ ...props, settings }} />
		),
	};
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
				const baseContextValue = {
					components: {
						EditorFeatureWrapper,
						EditorAdvancedLabelControl,
					},
				};

				return (
					<BaseControlContext.Provider value={baseContextValue}>
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
					</BaseControlContext.Provider>
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
