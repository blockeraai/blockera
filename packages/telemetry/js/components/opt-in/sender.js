// @flow

/**
 * External dependencies
 */
import apiFetch from '@wordpress/api-fetch';

export const sender = (
	prompt: 'ALLOW' | 'SKIP',
	from: 'opt-in' | 'debug' = 'opt-in',
	debugParams?: {
		handleReport: () => void,
		setOptInStatus: (status: 'SKIP' | 'ALLOW') => void,
	}
) => {
	const { handleReport, setOptInStatus } = debugParams || {};
	const data = {
		'opt-in-agreed': prompt,
		action: 'telemetry-opt-in-status',
	};

	apiFetch.use(apiFetch.createNonceMiddleware(window.blockeraNonceField));
	apiFetch({
		path: 'blockera/v1/telemetry/opt-in',
		data,
		method: 'POST',
	}).then((response) => {
		if (response.success) {
			window.blockeraOptInStatus = prompt;

			if ('debug' === from && 'function' === typeof handleReport) {
				handleReport();
				if ('function' === typeof setOptInStatus) {
					setOptInStatus(prompt);
				}
			}
		}
	});
};
