// @flow

/**
 * External dependencies
 */
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getBlockeraGlobalStylesMetaData } from '../../../helpers';
import { isBlockeraCreatedStyle } from '../use-block-style-item/helpers';

export const useBlockStylesCounter = ({
	blockName,
	baseConfig,
	userConfig,
	blockDynamicStylesCount,
}: {
	blockName: string,
	baseConfig: Object,
	userConfig: Object,
	blockDynamicStylesCount: Object,
}): Array<any> => {
	const metaData = getBlockeraGlobalStylesMetaData();
	const variations = metaData?.blocks?.[blockName]?.variations || {};
	const metaDataBlockVariationsCount = Object.values(variations).filter(
		(variation) =>
			!variation?.isDeleted &&
			isBlockeraCreatedStyle(variation, baseConfig, blockName)
	).length;

	const userVariations =
		userConfig?.styles?.blocks?.[blockName]?.variations || {};
	const userVariationsCount = Object.keys(userVariations).length;
	const baseVariations =
		baseConfig?.styles?.blocks?.[blockName]?.variations || {};
	const baseVariationsCount = Object.keys(baseVariations).length;

	let diffVariationsCount = 0;

	switch (true) {
		case 0 === userVariationsCount:
			switch (true) {
				case metaDataBlockVariationsCount > baseVariationsCount:
					diffVariationsCount =
						metaDataBlockVariationsCount - baseVariationsCount;
					break;
			}
			break;
		default:
			const userKeys = Object.keys(userVariations);
			const setBase = new Set(Object.keys(baseVariations));
			const diff = userKeys.filter((x) => !setBase.has(x));
			const hasDiff = diff.length > 0;
			if (userVariationsCount >= baseVariationsCount) {
				diffVariationsCount = userVariationsCount - baseVariationsCount;
			} else if (hasDiff) {
				diffVariationsCount = diff.length;
			} else if (metaDataBlockVariationsCount > baseVariationsCount) {
				diffVariationsCount =
					metaDataBlockVariationsCount - baseVariationsCount;
			} else {
				diffVariationsCount = 0;
			}
			break;
	}

	if (1 === diffVariationsCount) {
		++diffVariationsCount;
	} else if (0 >= diffVariationsCount) {
		diffVariationsCount = 1;
	}

	const fallbackCount =
		0 === metaDataBlockVariationsCount
			? null
			: metaDataBlockVariationsCount + 1;

	const initializedCounterValue =
		1 === diffVariationsCount
			? fallbackCount || diffVariationsCount
			: blockDynamicStylesCount?.[blockName] || diffVariationsCount;

	const [counter, setCounter] = useState(initializedCounterValue);

	useEffect(() => {
		if (counter !== initializedCounterValue) {
			setCounter(initializedCounterValue);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initializedCounterValue]);

	return [counter, setCounter];
};
