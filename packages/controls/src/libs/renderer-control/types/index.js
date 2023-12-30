// @flow

import type { ControlGeneralTypes } from '../../../types';

export type RendererControlCondition = {
	key: string,
	value: any,
	operator: 'equals' | 'notEquals' | 'biggerThan' | 'lessThan',
};

export type RendererControlTypes = 'text' | 'select' | 'link' | 'search';

export type RendererControlProps = {
	...ControlGeneralTypes,
	key?: string,
	parentId: string,
	parentDefaultValue: any,
	type: RendererControlTypes,
	conditions?: Array<string>,
};
