// @flow

/**
 * External dependencies
 */
import { useState, useEffect, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getBlockeraGlobalStylesMetaData } from '../../../helpers';
import { isBlockeraCreatedStyle } from '../use-block-style-item/helpers';
import {
	mergeBlockVariationsTrees,
	isSizeVariationEntry,
} from '../../size-variations';
import {
	VARIATION_SURFACE_SIZE,
	VARIATION_SURFACE_STYLE,
} from '../../variation-surfaces';

export const getBlockDynamicStylesCount = (
	counterMap: Object,
	blockName: string,
	variationSurface: string
): ?number => counterMap?.[blockName]?.[variationSurface];

export const setBlockDynamicStylesCount = (
	counterMap: Object,
	blockName: string,
	variationSurface: string,
	count: number
): void => {
	if (!counterMap[blockName]) {
		counterMap[blockName] = {};
	}

	counterMap[blockName][variationSurface] = count;
};

const variationMatchesSurface = (
	slug: string,
	variationData: Object,
	mergedVariations: Object,
	variationSurface: string
): boolean => {
	const merged = mergedVariations[slug] || variationData || {};
	const isSize = isSizeVariationEntry(merged);

	return variationSurface === VARIATION_SURFACE_SIZE ? isSize : !isSize;
};

const filterVariationsForSurface = (
	variations: Object,
	mergedVariations: Object,
	variationSurface: string
): Object =>
	Object.fromEntries(
		Object.entries(variations).filter(([slug, data]) =>
			variationMatchesSurface(
				slug,
				data,
				mergedVariations,
				variationSurface
			)
		)
	);

const computeDiffVariationsCount = ({
	metaDataBlockVariationsCount,
	userVariationsCount,
	baseVariationsCount,
	userVariations,
	baseVariations,
}: {
	metaDataBlockVariationsCount: number,
	userVariationsCount: number,
	baseVariationsCount: number,
	userVariations: Object,
	baseVariations: Object,
}): number => {
	let diffVariationsCount = 0;

	switch (true) {
		case 0 === userVariationsCount:
			if (metaDataBlockVariationsCount > baseVariationsCount) {
				diffVariationsCount =
					metaDataBlockVariationsCount - baseVariationsCount;
			}
			break;
		default: {
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
			}
			break;
		}
	}

	if (1 === diffVariationsCount) {
		++diffVariationsCount;
	} else if (0 >= diffVariationsCount) {
		diffVariationsCount = 1;
	}

	return diffVariationsCount;
};

export const useBlockStylesCounter = ({
	blockName,
	baseConfig,
	userConfig,
	blockDynamicStylesCount,
	variationSurface = VARIATION_SURFACE_STYLE,
}: {
	blockName: string,
	baseConfig: Object,
	userConfig: Object,
	blockDynamicStylesCount: Object,
	variationSurface?: string,
}): Array<any> => {
	const mergedVariations = useMemo(
		() => mergeBlockVariationsTrees(baseConfig, userConfig, blockName),
		[blockName, baseConfig, userConfig]
	);

	const metaData = getBlockeraGlobalStylesMetaData();
	const variations = metaData?.blocks?.[blockName]?.variations || {};
	const metaDataBlockVariationsCount = Object.entries(variations).filter(
		([slug, variation]) =>
			!variation?.isDeleted &&
			isBlockeraCreatedStyle(variation, baseConfig, blockName) &&
			variationMatchesSurface(
				slug,
				variation,
				mergedVariations,
				variationSurface
			)
	).length;

	const userVariations = filterVariationsForSurface(
		userConfig?.styles?.blocks?.[blockName]?.variations || {},
		mergedVariations,
		variationSurface
	);
	const baseVariations = filterVariationsForSurface(
		baseConfig?.styles?.blocks?.[blockName]?.variations || {},
		mergedVariations,
		variationSurface
	);

	const userVariationsCount = Object.keys(userVariations).length;
	const baseVariationsCount = Object.keys(baseVariations).length;

	const diffVariationsCount = computeDiffVariationsCount({
		metaDataBlockVariationsCount,
		userVariationsCount,
		baseVariationsCount,
		userVariations,
		baseVariations,
	});

	const fallbackCount =
		0 === metaDataBlockVariationsCount
			? null
			: metaDataBlockVariationsCount + 1;

	const storedCount = getBlockDynamicStylesCount(
		blockDynamicStylesCount,
		blockName,
		variationSurface
	);

	const initializedCounterValue =
		1 === diffVariationsCount
			? fallbackCount || diffVariationsCount
			: (storedCount ?? diffVariationsCount);

	const [counter, setCounter] = useState(initializedCounterValue);

	useEffect(() => {
		if (counter !== initializedCounterValue) {
			setCounter(initializedCounterValue);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initializedCounterValue]);

	return [counter, setCounter];
};
