// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { select } from '@wordpress/data';
import { getPlugin, registerPlugin } from '@wordpress/plugins';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { CanvasEditor } from './index';
import { getTargets } from './helpers';
import { IntersectionObserverRenderer } from './intersection-observer-renderer';

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
					// Add class to body to indicate that the canvas editor is enabled.
					if (document.body) {
						document.body.classList.add(
							'blockera-canvas-editor-enabled'
						);
					}

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
