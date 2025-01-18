// @flow

/**
 * Retrieve iframe content dom element.
 *
 * @return {HTMLElement|void} the iframe content document body element.
 */
export const getIframe = (): HTMLElement | void => {
	// $FlowFixMe
	return document.querySelector('iframe[name="editor-canvas"]');
};

/**
 * Retrieve iframe content tag dom element with css selector.
 *
 * @param {string} selector the css selector.
 *
 * @return {HTMLElement|void} the founded dom element of iframe.
 */
export const getIframeTag = (selector: string): HTMLElement | void => {
	// $FlowFixMe
	return getIframe()?.contentDocument?.querySelector(selector);
};

/**
 * Retrieve url params value.
 *
 * @param {string} param the url param name.
 *
 * @return {string|void} the url param value.
 */
export const getUrlParams = (param: string): string | void => {
	const urlParams = new URLSearchParams(window.location.search);
	const { [param]: value } = Object.fromEntries(urlParams.entries());

	return value;
};
