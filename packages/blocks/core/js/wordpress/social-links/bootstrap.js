/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	normalIconColorFromWPCompatibility,
	normalIconColorToWPCompatibility,
} from './compatibility/icon-color';
import {
	normalIconBackgroundColorFromWPCompatibility,
	normalIconBackgroundColorToWPCompatibility,
} from './compatibility/icon-background-color';

export const bootstrapSocialLinksCoreBlock = (): void => {
	addFilter(
		'blockeraCore.blockEdit.attributes',
		'blockeraCore.blockEdit.socialLinksBlock.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			const {
				blockId,
				isNormalState,
				isMasterBlock,
				blockAttributes,
				isBaseBreakpoint,
			} = blockDetail;

			if (
				blockId !== 'core/social-links' ||
				!isNormalState ||
				!isBaseBreakpoint ||
				!isMasterBlock
			) {
				return attributes;
			}

			if (
				!attributes?.blockeraInnerBlocks?.item_icons?.attributes
					?.blockeraFontColor
			) {
				const newAttributes = normalIconColorFromWPCompatibility({
					attributes,
				});

				if (newAttributes) {
					attributes = mergeObject(attributes, newAttributes);
				}
			}

			if (
				!attributes?.blockeraInnerBlocks?.item_containers?.attributes
					?.blockeraBackgroundColor
			) {
				const newAttributes =
					normalIconBackgroundColorFromWPCompatibility({
						attributes,
					});

				if (newAttributes) {
					attributes = mergeObject(attributes, newAttributes);
				}
			}

			return attributes;
		}
	);

	addFilter(
		'blockeraCore.blockEdit.setAttributes',
		'blockeraCore.blockEdit.socialLinksBlock.bootstrap.setAttributes',
		/**
		 * Retrieve block attributes with WordPress compatibilities.
		 *
		 * @callback getAttributes
		 *
		 * @param {Object} nextState The block attributes changed with blockera feature newValue and latest version of block state.
		 * @param {string} featureId The blockera feature identifier.
		 * @param {*} newValue The newValue sets to feature.
		 * @param {ControlContextRef} ref The reference of control context action occurred.
		 * @param {getAttributes} getAttributes The getter block attributes.
		 * @param {blockDetail} blockDetail detail of current block
		 *
		 * @return {Object|{}} The retrieve updated block attributes with all of wp compatibilities.
		 */
		(
			nextState: Object,
			featureId: string,
			newValue: any,
			ref: ControlContextRef,
			getAttributes: () => Object,
			blockDetail: BlockDetail
		): Object => {
			const {
				isBaseBreakpoint,
				isMasterBlock,
				currentState,
				currentBlock,
				innerBlocks,
			} = blockDetail;

			if (!isBaseBreakpoint || isMasterBlock) {
				return nextState;
			}

			//
			// icon font color
			//
			if (
				currentBlock === 'item_icons' &&
				currentState === 'normal' &&
				featureId === 'blockeraFontColor'
			) {
				return mergeObject(
					nextState,
					normalIconColorToWPCompatibility({
						element: currentBlock,
						newValue,
						ref,
					})
				);
			}

			//
			// container background color
			//
			if (
				currentBlock === 'item_containers' &&
				currentState === 'normal' &&
				featureId === 'blockeraBackgroundColor'
			) {
				return mergeObject(
					nextState,
					normalIconBackgroundColorToWPCompatibility({
						element: currentBlock,
						newValue,
						ref,
					})
				);
			}

			return nextState;
		}
	);
};
