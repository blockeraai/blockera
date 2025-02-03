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
	const { header, previewDropdown, postPreviewElement } = getTargets(version);

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
							'.editor-header__center',
							(): MixedElement => (
								<CanvasEditor
									{...{
										previewDropdown,
										postPreviewElement,
									}}
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
