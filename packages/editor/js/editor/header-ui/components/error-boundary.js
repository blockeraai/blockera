// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { Component } from '@wordpress/element';

// Error boundary to catch CanvasEditor rendering errors
export class ErrorBoundary extends Component<
	Object,
	{ hasError: boolean, error: ?Error },
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
