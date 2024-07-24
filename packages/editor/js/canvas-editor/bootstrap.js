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

				// Prevent of rendering canvas editor while version not available.
				if (!version) {
					return <></>;
				}

				// Compatibility for WordPress supported versions.
				const getTarget = () => {
					// For WordPress version equals or bigger than 6.6 version.
					if (Number(version?.replace(/\./g, '')) >= 66) {
						return '.editor-header__center';
					}

					// For less than WordPress 6.6 versions.
					return '.edit-post-header__center';
				};

				const target = getTarget();

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
