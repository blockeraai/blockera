// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

export type ControlContextRef = {
	current: {
		path: string,
		reset: boolean,
		action: 'reset' | 'normal',
	},
};

export type ControlInfo = {
	block?: Object,
	value: any,
	name: string,
	attribute?: string,
	blockName?: string,
	hasSideEffect?: boolean,
	description?: string | MixedElement | any,
	type?: 'simple' | 'nested',
};

export type ControlContextProviderProps = {
	value: {
		...ControlInfo,
		callback?: (
			controlInfo: Object,
			value: any,
			modifyControlValue: (params: Object) => void
		) => void,
	},
	storeName?: string,
	children: MixedElement | any,
};

export type ControlContextHookProps = {
	id?: string,
	repeater?: {
		itemId?: number,
		repeaterId?: string | null,
		defaultRepeaterItemValue: Object,
	},
	onChange?: (newValue: any) => any,
	valueCleanup?: (newValue: any) => any,
	defaultValue: any,
	sideEffect?: boolean,
	mergeInitialAndDefault?: boolean,
};

export * from './control-effect-type';
