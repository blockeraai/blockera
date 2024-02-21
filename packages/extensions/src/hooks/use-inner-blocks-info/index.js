// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';
import { select } from '@wordpress/data';

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

	console.log(
		'useInnerBlocksInfo → additional',
		additional?.publisherInnerBlocks?.default
	);

	const publisherInnerBlocks: InnerBlocks = prepareInnerBlockTypes(
		additional?.publisherInnerBlocks || {},
		getBlockType(name)?.attributes || {}
	);

	let savedInnerBlocks: InnerBlocks = attributes.publisherInnerBlocks;

	if (!Object.values(savedInnerBlocks).length) {
		savedInnerBlocks = publisherInnerBlocks;
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
