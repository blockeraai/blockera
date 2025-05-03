// @flow

/**
 * External dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { getSortedObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { STORE_NAME } from './store';
import type {
	StateTypes,
	BreakpointTypes,
} from './extensions/libs/block-card/block-states/types';

export function unstableBootstrapServerSideBreakpointDefinitions(definitions: {
	[key: string]: BreakpointTypes,
}) {
	const { setBreakpoints } = dispatch(STORE_NAME);
	const breakpointsStack: { [key: string]: BreakpointTypes } = {};

	for (const definitionType in definitions) {
		breakpointsStack[definitionType] = {
			...definitions[definitionType],
			native: definitions[definitionType]?.native || false,
		};
	}

	setBreakpoints(breakpointsStack);
}

export function unstableBootstrapServerSideBlockStatesDefinitions(definitions: {
	[key: string]: StateTypes,
}) {
	const { setBlockStates } = dispatch(STORE_NAME);
	const overrideDefinitions: { [key: string]: Object } = {};

	for (const [key, definition] of Object.entries(definitions)) {
		if (definition?.hasOwnProperty('native')) {
			const isNative = definition?.native;

			overrideDefinitions[key] = {
				...definition,
				disabled: isNative,
			};

			continue;
		}

		overrideDefinitions[key] = definition;
	}

	setBlockStates(getSortedObject(overrideDefinitions));
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
