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
	group: string
): DynamicVariableGroup => {
	return variables[group];
};

export const getVariableGroup: DynamicVariableGroup =
	memoize(_getVariableGroup);

const _getVariableType = (
	store: Object,
	group: string,
	name: string
): DynamicVariableType | void => {
	if (
		store?.variables === undefined ||
		store?.variables[group] === undefined
	) {
		return;
	}

	return Object.values(store?.variables[group]?.items || {}).find(
		(i: { ...Object, name: string }) => i.name === name
	);
};

export const getVariableType: DynamicVariableType = memoize(_getVariableType);

const _getVariableGroups = ({
	variables,
}: Object): Array<DynamicVariableGroup> => {
	return variables || {};
};

export const getVariableGroups: Array<DynamicVariableGroup> =
	memoize(_getVariableGroups);

const _getVariableGroupItems = (
	store: Object,
	group: string,
	type: string
): DynamicVariableType | void => {
	// If group is not specified, search in all groups
	if (!group) {
		const allGroups = Object.values(store?.variables || {});

		return allGroups
			.map((group) => Object.values(group?.items || {}))
			.flat()
			.filter((i: { ...Object, type: string }) => i?.type === type);
	}

	// If group is specified, search in the specified group
	return Object.values(store?.variables[group]?.items || {}).filter(
		(i: { ...Object, type: string }) => i?.type === type
	);
};

export const getVariableGroupItems: DynamicVariableType = memoize(
	_getVariableGroupItems
);
