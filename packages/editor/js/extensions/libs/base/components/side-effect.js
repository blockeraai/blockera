/**
 * External dependencies
 */
import { useEffect, memo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useBlockSideEffects } from '../../../../hooks';

export const SideEffect = memo(
	({ currentTab, currentState, isBlockeraAdvancedMode }) => {
		useEffect(() => {
			const tabs = document.querySelector(
				'.block-editor-block-inspector .block-editor-block-inspector__tabs div:first-child'
			);

			if (tabs && isBlockeraAdvancedMode) {
				tabs.style.display = 'none';
			} else if (tabs) {
				tabs.style = {};
			}
			// eslint-disable-next-line
		}, [isBlockeraAdvancedMode]);

		useBlockSideEffects({
			isBlockeraAdvancedMode,
			currentTab,
			currentState,
		});

		return null;
	}
);
