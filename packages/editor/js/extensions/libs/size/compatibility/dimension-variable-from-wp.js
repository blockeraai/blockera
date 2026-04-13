// @flow

/**
 * Blockera dependencies
 */
import { getValueAddonFromVarString } from '@blockera/data';

/**
 * Shared for width / height / min-height when mirroring WP string attributes that may be
 * `var:…` or `var(--wp--…)` (width-size or spacing tokens).
 */
export const DIMENSION_VARIABLE_TYPES = ['width-size', 'spacing'];

const dimensionVariableCompatFromWPOptions = {
	onlyVariableLike: true,
	passthroughNonObject: true,
};

export function resolveDimensionValueFromWP(value: mixed): mixed {
	return getValueAddonFromVarString(
		value,
		DIMENSION_VARIABLE_TYPES,
		dimensionVariableCompatFromWPOptions
	);
}
