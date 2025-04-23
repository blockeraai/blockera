// @flow

/**
 * External dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import type {
	StateTypes,
	BreakpointTypes,
} from './extensions/libs/block-states/types';

/**
 * Internal dependencies
 */
import { STORE_NAME } from './store';

export function unstableBootstrapServerSideBreakpointDefinitions(definitions: {
	[key: string]: BreakpointTypes,
}) {
	const { setBreakpoints } = dispatch(STORE_NAME);
	const breakpointsStack: { [key: string]: BreakpointTypes } = {};

	for (const definitionType in definitions) {
		breakpointsStack[definitionType] = definitions[definitionType];
	}

	setBreakpoints(breakpointsStack);
}

export function unstableBootstrapServerSideBlockStatesDefinitions(definitions: {
	[key: string]: StateTypes,
}) {
	const { setBlockStates } = dispatch(STORE_NAME);

	setBlockStates(definitions);
}

export function registerCanvasEditorSettings(settings: Object) {
	const { setCanvasSettings } = dispatch(STORE_NAME);

	setCanvasSettings(settings);
}

export * from './store';
export * from './hooks';
export * from './components';
export * from './extensions';
export { Observer } from './observer';
export {
	CanvasEditor,
	getBaseBreakpoint,
	isBaseBreakpoint,
	bootstrapCanvasEditor,
} from './canvas-editor';
