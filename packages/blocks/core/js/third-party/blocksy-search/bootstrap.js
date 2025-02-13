// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { getBaseBreakpoint } from '@blockera/editor';
import { mergeObject } from '@blockera/utils';
import { isBorderEmpty, type ControlContextRef } from '@blockera/controls';
import type { BlockDetail } from '@blockera/editor/js/extensions/libs/block-states/types';

/**
 * Internal dependencies
 */
import {
	colorFromWPCompatibility,
	colorToWPCompatibility,
} from '../blocksy-shared/compatibility/color';
import {
	colorStateFromWPCompatibility,
	colorStateToWPCompatibility,
} from '../blocksy-shared/compatibility/color-state';
import {
	borderFromWPCompatibility,
	borderToWPCompatibility,
} from '../blocksy-shared/compatibility/border';
import {
	borderStateFromWPCompatibility,
	borderStateToWPCompatibility,
} from '../blocksy-shared/compatibility/border-state';
import { bgColorFromWPCompatibility } from '../blocksy-shared/compatibility/bg-color';
import { bgColorStateFromWPCompatibility } from '../blocksy-shared/compatibility/bg-color-state';

export const bootstrapBlocksySearch = (): void => {
	addFilter(
		'blockera.blockEdit.attributes',
		'blockera.blockEdit.BlocksySearch.bootstrap',
		(attributes: Object, blockDetail: BlockDetail) => {
			const { blockId } = blockDetail;

			if (blockId !== 'blocksy/search') {
				return attributes;
			}

			//
			// Input color only
			//
			if (
				!attributes?.blockeraInnerBlocks['elements/input']?.attributes
					?.blockeraFontColor
			) {
				attributes = colorFromWPCompatibility({
					attributes,
					element: 'elements/input',
					property: 'inputFontColor',
					propertyCustom: 'customInputFontColor',
					blockeraProperty: 'blockeraFontColor',
				});
			}

			//
			// Input focus color only
			//
			if (
				!attributes?.blockeraInnerBlocks['elements/input']?.attributes
					?.blockeraBlockStates?.focus?.attributes?.blockeraFontColor
			) {
				attributes = colorStateFromWPCompatibility({
					attributes,
					element: 'elements/input',
					property: 'inputFontColorFocus',
					propertyCustom: 'customInputFontColorFocus',
					blockeraProperty: 'blockeraFontColor',
					state: 'focus',
				});
			}

			//
			// Input border color only
			//
			if (
				attributes?.blockeraInnerBlocks['elements/input']?.attributes
					?.blockeraBorder === undefined ||
				isBorderEmpty(
					attributes?.blockeraInnerBlocks['elements/input']
						?.attributes?.blockeraBorder
				)
			) {
				attributes = borderFromWPCompatibility({
					attributes,
					element: 'elements/input',
					property: 'inputBorderColor',
					propertyCustom: 'customInputBorderColor',
					blockeraProperty: 'blockeraBorder',
				});
			}

			//
			// Input border focus color only
			//
			if (
				attributes?.blockeraInnerBlocks['elements/input']?.attributes
					?.blockeraBlockStates?.hover?.breakpoints[
					getBaseBreakpoint()
				]?.attributes?.blockeraBorder === undefined ||
				isBorderEmpty(
					attributes?.blockeraInnerBlocks['elements/icons']
						?.attributes?.blockeraBlockStates?.hover?.breakpoints[
						getBaseBreakpoint()
					]?.attributes?.blockeraBorder
				)
			) {
				attributes = borderStateFromWPCompatibility({
					attributes,
					element: 'elements/input',
					property: 'inputBorderColorFocus',
					propertyCustom: 'customInputBorderColorFocus',
					blockeraProperty: 'blockeraBorder',
					state: 'focus',
				});
			}

			//
			// Input BG color only
			//
			if (
				!attributes?.blockeraInnerBlocks['elements/input']?.attributes
					?.blockeraBackgroundColor?.value
			) {
				attributes = bgColorFromWPCompatibility({
					attributes,
					element: 'elements/input',
					property: 'inputBackgroundColor',
					propertyCustom: 'customInputBackgroundColor',
					blockeraProperty: 'blockeraBackgroundColor',
				});
			}

			//
			// Input BG focus color
			//
			if (
				!attributes?.blockeraInnerBlocks['elements/input']?.attributes
					?.blockeraBlockStates?.focus?.attributes
					?.blockeraBackgroundColor
			) {
				attributes = bgColorStateFromWPCompatibility({
					attributes,
					element: 'elements/input',
					property: 'inputBackgroundColorFocus',
					propertyCustom: 'customInputBackgroundColorFocus',
					blockeraProperty: 'blockeraBackgroundColor',
					state: 'focus',
				});
			}

			//
			// Button color only
			//
			if (
				!attributes?.blockeraInnerBlocks['elements/button']?.attributes
					?.blockeraFontColor
			) {
				attributes = colorFromWPCompatibility({
					attributes,
					element: 'elements/button',
					property: 'inputIconColor',
					propertyCustom: 'customInputIconColor',
					blockeraProperty: 'blockeraFontColor',
				});
			}

			//
			// Button hover color only
			//
			if (
				!attributes?.blockeraInnerBlocks['elements/button']?.attributes
					?.blockeraBlockStates?.hover?.attributes?.blockeraFontColor
			) {
				attributes = colorStateFromWPCompatibility({
					attributes,
					element: 'elements/button',
					property: 'inputIconColorFocus',
					propertyCustom: 'customInputIconColorFocus',
					blockeraProperty: 'blockeraFontColor',
					state: 'hover',
				});
			}

			//
			// Button BG color only
			//
			if (
				!attributes?.blockeraInnerBlocks['elements/button']?.attributes
					?.blockeraBackgroundColor?.value
			) {
				attributes = bgColorFromWPCompatibility({
					attributes,
					element: 'elements/button',
					property: 'buttonBackgroundColor',
					propertyCustom: 'customButtonBackgroundColor',
					blockeraProperty: 'blockeraBackgroundColor',
				});
			}

			//
			// Button BG hover color
			//
			if (
				!attributes?.blockeraInnerBlocks['elements/button']?.attributes
					?.blockeraBlockStates?.hover?.attributes
					?.blockeraBackgroundColor
			) {
				attributes = bgColorStateFromWPCompatibility({
					attributes,
					element: 'elements/button',
					property: 'buttonBackgroundColorHover',
					propertyCustom: 'customButtonBackgroundColorHover',
					blockeraProperty: 'blockeraBackgroundColor',
					state: 'hover',
				});
			}

			//
			// Result Dropdown BG color only
			//
			if (
				!attributes?.blockeraInnerBlocks['elements/result-dropdown']
					?.attributes?.blockeraBackgroundColor?.value
			) {
				attributes = bgColorFromWPCompatibility({
					attributes,
					element: 'elements/result-dropdown',
					property: 'dropdownBackgroundColor',
					propertyCustom: 'customDropdownBackgroundColor',
					blockeraProperty: 'blockeraBackgroundColor',
				});
			}

			//
			// Result Link color only
			//
			if (
				!attributes?.blockeraInnerBlocks['elements/result-link']
					?.attributes?.blockeraFontColor
			) {
				attributes = colorFromWPCompatibility({
					attributes,
					element: 'elements/result-link',
					property: 'dropdownTextInitialColor',
					propertyCustom: 'customDropdownTextInitialColor',
					blockeraProperty: 'blockeraFontColor',
				});
			}

			//
			// Result Link hover color
			//
			if (
				!attributes?.blockeraInnerBlocks['elements/result-link']
					?.attributes?.blockeraBlockStates?.hover?.attributes
					?.blockeraFontColor
			) {
				attributes = colorStateFromWPCompatibility({
					attributes,
					element: 'elements/result-link',
					property: 'dropdownTextHoverColor',
					propertyCustom: 'customDropdownTextHoverColor',
					blockeraProperty: 'blockeraFontColor',
					state: 'hover',
				});
			}

			return attributes;
		}
	);

	addFilter(
		'blockera.blockEdit.setAttributes',
		'blockera.blockEdit.BlocksySearch.bootstrap.setAttributes',
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
			const { blockId, isBaseBreakpoint, currentBlock, currentState } =
				blockDetail;

			if (blockId !== 'blocksy/search' || !isBaseBreakpoint) {
				return nextState;
			}

			//
			// Input color
			// only in elements/icons inner block
			//
			if (
				currentState === 'normal' &&
				currentBlock === 'elements/input' &&
				featureId === 'blockeraFontColor'
			) {
				return mergeObject(
					nextState,
					colorToWPCompatibility({
						newValue,
						ref,
						property: 'inputFontColor',
						propertyCustom: 'customInputFontColor',
					})
				);
			}

			//
			// input focus color
			// only in elements/input inner block
			//
			if (
				currentState === 'focus' &&
				currentBlock === 'elements/input' &&
				featureId === 'blockeraFontColor'
			) {
				return mergeObject(
					nextState,
					colorStateToWPCompatibility({
						newValue,
						ref,
						property: 'inputFontColorFocus',
						propertyCustom: 'customInputFontColorFocus',
					})
				);
			}

			//
			// Input border color
			// only in elements/input inner block
			//
			if (
				currentState === 'normal' &&
				currentBlock === 'elements/input' &&
				featureId === 'blockeraBorder'
			) {
				return mergeObject(
					nextState,
					borderToWPCompatibility({
						newValue,
						ref,
						property: 'inputBorderColor',
						propertyCustom: 'customInputBorderColor',
					})
				);
			}

			//
			// Input border focus color
			// only in elements/input inner block
			//
			if (
				currentState === 'focus' &&
				currentBlock === 'elements/input' &&
				featureId === 'blockeraBorder'
			) {
				return mergeObject(
					nextState,
					borderStateToWPCompatibility({
						newValue,
						ref,
						property: 'inputBorderColorFocus',
						propertyCustom: 'customInputBorderColorFocus',
					})
				);
			}

			//
			// Button color
			// only in elements/button inner block
			//
			if (
				currentState === 'normal' &&
				currentBlock === 'elements/button' &&
				featureId === 'blockeraFontColor'
			) {
				return mergeObject(
					nextState,
					colorToWPCompatibility({
						newValue,
						ref,
						property: 'inputIconColor',
						propertyCustom: 'customInputIconColor',
					})
				);
			}

			//
			// Button hover color
			// only in elements/button inner block
			//
			if (
				currentState === 'hover' &&
				currentBlock === 'elements/button' &&
				featureId === 'blockeraFontColor'
			) {
				return mergeObject(
					nextState,
					colorStateToWPCompatibility({
						newValue,
						ref,
						property: 'inputIconColorFocus',
						propertyCustom: 'customInputIconColorFocus',
					})
				);
			}

			//
			// Result Link color
			// only in elements/result-link inner block
			//
			if (
				currentState === 'normal' &&
				currentBlock === 'elements/result-link' &&
				featureId === 'blockeraFontColor'
			) {
				return mergeObject(
					nextState,
					colorToWPCompatibility({
						newValue,
						ref,
						property: 'dropdownTextInitialColor',
						propertyCustom: 'customDropdownTextInitialColor',
					})
				);
			}

			//
			// Result Link hover color
			// only in elements/result-link inner block
			//
			if (
				currentState === 'hover' &&
				currentBlock === 'elements/result-link' &&
				featureId === 'blockeraFontColor'
			) {
				return mergeObject(
					nextState,
					colorStateToWPCompatibility({
						newValue,
						ref,
						property: 'dropdownTextHoverColor',
						propertyCustom: 'customDropdownTextHoverColor',
					})
				);
			}

			return nextState;
		}
	);
};
