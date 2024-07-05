// @flow

/**
 * External dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import type { BreakpointTypes } from './extensions/libs/block-states/types';

/**
 * Internal dependencies
 */
import { STORE_NAME } from './store';

export function unstableBootstrapServerSideBreakpointDefinitions(
	definitions: Array<BreakpointTypes>
) {
	const { setBreakpoints } = dispatch(STORE_NAME);

	setBreakpoints(
		Object.fromEntries(
			definitions.map(
				(breakpoint: BreakpointTypes): [string, BreakpointTypes] => [
					breakpoint.type,
					breakpoint,
				]
			)
		)
	);
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
export { CanvasEditor, isBaseBreakpoint } from './canvas-editor';
