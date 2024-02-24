// @flow

/**
 * External dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Publisher dependencies
 */
import type {
	TBreakpoint,
	BreakpointTypes,
} from '@publisher/extensions/src/libs/block-states/types';

/**
 * Internal dependencies
 */
import { STORE_NAME } from './store';

export function unstableBootstrapServerSideBreakpointDefinitions(definitions: {
	[key: TBreakpoint]: BreakpointTypes,
}) {
	const { addBreakpoint } = dispatch(STORE_NAME);

	Object.values(definitions).forEach((definition: BreakpointTypes): void =>
		addBreakpoint(definition)
	);
}

export function registerCanvasEditorSettings(settings: Object) {
	const { setCanvasSettings } = dispatch(STORE_NAME);

	setCanvasSettings(settings);
}

export * from './store';
export { Observer } from './observer';
export { CanvasEditor, isLaptopBreakpoint } from './canvas-editor';
