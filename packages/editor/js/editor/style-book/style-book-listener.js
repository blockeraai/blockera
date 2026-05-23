// @flow

/**
 * Blockera dependencies
 */
import {
	getDualGlobalStylesSelector,
	getStyleBookBlockExampleSelector,
	queryStyleBookIframe,
} from '@blockera/global-styles-ui/panel-override/selectors';
import { BLOCKERA_GLOBAL_STYLES_UI_BODY_CLASS } from '@blockera/global-styles-ui/panel-override/override-classes';

/**
 * Internal dependencies
 */
import { sharedListenerCallback } from '../global-styles-actions-for-blocks/listener-callback';

const attachBlockExampleListeners = (
	blockTypes: Array<Object>,
	doc: Document
): void => {
	blockTypes.forEach((blockType) => {
		if (!blockType?.name) {
			return;
		}

		const example = doc.querySelector(
			getStyleBookBlockExampleSelector(blockType.name)
		);

		if (
			!example ||
			example.hasAttribute('data-blockera-style-book-bound')
		) {
			return;
		}

		example.setAttribute('data-blockera-style-book-bound', 'true');
		example.addEventListener(
			'click',
			() => {
				document.body?.classList?.add(
					BLOCKERA_GLOBAL_STYLES_UI_BODY_CLASS
				);
				document.body?.setAttribute(
					'data-test',
					BLOCKERA_GLOBAL_STYLES_UI_BODY_CLASS
				);
				sharedListenerCallback(blockType.name);
			},
			{ once: true }
		);
	});
};

export const styleBookListener = (blockTypes: Array<Object>): void => {
	const iframe = queryStyleBookIframe();

	if (!iframe) {
		return;
	}

	const run = (): void => {
		const doc = iframe.contentDocument;

		if (!doc) {
			return;
		}

		attachBlockExampleListeners(blockTypes, doc);
	};

	if (iframe.contentDocument?.readyState === 'complete') {
		run();
		return;
	}

	iframe.addEventListener('load', run, { once: true });
};

export const styleBookSelector: string =
	getDualGlobalStylesSelector('styleBookIframe');
