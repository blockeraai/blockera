// @flow

/**
 * Blockera dependencies
 */
import { select } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { isEquals, mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type {
	InnerBlocks,
	InnerBlockType,
	InnerBlockModel,
	MemoizedInnerBlocks,
} from '../types';
import { getSortedObject } from '@blockera/utils/js/object';

export const useMemoizedInnerBlocks = ({
	clientId,
	controlValue,
	getBlockInners,
	getBlockExtensionBy,
	reservedInnerBlocks,
	setBlockClientInners,
	insideBlockInspector = true,
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
		let fallbackInners = {};

		// If not running inside block inspector we should create fallback inner blocks object.
		if (!Object.keys(inners).length && !insideBlockInspector) {
			fallbackInners = getBlockExtensionBy(
				'targetBlock',
				clientId.replace('core-', 'core/')
			)?.blockeraInnerBlocks;
		}

		let mergedStackWithStoreInners = mergeObject(inners, stack);

		if (!isEquals(inners, mergedStackWithStoreInners)) {
			setBlockClientInners({
				clientId,
				inners: getSortedObject(
					mergedStackWithStoreInners,
					'settings',
					10
				),
			});
		}

		// If not running inside block inspector we should provided fallback inner blocks,
		// because in this case not available selected block and client id.
		if (
			!insideBlockInspector &&
			!Object.keys(inners).length &&
			!Object.keys(mergedStackWithStoreInners).length
		) {
			mergedStackWithStoreInners = mergeObject(fallbackInners, stack);
		}

		return mergedStackWithStoreInners;
		// eslint-disable-next-line
	}, [controlValue, reservedInnerBlocks]);
};
