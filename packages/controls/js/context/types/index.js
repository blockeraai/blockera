// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

export type ControlContextRefCurrent = {
	path: string,
	reset: boolean,
	defaultValue: any,
	action: 'reset' | 'normal' | 'reset_all_states',
};

export type ControlContextRef = {
	current: ControlContextRefCurrent,
};

export type ControlInfo = {
	value: any,
	name: string,
	block?: Object,
	attribute?: string,
	blockName?: string,
	needUpdate?: (prev: any, next: any) => boolean,
	type?: 'simple' | 'nested',
	description?: string | MixedElement | any,
};

export type ControlContextProviderProps = {
	value: ControlInfo,
	storeName?: string,
	children: MixedElement | any,
	type?: 'nested',
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
