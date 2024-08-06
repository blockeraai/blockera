// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { registerPlugin, getPlugin } from '@wordpress/plugins';

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

export const bootstrapCanvasEditor = (): void => {
	const { getEntity } = select('blockera/data') || {};

	if (!getPlugin('blockera-canvas-editor-observer')) {
		registerPlugin('blockera-canvas-editor-observer', {
			render() {
				const { version } = getEntity('wp');
				const { header, previewDropdown, postPreviewElement } =
					getTarget(version);

				return (
					<Observer
						ancestors={[
							{
								options: {
									root: document.querySelector(
										'.interface-interface-skeleton__header'
									),
									threshold: 1.0,
								},
								callback(
									entries: Array<IntersectionObserverEntry>
								) {
									const editPost = select('core/edit-post');

									if (!editPost) {
										return;
									}

									const plugin =
										'blockera-post-canvas-editor-top-bar';

									if (getPlugin(plugin)) {
										return;
									}

									registerPlugin(plugin, {
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
							{
								options: {
									root: document.querySelector('body'),
									threshold: 1.0,
								},
								callback(
									entries: Array<IntersectionObserverEntry>
								) {
									const editSite = select('core/edit-site');

									if (!editSite) {
										return;
									}

									const plugin =
										'blockera-site-canvas-editor-top-bar';

									if (getPlugin(plugin)) {
										return;
									}

									registerPlugin(plugin, {
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
						]}
					/>
				);
			},
		});
	}
};
