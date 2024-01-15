/**
 * External dependencies
 */
import { useEffect } from '@wordpress/element';

export const useBlockSideEffects = ({ currentTab, currentState }) => {
	useEffect(() => {
		const inspectorTabs = document.querySelector(
			'.block-editor-block-inspector__tabs'
		);

		if (!inspectorTabs) {
			return;
		}

		if ('normal' === currentState) {
			inspectorTabs.classList.remove('publisher-not-allowed');
		} else {
			inspectorTabs.classList.add('publisher-not-allowed');
		}

		if ('settings' === currentTab) {
			inspectorTabs.style.display = 'block';

			return;
		}

		inspectorTabs.style.display = 'none';
	}, [currentTab, currentState]);
};
