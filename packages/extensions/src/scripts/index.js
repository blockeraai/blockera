// @flow

import {
	bootstrapSizeExtension,
	bootstrapTypographyExtension,
	bootstrapPositionExtension,
	bootstrapBackgroundExtension,
	bootstrapBorderAndShadowExtension,
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
	bootstrapBorderAndShadowExtension();

	// TODO: implements other bootstrap functionalities here ...
}
