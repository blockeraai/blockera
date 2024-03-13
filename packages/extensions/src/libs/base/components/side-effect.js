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
			'.block-editor-block-inspector .block-editor-block-inspector__tabs div:first-child'
		);

		if (tabs && isActive) {
			tabs.style.display = 'none';
		} else if (tabs) {
			tabs.style = {};
		}
		// eslint-disable-next-line
	}, [isActive]);

	useBlockSideEffects({
		isActive,
		currentTab,
		currentState,
	});

	return null;
});
