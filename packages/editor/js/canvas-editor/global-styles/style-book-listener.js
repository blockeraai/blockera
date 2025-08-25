// @flow

/**
 * Internal dependencies
 */
import { sharedListenerCallback } from './listener-callback';

const getBlockTypeSelector = (blockName: string): string => {
	return `div[id="example-${blockName}"]`;
};

export const styleBookListener = (blockTypes: Array<Object>): void => {
	setTimeout(() => {
		blockTypes.forEach((blockType) => {
			document
				.querySelector(styleBookSelector)
				?.contentWindow?.document?.querySelector(
					getBlockTypeSelector(blockType.name)
				)
				?.addEventListener('click', () =>
					sharedListenerCallback(blockType.name)
				);
		});
	}, 100);
};

export const styleBookSelector: string = 'iframe.edit-site-style-book__iframe';
