// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

export type ControlContextProviderProps = {
	value: {
		value: any,
		name: string,
		attribute: string,
		blockName: string,
		hasSideEffect?: boolean,
		description?: string | MixedElement | any,
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
	onChange: (newValue: any) => void,
	valueCleanup?: (newValue: any) => void,
	defaultValue: any,
	sideEffect?: boolean,
	mergeInitialAndDefault?: boolean,
};
