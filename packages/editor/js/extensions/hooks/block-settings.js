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
import { BlockBase, BlockPortals, BlockIcon } from '../components';
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

type extraArguments = {
	currentUser: Object,
	notAllowedUsers: Array<string>,
	unsupportedBlocks: Array<string>,
};

/**
 * Filters registered WordPress block type settings, extending block settings with settings and block name.
 *
 * @param {Object} settings Original block settings.
 * @param {string} name block id or name.
 * @param {extraArguments} args the extra arguments includes unsupportedBlocks, notAllowedUsers, and currentUser properties.
 * @return {Object} Filtered block settings.
 */
export default function withBlockSettings(
	settings: Object,
	name: Object,
	args: extraArguments
): Object {
	if (settings.attributes.hasOwnProperty('blockeraPropsId')) {
		return settings;
	}

	const { getBlockExtensionBy } = select(STORE_NAME) || {};

	const blockExtension = getBlockExtensionBy('targetBlock', name);

	if (blockExtension && isBlockTypeExtension(blockExtension)) {
		return mergeBlockSettings(settings, blockExtension, args);
	}

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
 * @param {extraArguments} args the extra arguments includes unsupportedBlocks, notAllowedUsers, and currentUser properties.
 * @return {Object} merged settings!
 */
function mergeBlockSettings(
	settings: Object,
	additional: Object,
	{
		unsupportedBlocks = [],
		notAllowedUsers = [],
		currentUser,
	}: extraArguments
): Object {
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

	const isAvailableBlock = () =>
		!unsupportedBlocks.includes(settings.name) &&
		!notAllowedUsers.filter((role) => currentUser.roles.includes(role))
			.length;

	const getVariations = (): Array<Object> => {
		if (!isAvailableBlock()) {
			return settings?.variations;
		}

		return [
			...(settings?.variations || []),
			...(additional.variations || []),
		].map((variation: Object): Object => {
			if (!variation?.icon) {
				return {
					...variation,
					icon: (
						<BlockIcon
							defaultIcon={settings.icon}
							name={settings.name}
						/>
					),
				};
			}

			return {
				...variation,
				icon: (
					<BlockIcon
						defaultIcon={variation.icon}
						name={settings.name}
					/>
				),
			};
		});
	};

	return {
		...settings,
		attributes: defaultAttributes,
		supports: mergeObject(settings.supports, additional.supports),
		selectors: mergeObject(settings.selectors, additional.selectors),
		transforms: {
			...(settings?.transforms || {}),
			...(additional?.transforms || {}),
		},
		variations: getVariations(),
		edit(props: Object): MixedElement {
			if (isFunction(additional?.edit) && isAvailableBlock()) {
				const baseContextValue = {
					components: {
						FeaturesWrapper: EditorFeatureWrapper,
						AdvancedLabelControl: EditorAdvancedLabelControl,
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
			if (!isAvailableBlock()) {
				return settings?.save(props);
			}

			props = {
				...props,
				attributes: sanitizedBlockAttributes(props.attributes),
			};

			return settings.save(props);
		},
		deprecated: !isAvailableBlock()
			? settings?.deprecated
			: [
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
		icon: !isAvailableBlock() ? (
			settings?.icon
		) : (
			<BlockIcon defaultIcon={settings.icon} name={settings.name} />
		),
	};
}
