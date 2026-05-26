// @flow

/**
 * Blockera dependencies
 */
import { isObject, isEquals, isEmpty } from '@blockera/utils';
import {
	getSpacingVAFromVarString,
	generateAttributeVarStringFromVA,
} from '@blockera/data';

const defaultGap = {
	lock: true,
	gap: '',
	columns: '',
	rows: '',
};

export function convertFromValue(spacing: string | Object): string {
	const convertedGap: Object = { ...defaultGap };

	// if spacing is object means it has top and left properties
	if (isObject(spacing)) {
		// top means rows for WP 🤦‍♂️
		if (spacing?.top) {
			//$FlowFixMe
			convertedGap.rows = getSpacingVAFromVarString(spacing?.top);
		}

		// left means columns for WP 🤦‍♂️
		if (spacing?.left) {
			//$FlowFixMe
			convertedGap.columns = getSpacingVAFromVarString(spacing?.left);
		}

		if (isObject(convertedGap.rows) && isObject(convertedGap.columns)) {
			if (isEquals(convertedGap.rows, convertedGap.columns)) {
				convertedGap.lock = true;
				convertedGap.gap = convertedGap.rows;
				convertedGap.columns = '';
				convertedGap.rows = '';
			} else {
				convertedGap.lock = false;
			}
		} else if (convertedGap.rows === convertedGap.columns) {
			convertedGap.lock = true;
			convertedGap.gap = convertedGap.rows;
			convertedGap.columns = '';
			convertedGap.rows = '';
		} else {
			convertedGap.lock = false;
		}
	} else {
		convertedGap.gap = getSpacingVAFromVarString(spacing);
	}

	return convertedGap;
}

export function convertToValue(
	newValue: string | Object,
	mode: 'simple' | 'advanced' | '' = 'simple'
): string | Object {
	let newGap: string | Object = '';

	//
	// Simple gap mode for WP is when it stores data as string and only one value for gap
	//
	if (mode === 'simple') {
		if (newValue.lock) {
			//$FlowFixMe
			newGap = generateAttributeVarStringFromVA(newValue.gap);

			// css func not supported
			if (newGap.endsWith('css')) {
				newGap = '';
			}
		} else {
			//$FlowFixMe
			newGap = generateAttributeVarStringFromVA(newValue.rows);

			// css func not supported
			if (newGap.endsWith('css')) {
				newGap = '';
			}
		}
	}
	//
	// Advanced mode for WP is when it stores data as object with top (rows) and left (columns) properties
	//
	else if (mode === 'advanced') {
		if (newValue.lock) {
			//$FlowFixMe
			newGap = generateAttributeVarStringFromVA(newValue.gap);

			// css func not supported
			if (newGap.endsWith('css')) {
				newGap = '';
			}

			if (newGap) {
				newGap = {
					top: newGap,
					left: newGap,
				};
			}
		} else {
			//$FlowFixMe
			let rowGap = generateAttributeVarStringFromVA(newValue.rows);

			// css func not supported
			if (rowGap.endsWith('css')) {
				rowGap = '';
			}

			//$FlowFixMe
			let columnGap = generateAttributeVarStringFromVA(newValue.columns);

			// css func not supported
			if (columnGap.endsWith('css')) {
				columnGap = '';
			}

			if (rowGap || columnGap) {
				newGap = {
					top: rowGap,
					left: columnGap,
				};
			} else {
				newGap = '';
			}
		}
	}

	return newGap;
}

export function gapFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (
		isEquals(attributes?.blockeraGap?.value, defaultGap) &&
		attributes?.style?.spacing?.blockGap
	) {
		attributes.blockeraGap = {
			value: convertFromValue(attributes?.style?.spacing?.blockGap),
		};
	}

	return attributes;
}

export function gapToWPCompatibility({
	newValue,
	ref,
	defaultValue,
	blockId,
}: {
	newValue: Object,
	ref?: Object,
	defaultValue: Object,
	blockId: string,
}): Object {
	if ('reset' === ref?.current?.action || isEquals(newValue, defaultValue)) {
		return {
			style: {
				spacing: {
					blockGap: undefined,
				},
			},
		};
	}

	const blockWPGapDataType = getBlockGapWPDataType(blockId);

	if (blockWPGapDataType) {
		const spacing = convertToValue(newValue, blockWPGapDataType);

		return {
			style: {
				spacing: {
					blockGap: isEmpty(spacing) ? undefined : spacing,
				},
			},
		};
	}

	return {};
}

/**
 * In WP we have 2 type of storing data. first one is object that we name it 'advanced' and second one is string that we name it 'simple'.
 *
 * There is no standard for it and we have to manually detect and care it.
 */
function getBlockGapWPDataType(blockId: string): 'simple' | 'advanced' | '' {
	switch (blockId) {
		case 'core/details':
		case 'core/group':
		case 'core/buttons':
		case 'core/quote':
		case 'core/cover':
		case 'core/column':
		case 'core/post-template':
			return 'simple';

		case 'core/social-links':
		case 'core/columns':
		case 'core/gallery':
			return 'advanced';
	}

	return '';
}
