// @flow

import { select } from '@wordpress/data';

/**
 * Publisher dependencies
 */
import { Observer, CanvasEditor } from '@publisher/editor';
import { blockeraBootstrapBlocks } from '@publisher/blocks';

/**
 * Internal dependencies
 */
import { blockeraExtensionsBootstrap } from '../libs/bootstrap';

export default function (wp: Object) {
	const registerPlugin = wp.plugins.registerPlugin;
	const getPlugin = wp.plugins.getPlugin;

	registerPlugin('publisher-core-editor-observer', {
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
									'publisher-core-post-editor-top-bar';

								if (getPlugin(plugin)) {
									return;
								}

								registerPlugin(plugin, {
									render() {
										return (
											<CanvasEditor entry={entries[0]} />
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
									'publisher-core-site-editor-top-bar';

								if (getPlugin(plugin)) {
									return;
								}

								registerPlugin(plugin, {
									render() {
										return (
											<CanvasEditor entry={entries[0]} />
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

	// Bootstrap functions for extensions
	blockeraExtensionsBootstrap();

	// Bootstrap functions for blocks
	blockeraBootstrapBlocks();
}
