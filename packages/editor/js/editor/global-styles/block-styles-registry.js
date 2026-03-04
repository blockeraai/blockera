// @flow

/**
 * External dependencies
 */
import { select, dispatch } from '@wordpress/data';
import {
	getBlockTypes,
	registerBlockStyle,
	unregisterBlockStyle,
} from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { getBlockeraGlobalStylesMetaData } from './helpers';

/**
 * Handles registration and deregistration of block styles based on
 * blockeraGlobalStylesMetaData. This module centralizes all operations
 * related to block style variations management.
 *
 */
export const registerBlockStylesFromMetaData = (): void => {
	const blockeraGlobalStylesMetaData = getBlockeraGlobalStylesMetaData();

	// Safety guard: ensure metadata exists
	if (
		!blockeraGlobalStylesMetaData ||
		!Object.keys(blockeraGlobalStylesMetaData).length
	) {
		return;
	}

	// Get dispatch function for updating style variation blocks in store
	const { setStyleVariationBlocks, deleteStyleVariationBlocks } =
		dispatch('blockera/editor');

	// Get all registered block types from wp store api.
	const blockTypes = getBlockTypes();

	// Reregister block styles where renamed by identifier or deleted
	const blocks = blockeraGlobalStylesMetaData.blocks || {};
	Object.entries(blocks).forEach(([blockName, blockData]) => {
		// Safety guard: ensure blockData exists
		if (!blockData || !Object.keys(blockData).length) {
			return;
		}

		const variations = blockData.variations || {};
		Object.entries(variations).forEach(([variationName, variation]) => {
			// Safety guard: ensure variation exists
			if (!variation) {
				return;
			}

			// Handle renamed variations (hasNewID indicates identifier change)
			if (variation.hasNewID) {
				unregisterBlockStyle(blockName, variationName);
				registerBlockStyle(blockName, variation);

				return;
			}

			// Handle isDeleted variations
			if (variation.isDeleted) {
				unregisterBlockStyle(blockName, variationName);
			}
		});
	});

	// Register block styles for saved block types
	const variations = blockeraGlobalStylesMetaData.variations || {};
	// Cache select function to avoid repeated lookups
	const { getBlockStyles } = select('core/blocks');

	Object.entries(variations).forEach(([variationName, variation]) => {
		// Safety guard: ensure variation exists and has enabledIn array
		if (!variation || !Object.keys(variation).length) {
			return;
		}

		// Exclude disabledIn from registration payload once per variation
		const { disabledIn = [], enabledIn = [], ...rest } = variation;

		// Register style for each enabled block type
		enabledIn.forEach((blockType) => {
			registerBlockStyle(blockType, rest);
		});

		// Find WordPress blocks that should have this style variation enabled
		const wpEnabledBlocks = blockTypes
			.map((blockType) => {
				// Safety guard: ensure blockType exists
				if (!blockType || !Object.keys(blockType).length) {
					return null;
				}

				// Skip blocks without blockeraPropsId attribute
				if (
					!blockType?.attributes?.hasOwnProperty('blockeraPropsId') ||
					disabledIn?.includes(blockType.name) ||
					!enabledIn?.includes(blockType.name)
				) {
					return null;
				}

				// Check if style is already registered for this block type
				// Use cached select function instead of calling select() repeatedly
				const blockStyles = getBlockStyles(blockType.name) || [];

				if (
					blockStyles.some((style) => style.name === variation.name)
				) {
					return blockType.name;
				}

				return null;
			})
			.filter(Boolean);

		// Register style variation blocks in global store
		// Combine enabledIn and wpEnabledBlocks, removing duplicates
		setStyleVariationBlocks(variation.name, [
			...new Set([...variation.enabledIn, ...wpEnabledBlocks]),
		]);

		if (disabledIn.length) {
			setTimeout(() => {
				deleteStyleVariationBlocks(
					variationName,
					false,
					'',
					disabledIn
				);
			}, 5);
		}

		// Unregister from disabled block types
		disabledIn.forEach((blockType) => {
			// Update WordPress store
			unregisterBlockStyle(blockType, variationName);
		});
	});
};
