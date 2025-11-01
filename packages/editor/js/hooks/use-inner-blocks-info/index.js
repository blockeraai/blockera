// @flow

/**
 * External dependencies
 */
import { useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';
import { prepare } from '@blockera/data-editor';

/**
 * Internal dependencies
 */
import { prepareInnerBlockTypes } from '../../extensions/libs/block-card/inner-blocks';
import type { InnerBlocksInfoProps, InnerBlocksInfo } from './types';
import type {
	InnerBlocks,
	InnerBlockType,
	InnerBlockModel,
} from '../../extensions/libs/block-card/inner-blocks/types';
import { getBaseBreakpoint } from '../../canvas-editor';
import { isInnerBlock } from '../../extensions/components';
import { isNormalStateOnBaseBreakpoint } from '../../extensions/libs/block-card/block-states/helpers';

export const useInnerBlocksInfo = ({
	additional,
	attributes,
	currentBlock,
	currentState,
	defaultAttributes,
	currentBreakpoint,
	currentInnerBlockState,
}: InnerBlocksInfoProps): InnerBlocksInfo => {
	return useMemo(() => {
		const blockeraInnerBlocks: InnerBlocks = prepareInnerBlockTypes(
			additional?.blockeraInnerBlocks || {},
			defaultAttributes
		);

		/**
		 * Get sanitized current block name.
		 *
		 * @return {string} the sanitized block name.
		 */
		const getSanitizedBlockName = () => currentBlock.replace(/-\d+/g, '');

		/**
		 * Get current selected inner block.
		 *
		 * @return {InnerBlockModel|null} The selected current inner block on selected one of types ,Not selected is null.
		 */
		const getCurrentInnerBlock = (): InnerBlockModel | null => {
			if (isInnerBlock(currentBlock)) {
				let inheritOfCoreBlock =
					prepare(
						`blockeraInnerBlocks[${getSanitizedBlockName()}].attributes`,
						attributes
					) || {};

				const blockRootAttributes = mergeObject(
					// Specific the inheritance attributes values from main object of core block.
					inheritOfCoreBlock,
					prepare(
						`blockeraInnerBlocks[${currentBlock}].attributes`,
						attributes
					) ||
						blockeraInnerBlocks[currentBlock]?.attributes ||
						{}
				);

				if (
					!isNormalStateOnBaseBreakpoint(
						currentState,
						currentBreakpoint
					)
				) {
					if (
						!isNormalStateOnBaseBreakpoint(
							currentInnerBlockState,
							currentBreakpoint
						)
					) {
						const inheritOfCoreBlockAttributesOnDesktop =
							prepare(
								`blockeraBlockStates[${currentState}].breakpoints[${getBaseBreakpoint()}]attributes.blockeraInnerBlocks[${getSanitizedBlockName()}].attributes`,
								attributes
							) || {};
						const inheritOfCoreBlockAttributesOnCurrentBreakpoint =
							prepare(
								`blockeraBlockStates[${currentState}].breakpoints[${currentBreakpoint}].attributes.blockeraInnerBlocks[${getSanitizedBlockName()}].attributes`,
								attributes
							) || {};
						const inheritOfCoreBlockAttributesOnCurrentStateOfBreakpoint =
							prepare(
								`blockeraBlockStates[${currentState}].breakpoints[${currentBreakpoint}].attributes.blockeraInnerBlocks[${getSanitizedBlockName()}].attributes.blockeraBlockStates[${currentInnerBlockState}].breakpoints[${currentBreakpoint}].attributes`,
								attributes
							) || {};

						return {
							...blockRootAttributes,
							// Specific the inheritance attributes values from main object of core block on base breakpoint pseudo states.
							...inheritOfCoreBlockAttributesOnDesktop,
							// Specific the inheritance attributes values from main object of core block on current breakpoint pseudo states.
							...inheritOfCoreBlockAttributesOnCurrentBreakpoint,
							// Specific the inheritance attributes values from main object of core block on current states of current breakpoint pseudo states.
							...inheritOfCoreBlockAttributesOnCurrentStateOfBreakpoint,
							...(prepare(
								`blockeraBlockStates[${currentState}].breakpoints[${getBaseBreakpoint()}].attributes.blockeraInnerBlocks[${currentBlock}].attributes`,
								attributes
							) || {}),
							...(prepare(
								`blockeraBlockStates[${currentState}].breakpoints[${currentBreakpoint}].attributes.blockeraInnerBlocks[${currentBlock}].attributes`,
								attributes
							) || {}),
							...(prepare(
								`blockeraBlockStates[${currentState}].breakpoints[${currentBreakpoint}].attributes.blockeraInnerBlocks[${currentBlock}].attributes.blockeraBlockStates[${currentInnerBlockState}].breakpoints[${currentBreakpoint}].attributes`,
								attributes
							) || {}),
						};
					}

					inheritOfCoreBlock =
						prepare(
							`blockeraBlockStates[${currentState}].breakpoints[${currentBreakpoint}].attributes.blockeraInnerBlocks[${getSanitizedBlockName()}].attributes`,
							attributes
						) || {};

					return {
						// Specific the inheritance attributes values from main object of core block.
						...inheritOfCoreBlock,
						...blockRootAttributes,
						...(prepare(
							`blockeraBlockStates[${currentState}].breakpoints[${currentBreakpoint}].attributes.blockeraInnerBlocks[${currentBlock}].attributes`,
							attributes
						) || {}),
					};
				}

				if (
					!isNormalStateOnBaseBreakpoint(
						currentInnerBlockState,
						currentBreakpoint
					)
				) {
					return {
						...blockRootAttributes,
						...(prepare(
							`blockeraBlockStates[${currentInnerBlockState}].breakpoints[${currentBreakpoint}].attributes`,
							blockRootAttributes
						) || {}),
					};
				}

				return blockRootAttributes;
			}

			return null;
		};

		const getBlockeraInnerBlocks = (
			innerBlocks: InnerBlocks
		): InnerBlocks => {
			Object.keys(innerBlocks).forEach(
				(innerBlock: InnerBlockType | string): InnerBlockModel => {
					return {
						...innerBlock,
						...(additional.blockeraInnerBlocks[innerBlock] ?? {}),
						attributes: {
							...attributes,
							...innerBlocks[innerBlock].attributes,
						},
					};
				}
			);

			return innerBlocks;
		};

		return {
			currentInnerBlock: getCurrentInnerBlock(),
			blockeraInnerBlocks: getBlockeraInnerBlocks(blockeraInnerBlocks),
		};
	}, [
		additional,
		attributes,
		currentBlock,
		currentState,
		currentBreakpoint,
		defaultAttributes,
		currentInnerBlockState,
	]);
};
