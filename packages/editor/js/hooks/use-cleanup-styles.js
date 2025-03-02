// @flow

/**
 * External dependencies
 */
import { useState, useEffect } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { isEmpty, getSmallHash, getIframeTag } from '@blockera/utils';
import { classNames } from '@blockera/classnames';

export const useCleanupStyles = (
	{ clientId }: { clientId: string },
	dependencies: Array<any>
): Object => {
	const [inlineStyles, setInlineStyles] = useState([]);
	const {
		blockeraSettings: {
			earlyAccessLab: { optimizeStyleGeneration },
		},
	} = window;

	useEffect(() => {
		if (!optimizeStyleGeneration) {
			return;
		}

		const iframeBody = getIframeTag('body');

		if (!iframeBody) {
			return;
		}

		const el = iframeBody.querySelector(`#block-${clientId}`);

		if (!el) {
			return;
		}

		// Get all elements with inline styles.
		const elementsWithStyles = el.querySelectorAll(
			'[style]:not([data-type]):not([data-type] *)'
		);
		const styles: Array<{ [key: string]: Object }> = [];

		const prepareInlineStyles = (
			inlineStyle: string,
			elementSelector: string
		): void => {
			// Appending inline style.
			styles.push({
				selector: elementSelector,
				declarations: inlineStyle
					.split(';')
					.filter((item) => item.trim())
					.map((item) => item.trim() + ';'),
			});
		};

		// Extract inline styles from main element if it has any.
		if (el.hasAttribute('style')) {
			prepareInlineStyles(el.getAttribute('style'), `#block-${clientId}`);

			// Remove the inline style of parent element.
			el.removeAttribute('style');
		}

		// Extract and remove inline styles from child elements.
		elementsWithStyles.forEach((element) => {
			let elementSelector = classNames(element.getAttribute('class'), {
				'blockera-block': true,
				[`blockera-block-${getSmallHash(clientId)}`]: true,
			}).replace(/\s+/g, '.');
			elementSelector = `.${elementSelector}`;

			if (elementSelector) {
				prepareInlineStyles(
					element.getAttribute('style'),
					elementSelector
				);

				// Remove the inline style of child element.
				element.removeAttribute('style');
			}
		});

		// Store extracted styles in state if not empty.
		if (!isEmpty(styles)) {
			setInlineStyles(styles);
		}

		// eslint-disable-next-line
	}, dependencies);

	return inlineStyles;
};
