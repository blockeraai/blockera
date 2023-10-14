/**
 * External dependencies
 */
import { useEffect } from '@wordpress/element';

export function SideEffect() {
	useEffect(() => {
		const tabs = document.querySelector(
			'.block-editor-block-inspector .block-editor-block-inspector__tabs .components-tab-panel__tabs'
		);

		if (tabs) {
			tabs.style.display = 'none';
		}
	}, []);

	return null;
}
