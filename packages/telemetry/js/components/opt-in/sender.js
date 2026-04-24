// @flow

/**
 * External dependencies
 */
import apiFetch from '@wordpress/api-fetch';

type SenderOptions = {
	shareUsageData?: boolean,
	emailUpdates?: boolean,
	handleError?: (error: Object) => void,
	handleResponse?: (response: Object) => void,
};

export const sender = (prompt: 'ALLOW' | 'SKIP', options?: SenderOptions) => {
	const {
		shareUsageData = true,
		emailUpdates = true,
		handleError = () => {},
		handleResponse = () => {},
	} = options || {};

	const data: Object = {
		'opt-in-agreed': prompt,
		action: 'telemetry-opt-in-status',
	};

	if ('ALLOW' === prompt) {
		data.share_usage_data = shareUsageData;
		data.email_updates = emailUpdates;
	}

	apiFetch.use(apiFetch.createNonceMiddleware(window.blockeraNonceField));
	apiFetch({
		path: 'blockera/v1/telemetry/opt-in',
		data,
		method: 'POST',
	})
		.then(handleResponse)
		.catch(handleError);
};
