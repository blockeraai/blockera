// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { select, dispatch } from '@wordpress/data';
import { getPlugin, registerPlugin } from '@wordpress/plugins';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { CanvasEditor } from './index';
import { getTargets } from './helpers';
import { STORE_NAME } from '../store';
import { IntersectionObserverRenderer } from './intersection-observer-renderer';
import type { BreakpointTypes } from '../extensions/libs/block-card/block-states/types';

// Cache for checking if the component is already rendered.
const cache: Map<string, boolean> = new Map();

export const bootstrapCanvasEditor = (): void | Object => {
	const { getEntity } = select('blockera/data') || {};

	const observerPlugin = 'blockera-canvas-editor-observer';

	const { version } = getEntity('wp');
	const { header } = getTargets(version);

	const registry = () => {
		registerPlugin(observerPlugin, {
			render() {
				const componentSelector = '.blockera-canvas-breakpoints';

				// eslint-disable-next-line react-hooks/rules-of-hooks
				useEffect(() => {
					if (
						!document.querySelector(componentSelector) &&
						!cache.get(componentSelector)
					) {
						cache.set(componentSelector, true);

						new IntersectionObserverRenderer(
							header,
							(): MixedElement => (
								<CanvasEditor
									target={document.querySelector(header)}
								/>
							),
							{
								root: '.editor-header',
								after: '.editor-header__toolbar',
								componentSelector,
							}
						);
					}
					// eslint-disable-next-line react-hooks/exhaustive-deps
				}, []);

				return <></>;
			},
		});
	};

	if (!getPlugin(observerPlugin)) {
		return registry();
	}
};

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

export function registerCanvasEditorSettings(settings: Object) {
	const { setCanvasSettings } = dispatch(STORE_NAME);

	setCanvasSettings(settings);
}
