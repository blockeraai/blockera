/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Publisher dependencies
 */
import { mergeObject } from '@publisher/utils';

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
		'publisherCore.blockEdit.attributes',
		'publisherCore.blockEdit.socialLinksBlock.bootstrap',
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
				!attributes?.publisherInnerBlocks?.item_icons?.attributes
					?.publisherFontColor
			) {
				const newAttributes = normalIconColorFromWPCompatibility({
					attributes,
				});

				if (newAttributes) {
					attributes = mergeObject(attributes, newAttributes);
				}
			}

			if (
				!attributes?.publisherInnerBlocks?.item_containers?.attributes
					?.publisherBackgroundColor
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
		'publisherCore.blockEdit.setAttributes',
		'publisherCore.blockEdit.socialLinksBlock.bootstrap.setAttributes',
		/**
		 * Retrieve block attributes with WordPress compatibilities.
		 *
		 * @callback getAttributes
		 *
		 * @param {Object} nextState The block attributes changed with publisher feature newValue and latest version of block state.
		 * @param {string} featureId The publisher feature identifier.
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
				featureId === 'publisherFontColor'
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
				featureId === 'publisherBackgroundColor'
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
