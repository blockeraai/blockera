/**
 * External dependencies
 */
import { useEffect, memo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useBlockSideEffects } from '../../../hooks';

export const SideEffect = memo(({ currentTab, currentState, isActive }) => {
	useEffect(() => {
		const tabs = document.querySelector(
			'.block-editor-block-inspector .block-editor-block-inspector__tabs .components-tab-panel__tabs'
		);

		if (tabs) {
			tabs.style.display = 'none';
		}
	}, []);

	useBlockSideEffects({
		isActive,
		currentTab,
		currentState,
	});

	return null;
});
