// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';

/**
 * Internal dependencies
 */
import type { DynamicVariableType, DynamicVariableGroup } from './types';

const _getVariableGroup = (
	{ variables }: Object,
	group
): DynamicVariableGroup => {
	return variables[group];
};

export const getVariableGroup: DynamicVariableGroup =
	memoize(_getVariableGroup);

const _getVariableType = (
	{ variables }: Object,
	group: string,
	name: string
): DynamicVariableType => {
	return Object.values(variables[group].items).find(
		(i: { ...Object, name: string }) => i.name === name
	);
};

export const getVariableType: DynamicVariableType = memoize(_getVariableType);

const _getVariableGroups = ({
	variables,
}: Object): Array<DynamicVariableGroup> => {
	return variables;
};

export const getVariableGroups: Array<DynamicVariableGroup> =
	memoize(_getVariableGroups);
