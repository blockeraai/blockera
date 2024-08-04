// @flow

import type { ControlGeneralTypes } from '../../../types';

export type RendererControlTypes = 'text' | 'select' | 'link' | 'search';

export type RendererControlProps = {
	...ControlGeneralTypes,
	key?: string,
	parentId: string,
	parentDefaultValue: any,
	type: RendererControlTypes,
	conditions?: Array<string>,
	options?: Array<any> | Object,
};
