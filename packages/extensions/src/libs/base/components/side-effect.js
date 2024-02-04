/**
 * External dependencies
 */
import { useEffect, memo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useBlockSideEffects } from '../../../hooks';

export const SideEffect = memo(({ currentTab, currentState }) => {
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
});
