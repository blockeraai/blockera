// @flow

/**
 * External dependencies
 */
import apiFetch from '@wordpress/api-fetch';

export const sender = (
	prompt: 'ALLOW' | 'SKIP',
	debugParams?: {
		handleError: (error: Object) => void,
		handleResponse: (response: Object) => void,
	}
) => {
	const { handleError = () => {}, handleResponse = () => {} } =
		debugParams || {};
	const data = {
		'opt-in-agreed': prompt,
		action: 'telemetry-opt-in-status',
	};

	apiFetch.use(apiFetch.createNonceMiddleware(window.blockeraNonceField));
	apiFetch({
		path: 'blockera/v1/telemetry/opt-in',
		data,
		method: 'POST',
	})
		.then(handleResponse)
		.catch(handleError);
};
