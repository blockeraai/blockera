// @flow

import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { blockeraBootstrapControls } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { Observer, CanvasEditor } from '../../';
import { blockeraExtensionsBootstrap } from '../libs/bootstrap';

export default function (wp: Object) {
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

	if (
		'function' === typeof registerPlugin &&
		!getPlugin('blockera-core-editor-observer')
	) {
		registerPlugin('blockera-core-editor-observer', {
			render() {
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
										'blockera-core-post-editor-top-bar';

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
								target: '.edit-post-header__center',
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
										'blockera-core-site-editor-top-bar';

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

	// Bootstrap functions for extensions.
	blockeraExtensionsBootstrap();

	// Bootstrap functions for controls.
	blockeraBootstrapControls();
}
