// @flow

/**
 * External dependencies
 */
import { detailedDiff } from 'deep-object-diff';
import { useMemo, useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { omit, mergeObject, omitWithPattern } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { useGlobalStyle } from '../../editor/global-styles/panel/context/hooks';
import {
	getNormalizedStyle,
	getBlockAttributes,
} from '../../editor/global-styles/panel/context';
import { prepareBlockeraDefaultAttributesValues } from '../../extensions/components/utils';

export const useStateChanges = ({
	blockName,
	storedAttributes,
	defaultAttributes,
	currentBlockStyleVariation,
}: {
	blockName: string,
	storedAttributes: Object,
	defaultAttributes: Object,
	currentBlockStyleVariation: Object,
}): Object => {
	const { blockeraOverrideBlockAttributes } = useMemo(
		() => getBlockAttributes(blockName),
		[blockName]
	);
	const originDefaultAttributes = useMemo(() => {
		return mergeObject(blockeraOverrideBlockAttributes, defaultAttributes);
	}, [defaultAttributes, blockeraOverrideBlockAttributes]);
	// Preparing default attributes values for usage in global styles context.
	const defaultStylesValue = prepareBlockeraDefaultAttributesValues(
		originDefaultAttributes
	);
	let prefixParts: Array<string> = [];
	if (
		currentBlockStyleVariation &&
		!currentBlockStyleVariation?.isDefault &&
		currentBlockStyleVariation?.name
	) {
		prefixParts = ['variations', currentBlockStyleVariation.name].concat(
			prefixParts
		);
	}
	const prefix = prefixParts.join('.');
	const [style] = useGlobalStyle(prefix, blockName, 'all', {
		shouldDecodeEncode: false,
		defaultStylesValue,
	});
	const _style = style;
	if (_style?.variations) {
		delete _style?.variations;
	}

	// Normalizing and cleanup block stored attributes.
	const normalizedAttributes = getNormalizedStyle(
		storedAttributes,
		defaultStylesValue
	);

	const { updated } = Object.keys(normalizedAttributes).length
		? detailedDiff(
				!Object.keys(_style).length
					? defaultStylesValue
					: mergeObject(defaultStylesValue, _style),
				normalizedAttributes
			)
		: { updated: {} };

	const initializedValue =
		Object.keys(
			omitWithPattern(
				omit(updated, [
					'blockeraPropsId',
					'blockeraCompatId',
					'blockeraCurrentDevice',
				]),
				/!^blockera/i
			)
		).length > 0;

	const [hasChangesets, setChangesets] = useState(initializedValue);

	return {
		hasChangesets,
		setChangesets,
		originDefaultAttributes,
	};
};
