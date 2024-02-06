// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	prepareInnerBlockTypes,
	getInnerBlockId,
} from '../../libs/inner-blocks';
import { useStoreSelectors } from '../use-store-selectors';
import type { InnerBlocksInfoProps, InnerBlocksInfo } from './types';
import type { InnerBlockModel } from '../../libs/inner-blocks/types';

export const useInnerBlocksInfo = ({
	name,
	additional,
	attributes,
}: InnerBlocksInfoProps): InnerBlocksInfo => {
	const {
		blocks: { getBlockType },
	} = useStoreSelectors();
	const { getExtensionCurrentBlock } = select('publisher-core/extensions');
	const currentBlock = getExtensionCurrentBlock();

	const publisherInnerBlocks = !attributes.publisherInnerBlocks.length
		? prepareInnerBlockTypes(
				additional?.publisherInnerBlocks || [],
				getBlockType(name)?.attributes || {}
		  )
		: attributes.publisherInnerBlocks;

	let savedInnerBlocks = attributes.publisherInnerBlocks;

	if (!savedInnerBlocks.length) {
		savedInnerBlocks = publisherInnerBlocks;
	}

	// Get chosen inner block type identifier but when not selected anything value will be "-1".
	const innerBlockId = getInnerBlockId(savedInnerBlocks, currentBlock);

	// Get chosen inner block type identifier of between other inner blocks but when not selected anything value will be "NULL".
	const currentInnerBlock: Object =
		savedInnerBlocks && savedInnerBlocks[innerBlockId]
			? savedInnerBlocks[innerBlockId]
			: attributes.publisherInnerBlocks;

	const memoizedOverridingInnerBlocks = memoize(
		(innerBlocks: Array<InnerBlockModel>): Array<InnerBlockModel> =>
			innerBlocks.map(
				(
					innerBlock: InnerBlockModel,
					index: number
				): InnerBlockModel => {
					return {
						...innerBlock,
						...additional.publisherInnerBlocks[index],
						attributes: innerBlock.attributes,
					};
				}
			)
	);

	return {
		innerBlockId,
		currentInnerBlock,
		publisherInnerBlocks:
			memoizedOverridingInnerBlocks(publisherInnerBlocks),
	};
};
