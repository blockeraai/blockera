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
			convertedGap.columns = getSpacingVAFromVarString(spacing?.top);
		}

		if (isObject(convertedGap.rows) && isObject(convertedGap.columns)) {
			if (isEquals(convertedGap.rows, convertedGap.columns)) {
				convertedGap.lock = true;
				convertedGap.gap = convertedGap.rows;
				convertedGap.columns = '';
				convertedGap.rows = '';
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
	mode: 'simple' | 'advanced' = 'simple'
): string {
	let newGap = '';

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
	} else if (mode === 'advanced') {
		// todo implement advanced mode
	}

	return newGap;
}

export function gapFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (
		isEquals(attributes?.blockeraGap, defaultGap) &&
		attributes?.style?.spacing?.blockGap
	) {
		const gap = convertFromValue(attributes?.style?.spacing?.blockGap);

		attributes.blockeraGap = gap;
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
	blockId?: string,
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

	switch (blockId) {
		case 'core/group':
			const spacing = convertToValue(newValue, 'simple');

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
