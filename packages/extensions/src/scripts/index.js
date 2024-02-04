// @flow

import {
	bootstrapSizeExtension,
	bootstrapTypographyExtension,
	bootstrapPositionExtension,
	bootstrapBackgroundExtension,
	bootstrapBorderAndShadowExtension,
} from '../libs';

/**
 * Publisher dependencies
 */
import { CanvasEditor } from '@publisher/editor';

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
