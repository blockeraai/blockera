// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { select } from '@wordpress/data';
import {
	getPlugin,
	registerPlugin,
	unregisterPlugin,
} from '@wordpress/plugins';
import { useState, useEffect } from '@wordpress/element';
/**
 * Blockera dependencies
 */
import { isLoadedPostEditor, isLoadedSiteEditor } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { CanvasEditor } from './index';
import { getTargets } from './helpers';
import { IntersectionObserverRenderer } from './intersection-observer-renderer';

const allowedContexts = ['post', 'site'];

const getPageQueryString = (): string => window.location.search;

export const bootstrapCanvasEditor = (context: string): void | Object => {
	const { getEntity } = select('blockera/data') || {};

	if (!allowedContexts.includes(context)) {
		return;
	}

	const observerPlugin = 'blockera-canvas-editor-observer';

	const { version } = getEntity('wp');
	const { header, previewDropdown, postPreviewElement } = getTargets(version);

	// Executing on site editor. to ensure of rendering canvas editor at the WordPress top bar.
	if (isLoadedSiteEditor() && !getPageQueryString().length) {
		if (getPlugin(observerPlugin)) {
			unregisterPlugin(observerPlugin);
		}
	}

	const registry = () =>
		registerPlugin(observerPlugin, {
			render() {
				// eslint-disable-next-line react-hooks/rules-of-hooks
				const [count, setCount] = useState(0);

				// eslint-disable-next-line react-hooks/rules-of-hooks
				useEffect(() => {
					if (count === 0) {
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
								componentSelector:
									'.blockera-canvas-breakpoints',
							}
						);
					}

					setCount(count + 1);
				}, [count]);

				return <></>;
			},
		});

	if (
		isLoadedSiteEditor() &&
		-1 !== getPageQueryString().indexOf('canvas=edit') &&
		!getPlugin(observerPlugin)
	) {
		return registry();
	}

	if (isLoadedPostEditor() && !getPlugin(observerPlugin)) {
		return registry();
	}
};
