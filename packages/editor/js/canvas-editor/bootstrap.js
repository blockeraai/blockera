// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import {
	getPlugin,
	registerPlugin,
	unregisterPlugin,
} from '@wordpress/plugins';

/**
 * Blockera dependencies
 */
import { isLoadedPostEditor, isLoadedSiteEditor } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { Observer } from '../observer';
import { CanvasEditor } from './index';
import type { GetTarget } from './types';

// Compatibility for WordPress supported versions.
const getTarget = (version: string): GetTarget => {
	// For WordPress version equals or bigger than 6.6 version.
	if (Number(version?.replace(/\./g, '')) >= 66) {
		return {
			header: '.editor-header__center',
			previewDropdown: '.editor-preview-dropdown',
			postPreviewElement: 'a[aria-label="View Post"]',
		};
	}

	// For less than WordPress 6.6 versions.
	return {
		header: '.edit-post-header__center',
		postPreviewElement: 'a[aria-label="View Post"]',
		previewDropdown: 'div.block-editor-post-preview__dropdown',
	};
};

const allowedContexts = ['post', 'site'];

const getPageQueryString = (): string => window.location.search;

export const bootstrapCanvasEditor = (context: string): void | Object => {
	const { getEntity } = select('blockera/data') || {};

	if (!allowedContexts.includes(context)) {
		return;
	}

	const observerPlugin = 'blockera-canvas-editor-observer';
	const editPostPlugin = 'blockera-post-canvas-editor-top-bar';
	const editSitePlugin = 'blockera-site-canvas-editor-top-bar';

	const { version } = getEntity('wp');
	const { header, previewDropdown, postPreviewElement } = getTarget(version);

	// Executing on site editor. to ensure of rendering canvas editor at the WordPress top bar.
	if (isLoadedSiteEditor() && !getPageQueryString().length) {
		if (getPlugin(observerPlugin)) {
			unregisterPlugin(observerPlugin);

			if (getPlugin(editSitePlugin)) {
				unregisterPlugin(editSitePlugin);
			}
		}
	}

	const registry = () =>
		registerPlugin(observerPlugin, {
			render() {
				const ancestors = {
					post: {
						options: {
							root: document.querySelector(
								'.interface-interface-skeleton__header'
							),
							threshold: 1.0,
						},
						callback(entries: Array<IntersectionObserverEntry>) {
							const editPost = select('core/edit-post');

							if (!editPost) {
								return;
							}

							if (getPlugin(editPostPlugin)) {
								return;
							}

							registerPlugin(editPostPlugin, {
								render() {
									return (
										<CanvasEditor
											{...{
												previewDropdown,
												postPreviewElement,
											}}
											entry={entries[0]}
										/>
									);
								},
							});
						},
						target: header,
					},
					site: {
						options: {
							root: document.querySelector('body'),
							threshold: 1.0,
						},
						callback(entries: Array<IntersectionObserverEntry>) {
							const editSite = select('core/edit-site');

							if (!editSite) {
								return;
							}

							if (getPlugin(editSitePlugin)) {
								return;
							}

							registerPlugin(editSitePlugin, {
								render() {
									return (
										<CanvasEditor
											{...{
												previewDropdown,
												postPreviewElement,
											}}
											entry={entries[0]}
										/>
									);
								},
							});
						},
						target: header,
					},
				};

				return <Observer ancestors={[ancestors[context]]} />;
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
