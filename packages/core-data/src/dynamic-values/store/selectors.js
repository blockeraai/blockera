// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';

const _getDynamicValues = ({ dynamicValues }: Object, group: string) => {
	return dynamicValues[group].items;
};

export const getDynamicValues = memoize(_getDynamicValues);

const _getDynamicValue = (
	{ dynamicValues }: Object,
	group: string,
	name: string
) => {
	return dynamicValues[group].items.find(
		(i: { ...Object, name: string }): boolean => i.name === name
	);
};

export const getDynamicValue = memoize(_getDynamicValue);

const _getDynamicValueGroups = ({ dynamicValues }: Object) => {
	return dynamicValues;
};

export const getDynamicValueGroups = memoize(_getDynamicValueGroups);
