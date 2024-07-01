// @flow

import type { DynamicValueCategory, DynamicValueItem } from '../../types';

export type DynamicValueGroupsType = {
	label: string,
	type: DynamicValueCategory,
	items: Array<DynamicValueItem>,
};
