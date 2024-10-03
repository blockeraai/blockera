// @flow

/**
 * External dependencies
 */
import { dispatch } from '@wordpress/data';
import { addAction, addFilter, applyFilters } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import {
	blockeraBootstrapBlocks,
	registerBlockeraBlocks,
	registerConfigExtensionsOfInnerBlocks,
} from '@blockera/blocks-core';
import { noop, isLoadedSiteEditor, isLoadedPostEditor } from '@blockera/utils';
import { initializer } from '@blockera/bootstrap';
import {
	applyHooks,
	defineGlobalProps,
	bootstrapCanvasEditor,
	blockeraExtensionsBootstrap,
} from '@blockera/editor';
import blockeraEditorPackageInfo from '@blockera/editor/package.json';

addAction('blockera.mergeBlockSettings.Edit.component', 'blockera.index', () =>
	bootstrapCanvasEditor('site')
);

/**
 * Registration blockera core block settings with internal definitions.
 */
addFilter('blockera.bootstrapper.before.domReady', 'blockera.bootstrap', () => {
	applyHooks(() => {
		const {
			registerSharedBlockAttributes = () => {},
			registerBlockTypeAttributes = () => {},
		} = dispatch('blockera/extensions') || {};

		const packageName =
			'blockeraEditor_' +
			blockeraEditorPackageInfo.version.replace(/\./g, '_');

		window[packageName].editor = {
			...(window[packageName]?.editor || {}),
			unstableRegistrationSharedBlockAttributes:
				registerSharedBlockAttributes,
			unstableRegistrationBlockTypeAttributes:
				registerBlockTypeAttributes,
		};

		registerBlockeraBlocks();
		registerConfigExtensionsOfInnerBlocks();
	});
});

/**
 * Initialize blockera react application.
 */
addFilter('blockera.bootstrapper', 'blockera.bootstrap', () => {
	applyFilters('blockera.before.bootstrap', noop)();

	return () => {
		defineGlobalProps(() => {
			// Bootstrap functions for blocks.
			blockeraBootstrapBlocks();

			// Bootstrap canvas editor UI on WordPress post editor.
			if (!isLoadedSiteEditor() && isLoadedPostEditor()) {
				bootstrapCanvasEditor('post');
			}

			// Bootstrap functions for extensions.
			blockeraExtensionsBootstrap();

			applyFilters('blockera.after.bootstrap', noop)();
		});
	};
});

initializer();
