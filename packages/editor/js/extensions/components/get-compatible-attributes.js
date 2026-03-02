// @flow

/**
 * External dependencies
 */
import { applyFilters } from '@wordpress/hooks';
import { getBlockType } from '@wordpress/blocks';

/**
 * Blockera dependencies
 */
import { detailedDiff } from 'deep-object-diff';
import { isEquals, omitWithPattern, mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	ignoreBlockeraAttributeKeysRegExp,
	ignoreDefaultBlockAttributeKeysRegExp,
} from '../libs';
import { prepareBlockeraDefaultAttributesValues } from './utils';

export const getCompatibleAttributes = ({
	args,
	isActive,
	attributes,
	defaultAttributes,
	availableAttributes,
}: {
	args: Object,
	isActive: boolean,
	attributes: Object,
	defaultAttributes: Object,
	availableAttributes: Object,
}): Object => {
	/**
	 * Filtering block attributes based on "blockeraCompatId" attribute value to running WordPress compatibilities.
	 * Create mutable constant to prevent directly change to immutable state constant.
	 *
	 * hook: 'blockera.blockEdit.compatibility.attributes'
	 *
	 * @since 1.0.0
	 */
	let filteredAttributes = applyFilters(
		'blockera.blockEdit.attributes',
		// Migrate to blockera attributes for some blocks where includes attributes migrations in original core Block Edit component,
		// if we supported them.
		'undefined' === typeof attributes?.blockeraPropsId &&
			availableAttributes?.blockeraPropsId
			? mergeObject(
					{ ...attributes },
					prepareBlockeraDefaultAttributesValues(defaultAttributes)
				)
			: { ...attributes },
		args
	);

	// Run filtering when current block is global style for block type,
	// and it is contains `blocks` property from theme or core settings.
	// We should run all `from wp compatibilities` for each blocks provided by external sources.
	if (
		filteredAttributes.hasOwnProperty('blocks') &&
		Object.keys(filteredAttributes?.blocks || {}).length
	) {
		for (const blockType in filteredAttributes.blocks) {
			const blockTypeObj = getBlockType(blockType);

			if (!blockType) {
				continue;
			}

			const currentBlockAttributes = filteredAttributes.blocks[blockType];

			const { blocks, blockeraInnerBlocks, ...latestFilteredAttributes } =
				applyFilters(
					'blockera.blockEdit.attributes',
					// Migrate to blockera attributes for some blocks where includes attributes migrations in original core Block Edit component,
					// if we supported them.
					'undefined' ===
						typeof currentBlockAttributes?.blockeraPropsId &&
						blockTypeObj.attributes?.blockeraPropsId
						? mergeObject(
								{ ...currentBlockAttributes },
								prepareBlockeraDefaultAttributesValues(
									blockTypeObj.attributes
								)
							)
						: { ...currentBlockAttributes },
					args
				);

			if (Object.keys(blockeraInnerBlocks).length) {
				filteredAttributes = mergeObject(filteredAttributes, {
					blockeraInnerBlocks: {
						value: {
							[blockType]: {
								attributes: {
									...Object.fromEntries(
										Object.entries(latestFilteredAttributes)
											.filter(([, val]) =>
												val.hasOwnProperty('value')
											)
											.map(([index, val]) => {
												return [index, val?.value];
											})
									),
									blockeraInnerBlocks,
								},
							},
						},
					},
				});
			}

			filteredAttributes = mergeObject(filteredAttributes, {
				blocks: {
					[blockType]: omitWithPattern(
						latestFilteredAttributes,
						ignoreBlockeraAttributeKeysRegExp()
					),
				},
			});
		}
	}

	const hasPropsId = attributes?.blockeraPropsId;
	const hasCompatId = attributes?.blockeraCompatId;

	// Assume disabled blockera panel, so filtering attributes to clean up all blockera attributes.
	if (!isActive && hasCompatId && hasPropsId) {
		filteredAttributes = {
			...attributes,
			...omitWithPattern(
				prepareBlockeraDefaultAttributesValues(defaultAttributes),
				ignoreDefaultBlockAttributeKeysRegExp()
			),
		};
	}

	// Prevent redundant set state!
	if (isEquals(attributes, filteredAttributes)) {
		return attributes;
	}

	const filteredAttributesWithoutIds = {
		...filteredAttributes,
		blockeraPropsId: '',
		blockeraCompatId: '',
		...(attributes.hasOwnProperty('className')
			? { className: attributes?.className || '' }
			: {}),
	};

	const { added, updated } = detailedDiff(
		filteredAttributesWithoutIds,
		prepareBlockeraDefaultAttributesValues(defaultAttributes)
	);

	// Our Goal is cleanup blockera attributes of core blocks when not changed anything!
	if (
		!Object.keys(added).length &&
		!Object.keys(updated).length &&
		isEquals(attributes, filteredAttributesWithoutIds)
	) {
		return attributes;
	}

	return filteredAttributes;
};
