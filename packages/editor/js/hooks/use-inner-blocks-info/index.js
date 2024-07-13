// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';

/**
 * Blockera dependencies
 */
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
		if (isInnerBlock(currentBlock)) {
			const blockRootAttributes =
				prepare(
					`blockeraInnerBlocks[${currentBlock}].attributes`,
					attributes
				) ||
				blockeraInnerBlocks[currentBlock]?.attributes ||
				{};

			if (
				!isNormalStateOnBaseBreakpoint(currentState, currentBreakpoint)
			) {
				if (
					!isNormalStateOnBaseBreakpoint(
						currentInnerBlockState,
						currentBreakpoint
					)
				) {
					return {
						...blockRootAttributes,
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

				return {
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
