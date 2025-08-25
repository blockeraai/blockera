// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

export const useBackButton = ({
	screenElement,
	setSelectedBlockStyle,
}: {
	screenElement: HTMLElement,
	setSelectedBlockStyle: (blockName: string) => void,
}) => {
	const backButton = screenElement.querySelector('div');

	if (backButton) {
		const h2 = backButton.querySelector('h2');
		h2.innerText = __('Blocks', 'blockera');
		backButton.style.display = 'block';

		backButton?.addEventListener('click', () => {
			setSelectedBlockStyle('');
		});
	}
};
