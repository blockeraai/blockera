// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';

/**
 * Internal dependencies
 */
import { prepareInnerBlockTypes } from '../../libs/inner-blocks';
import { useStoreSelectors } from '../use-store-selectors';
import type { InnerBlocksInfoProps, InnerBlocksInfo } from './types';
import type {
	InnerBlocks,
	InnerBlockType,
	InnerBlockModel,
} from '../../libs/inner-blocks/types';
import { isInnerBlock } from '../../components';

export const useInnerBlocksInfo = ({
	name,
	additional,
	attributes,
	currentBlock,
	currentState,
	currentBreakpoint,
}: InnerBlocksInfoProps): InnerBlocksInfo => {
	const {
		blocks: { getBlockType },
	} = useStoreSelectors();

	const publisherInnerBlocks: InnerBlocks = prepareInnerBlockTypes(
		additional?.publisherInnerBlocks || {},
		getBlockType(name)?.attributes || {}
	);

	let savedInnerBlocks: InnerBlocks = attributes.publisherInnerBlocks;

	if (!Object.values(savedInnerBlocks).length) {
		if (isInnerBlock(currentBlock)) {
			if (
				!Object.keys(
					(
						attributes.publisherBlockStates[currentState]
							.breakpoints[currentBreakpoint] || {}
					)?.attributes || {}
				).length
			) {
				savedInnerBlocks = publisherInnerBlocks;
			} else {
				savedInnerBlocks =
					attributes.publisherBlockStates[currentState].breakpoints[
						currentBreakpoint
					].attributes.publisherInnerBlocks;
			}
		} else {
			savedInnerBlocks = publisherInnerBlocks;
		}
	}

	/**
	 * Get current selected inner block.
	 *
	 * @return {InnerBlockModel|null} The selected current inner block on selected one of types ,Not selected is null.
	 */
	const getCurrentInnerBlock = (): InnerBlockModel | null => {
		return savedInnerBlocks && savedInnerBlocks[currentBlock]
			? savedInnerBlocks[currentBlock]
			: null;
	};

	const memoizedOverridingInnerBlocks = memoize(
		(innerBlocks: InnerBlocks): InnerBlocks => {
			Object.keys(innerBlocks).forEach(
				(innerBlock: InnerBlockType | string): InnerBlockModel => {
					return {
						...innerBlock,
						...(additional.publisherInnerBlocks[innerBlock] ?? {}),
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
		publisherInnerBlocks:
			memoizedOverridingInnerBlocks(publisherInnerBlocks),
	};
};
