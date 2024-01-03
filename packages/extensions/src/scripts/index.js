// @flow

/**
 * Internal dependencies
 */
import { CanvasEditor } from '../components';

export default function (wp, React) {
	const registerPlugin = wp.plugins.registerPlugin;

	registerPlugin('publisher-core-canvas-editor', {
		render() {
			return <CanvasEditor />;
		},
	});
}
