// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';
import { prepare } from '@blockera/data-editor';

/**
 * Internal dependencies
 */
import { prepareInnerBlockTypes } from '../../extensions/libs/inner-blocks';
import { useStoreSelectors } from '../use-store-selectors';
import type { InnerBlocksInfoProps, InnerBlocksInfo } from './types';
import type {
	InnerBlocks,
	InnerBlockType,
	InnerBlockModel,
} from '../../extensions/libs/inner-blocks/types';
import { isInnerBlock } from '../../extensions/components';
import { isNormalStateOnBaseBreakpoint } from '../../extensions/libs/block-states/helpers';

export const useInnerBlocksInfo = ({
	name,
	additional,
	attributes,
	currentBlock,
	currentState,
	currentBreakpoint,
	currentInnerBlockState,
}: InnerBlocksInfoProps): InnerBlocksInfo => {
	const {
		blocks: { getBlockType },
	} = useStoreSelectors();

	const blockeraInnerBlocks: InnerBlocks = prepareInnerBlockTypes(
		additional?.blockeraInnerBlocks || {},
		getBlockType(name)?.attributes || {}
	);

	/**
	 * Get current selected inner block.
	 *
	 * @return {InnerBlockModel|null} The selected current inner block on selected one of types ,Not selected is null.
	 */
	const getCurrentInnerBlock = (): InnerBlockModel | null => {
		const getSanitizedBlockName = () => currentBlock.replace(/-\d+/g, '');

		let inheritOfCoreBlock =
			prepare(
				`blockeraInnerBlocks[${getSanitizedBlockName()}].attributes`,
				attributes
			) || {};

		if (isInnerBlock(currentBlock)) {
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
				!isNormalStateOnBaseBreakpoint(currentState, currentBreakpoint)
			) {
				if (
					!isNormalStateOnBaseBreakpoint(
						currentInnerBlockState,
						currentBreakpoint
					)
				) {
					const inheritOfCoreBlockAttributesOnDesktop =
						prepare(
							`blockeraBlockStates[${currentState}].breakpoints.desktop.attributes.blockeraInnerBlocks[${getSanitizedBlockName()}].attributes`,
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
						// Specific the inheritance attributes values from main object of core block on desktop pseudo states.
						...inheritOfCoreBlockAttributesOnDesktop,
						// Specific the inheritance attributes values from main object of core block on current breakpoint pseudo states.
						...inheritOfCoreBlockAttributesOnCurrentBreakpoint,
						// Specific the inheritance attributes values from main object of core block on current states of current breakpoint pseudo states.
						...inheritOfCoreBlockAttributesOnCurrentStateOfBreakpoint,
						...(prepare(
							`blockeraBlockStates[${currentState}].breakpoints.desktop.attributes.blockeraInnerBlocks[${currentBlock}].attributes`,
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

	const memoizedOverridingInnerBlocks = memoize(
		(innerBlocks: InnerBlocks): InnerBlocks => {
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
		}
	);

	return {
		currentInnerBlock: getCurrentInnerBlock(),
		blockeraInnerBlocks: memoizedOverridingInnerBlocks(blockeraInnerBlocks),
	};
};
