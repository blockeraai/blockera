// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { Fill } from '@wordpress/components';
import { Component } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { useSelect, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { BreakpointsUI } from './components';
import { STORE_NAME } from '../../store/constants';
import type { BreakpointTypes } from '../../extensions/libs/block-card/block-states/types';

export default function HeaderUI(): MixedElement {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { editorMode } = useSelect((select) => {
		const { getEditorMode } = select('core/editor');
		return { editorMode: getEditorMode() };
	});

	// Only render in visual editor mode
	if ('visual' !== editorMode) {
		return <></>;
	}

	// Error boundary to catch CanvasEditor rendering errors
	class ErrorBoundary extends Component<
		Object,
		{ hasError: boolean, error: ?Error }
	> {
		constructor(props: Object) {
			super(props);
			this.state = { hasError: false, error: null };
		}

		static getDerivedStateFromError(error: Error): {
			hasError: boolean,
			error: Error,
		} {
			return { hasError: true, error };
		}

		componentDidCatch(error: Error, errorInfo: Object): void {
			// Log error for debugging
			// @debug-ignore
			if (typeof console !== 'undefined' && console.error) {
				// @debug-ignore
				console.error('CanvasEditor error:', error, errorInfo);
			}
		}

		render(): MixedElement {
			if (this.state.hasError) {
				return (
					<div style={{ color: 'red', padding: '10px' }}>
						Error: {this.state.error?.message || 'Unknown error'}
					</div>
				);
			}
			return this.props.children;
		}
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
