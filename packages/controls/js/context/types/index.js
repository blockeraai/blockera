// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

export type ControlContextRef = {
	current: {
		path: string,
		reset: boolean,
		defaultValue: any,
		action: 'reset' | 'normal' | 'reset_all_states',
	},
};

export type ControlInfo = {
	value: any,
	name: string,
	block?: Object,
	attribute?: string,
	blockName?: string,
	type?: 'simple' | 'nested',
	description?: string | MixedElement | any,
};

export type ControlContextProviderProps = {
	value: ControlInfo,
	storeName?: string,
	children: MixedElement | any,
	type?: 'nested',
	notSyncWithRecievedValue?: boolean,
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
