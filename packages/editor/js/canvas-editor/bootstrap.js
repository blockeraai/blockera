// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { Observer } from '../observer';
import { CanvasEditor } from './index';

export const bootstrapCanvasEditor = (wp: Object): void => {
	const {
		plugins: { registerPlugin, getPlugin },
	} = wp?.plugins
		? wp
		: {
				...wp,
				plugins: {
					registerPlugin: null,
					getPlugin: null,
				},
		  };

	const { getEntity } = select('blockera/data') || {};

	if (
		'function' === typeof registerPlugin &&
		!getPlugin('blockera-editor-observer')
	) {
		registerPlugin('blockera-editor-observer', {
			render() {
				const { version } = getEntity('wp');

				// Compatibility for WordPress supported versions.
				const targets = {
					'6.6': '.editor-header__center',
					'6.5.5': '.edit-post-header__center',
					'6.5.4': '.edit-post-header__center',
					'6.5.3': '.edit-post-header__center',
					'6.5.2': '.edit-post-header__center',
				};
				const target = targets[version];

				return (
					<Observer
						ancestors={[
							{
								options: {
									root: document.querySelector(
										'div[aria-label="Editor top bar"]'
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
										'blockera-post-editor-top-bar';

									if (getPlugin(plugin)) {
										return;
									}

									registerPlugin(plugin, {
										render() {
											return (
												<CanvasEditor
													entry={entries[0]}
												/>
											);
										},
									});
								},
								target,
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
										'blockera-site-editor-top-bar';

									if (getPlugin(plugin)) {
										return;
									}

									registerPlugin(plugin, {
										render() {
											return (
												<CanvasEditor
													entry={entries[0]}
												/>
											);
										},
									});
								},
								target: 'div[aria-label="Editor top bar"]',
							},
						]}
					/>
				);
			},
		});
	}
};
