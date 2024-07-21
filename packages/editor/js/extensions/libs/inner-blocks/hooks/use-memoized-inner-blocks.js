// @flow

/**
 * Blockera dependencies
 */
import { select } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type {
	InnerBlocks,
	InnerBlockType,
	InnerBlockModel,
	MemoizedInnerBlocks,
} from '../types';

export const useMemoizedInnerBlocks = ({
	clientId,
	controlValue,
	getBlockInners,
	reservedInnerBlocks,
	setBlockClientInners,
}: MemoizedInnerBlocks): InnerBlocks => {
	// External selectors. to access registered block types on WordPress blocks store api.
	const { getBlockType } = select('core/blocks');

	return useMemo(() => {
		const stack: { [key: InnerBlockType]: InnerBlockModel } = {};

		// $FlowFixMe
		for (const name: InnerBlockType in controlValue) {
			const registeredBlockType = getBlockType(name);

			if (registeredBlockType) {
				stack[name] = mergeObject(
					{
						...registeredBlockType,
						label:
							registeredBlockType?.title ||
							reservedInnerBlocks[name]?.label ||
							'',
						icon: registeredBlockType?.icon?.src ||
							reservedInnerBlocks[name]?.icon || <></>,
					},
					controlValue[name]
				);

				continue;
			}

			stack[name] = mergeObject(
				reservedInnerBlocks[name],
				controlValue[name]
			);
		}

		// Previous inner blocks stack.
		const inners = getBlockInners(clientId);

		setBlockClientInners({
			clientId,
			inners: mergeObject(inners, stack),
		});

		return stack;
		// eslint-disable-next-line
	}, [controlValue, reservedInnerBlocks]);
};
