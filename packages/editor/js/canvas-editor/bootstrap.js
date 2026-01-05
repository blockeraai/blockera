// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { applyFilters } from '@wordpress/hooks';
import { select, useSelect, dispatch } from '@wordpress/data';
import { getPlugin, registerPlugin } from '@wordpress/plugins';
import { Fill } from '@wordpress/components';
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../store';
import { getTargets } from './helpers';
import { registration } from './global-styles';
import { CanvasEditor } from './components';
import type { BreakpointTypes } from '../extensions/libs/block-card/block-states/types';

export const bootstrapCanvasEditor = (): void | Object => {
	const allowedUsers = applyFilters(
		'blockera.editor.extensions.hooks.withBlockSettings.allowedUsers',
		[]
	);
	const allowedPostTypes = applyFilters(
		'blockera.editor.extensions.hooks.withBlockSettings.allowedPostTypes',
		[]
	);
	const currentUser = applyFilters('blockera.editor.extensions.currentUser', {
		roles: ['administrator'],
	});
	const { blockeraCurrentPostType } = window;

	const needToShowCanvasEditor = () => {
		// If no restrictions, block is available
		if (!allowedUsers.length && !allowedPostTypes.length) {
			return true;
		}

		// Build user roles set for O(1) lookups (performance optimization)
		const userRolesSet = new Set(currentUser.roles);

		// Check user role match (if user restrictions exist)
		let hasAllowedUser = true;
		if (allowedUsers.length) {
			hasAllowedUser = false;
			// Use for...of instead of filter to avoid intermediate array allocation
			for (const role of allowedUsers) {
				if (userRolesSet.has(role)) {
					hasAllowedUser = true;
					break;
				}
			}
		}

		// Check post type match (if post type restrictions exist)
		let hasAllowedPostType = true;
		if (allowedPostTypes.length && blockeraCurrentPostType) {
			hasAllowedPostType = allowedPostTypes.includes(
				blockeraCurrentPostType
			);
		}

		// Both conditions must be met if both restrictions exist
		return hasAllowedUser && hasAllowedPostType;
	};

	if (!needToShowCanvasEditor()) {
		return;
	}

	const { getEntity } = select('blockera/data') || {};

	const canvasEditorPlugin = 'blockera-canvas-editor';

	const { version } = getEntity('wp');
	const { globalStylesPanel } = getTargets(version);

	// Register the plugin if it doesn't exist
	if (!getPlugin(canvasEditorPlugin)) {
		registerPlugin(canvasEditorPlugin, {
			render() {
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
							console.error(
								'CanvasEditor error:',
								error,
								errorInfo
							);
						}
					}

					render(): MixedElement {
						if (this.state.hasError) {
							return (
								<div style={{ color: 'red', padding: '10px' }}>
									Error:{' '}
									{this.state.error?.message ||
										'Unknown error'}
								</div>
							);
						}
						return this.props.children;
					}
				}

				return (
					<Fill name="blockera/slots/editor-header-settings">
						<ErrorBoundary>
							<CanvasEditor className="blockera-canvas-breakpoints" />
						</ErrorBoundary>
					</Fill>
				);
			},
		});
	}

	registration(globalStylesPanel);
};

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

export function registerCanvasEditorSettings(settings: Object) {
	const { setCanvasSettings } = dispatch(STORE_NAME);

	setCanvasSettings(settings);
}
