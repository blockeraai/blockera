/**
 * External dependencies
 */
import { useEffect } from '@wordpress/element';
import { useBlockSideEffects } from '../../../hooks';

export function SideEffect({ currentTab, currentState }) {
	useEffect(() => {
		const tabs = document.querySelector(
			'.block-editor-block-inspector .block-editor-block-inspector__tabs .components-tab-panel__tabs'
		);

		if (tabs) {
			tabs.style.display = 'none';
		}
	}, []);

	useBlockSideEffects({
		currentTab,
		currentState,
	});

	return null;
}
