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
	const [inlineStyles, setInlineStyles] = useState({});
	const {
		blockeraSettings: {
			earlyAccessLab: { optimizeStyleGeneration },
		},
	} = window;

	useEffect(() => {
		if (!optimizeStyleGeneration) {
			return;
		}

		const el = getIframeTag('body').querySelector(`#block-${clientId}`);

		if (!el) {
			return;
		}

		// Get all elements with inline styles.
		const elementsWithStyles = el.querySelectorAll('[style]');
		const inlineStyles: { [key: string]: Object } = {};

		// Extract inline styles from main element if it has any
		if (el.hasAttribute('style')) {
			inlineStyles[`#block-${clientId}`] = el.getAttribute('style');
			el.removeAttribute('style');
		}

		// Extract and remove inline styles from child elements
		elementsWithStyles.forEach((element) => {
			let elementSelector = classNames(element.getAttribute('class'), {
				'blockera-block': true,
				[`blockera-block-${getSmallHash(clientId)}`]: true,
			}).replace(/\s+/g, '.');
			elementSelector = `.${elementSelector}`;

			if (elementSelector) {
				inlineStyles[elementSelector] = element.getAttribute('style');
				element.removeAttribute('style');
			}
		});

		// Store extracted styles in state if not empty
		if (!isEmpty(inlineStyles)) {
			// Here you would need to implement state management
			// For example using setState or dispatch to store
			// the inlineStyles object

			setInlineStyles(inlineStyles);
		}

		// eslint-disable-next-line
	}, dependencies);

	return inlineStyles;
};
