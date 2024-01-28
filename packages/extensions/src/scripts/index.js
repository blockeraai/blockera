// @flow

import {
	bootstrapSizeExtension,
	bootstrapTypographyExtension,
	bootstrapPositionExtension,
	bootstrapBackgroundExtension,
} from '../libs';

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

	bootstrapPositionExtension();
	bootstrapSizeExtension();
	bootstrapTypographyExtension();
	bootstrapBackgroundExtension();

	// TODO: implements other bootstrap functionalities here ...
}
