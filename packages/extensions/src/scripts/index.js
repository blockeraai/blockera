// @flow

import { bootstrapSizeExtension, bootstrapTypographyExtension } from '../libs';

/**
 * Internal dependencies
 */
import { CanvasEditor } from '../components';

export default function (wp: Object) {
	const registerPlugin = wp.plugins.registerPlugin;

	registerPlugin('publisher-core-canvas-editor', {
		render() {
			return <CanvasEditor />;
		},
	});

	bootstrapSizeExtension();
	bootstrapTypographyExtension();

	// TODO: implements other bootstrap functionalities here ...
}
