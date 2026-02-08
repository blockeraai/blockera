// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { Fill } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { useSelect, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../../store/constants';
import { BreakpointsUI, ErrorBoundary } from './components';
import type { BreakpointTypes } from '../../extensions/libs/block-card/block-states/types';

export default function HeaderUI(): MixedElement {
	const { editorMode } = useSelect((select) => {
		const { getEditorMode } = select('core/editor');
		return { editorMode: getEditorMode() };
	});

	// Only render in visual editor mode
	if ('visual' !== editorMode) {
		return <></>;
	}

	return (
		<Fill name="blockera/slots/editor-header-settings">
			<ErrorBoundary>
				<BreakpointsUI className="blockera-canvas-breakpoints" />
			</ErrorBoundary>
		</Fill>
	);
}

export function unstableBootstrapServerSideBreakpointDefinitions(definitions: {
	[key: string]: BreakpointTypes,
}) {
	const { setBreakpoints } = dispatch(STORE_NAME);

	setBreakpoints(
		applyFilters(
			'blockera.editor.canvasEditor.bootstrap.breakpoints',
			definitions
		)
	);
}

export function setupCanvasSettings(settings: Object) {
	const { setCanvasSettings } = dispatch(STORE_NAME);

	setCanvasSettings(settings);
}

export * from './components';
