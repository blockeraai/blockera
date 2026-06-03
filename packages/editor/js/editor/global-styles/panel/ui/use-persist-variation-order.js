// @flow

/**
 * External dependencies
 */
import { useEntityProp } from '@wordpress/core-data';
import { select, useDispatch } from '@wordpress/data';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	buildVariationOrderFromRows,
	mergeVariationOrderIntoMetaData,
} from '../variation-order';
import {
	getBlockeraGlobalStylesMetaData,
	setBlockeraGlobalStylesMetaData,
} from '../../helpers';

export function usePersistVariationOrder(
	blockName: string,
	variationSurface: string
): (rows: Array<Object>) => void {
	const { setBlockeraGlobalStylesMetaData: setMetaInStore } =
		useDispatch('blockera/editor');
	const postId = select('core').__experimentalGetCurrentGlobalStylesId();
	const [globalStyles, setGlobalStyles] = useEntityProp(
		'root',
		'globalStyles',
		'styles',
		postId
	);

	return useCallback(
		(rows: Array<Object>) => {
			const slugOrder = buildVariationOrderFromRows(rows);
			const currentMeta = getBlockeraGlobalStylesMetaData();
			const updatedMeta = mergeVariationOrderIntoMetaData(
				currentMeta,
				blockName,
				variationSurface,
				slugOrder
			);

			setBlockeraGlobalStylesMetaData(updatedMeta);
			setMetaInStore(updatedMeta);
			setGlobalStyles({
				...(globalStyles || {}),
				blockeraMetaData: updatedMeta,
			});
		},
		[
			blockName,
			variationSurface,
			globalStyles,
			setGlobalStyles,
			setMetaInStore,
		]
	);
}
