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

	const blockeraInnerBlocks: InnerBlocks = prepareInnerBlockTypes(
		additional?.blockeraInnerBlocks || {},
		getBlockType(name)?.attributes || {}
	);

	let savedInnerBlocks: InnerBlocks = attributes.blockeraInnerBlocks;

	if (!Object.values(savedInnerBlocks).length) {
		if (isInnerBlock(currentBlock)) {
			if (
				!Object.keys(
					(
						attributes.blockeraBlockStates[currentState]
							?.breakpoints[currentBreakpoint] || {}
					)?.attributes || {}
				).length
			) {
				savedInnerBlocks = blockeraInnerBlocks;
			} else {
				savedInnerBlocks =
					attributes.blockeraBlockStates[currentState].breakpoints[
						currentBreakpoint
					].attributes.blockeraInnerBlocks;
			}
		} else {
			savedInnerBlocks = blockeraInnerBlocks;
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
