// @flow

/**
 * External dependencies
 */
import apiFetch from '@wordpress/api-fetch';

export const sender = (error: Object, blockCode: string): void => {
	checkReporterStatus({ error, blockCode }, (response) => {
		if (response.success) {
			if (response.data.isReported) {
				return;
			}

			apiFetch({
				path: 'blockera/v1/telemetry/log-error',
				method: 'POST',
				headers: {
					'X-WP-Nonce': window.wpApiSettings.nonce,
				},
				data: {
					action: 'blockera_log_error',
					...prepareData(error, blockCode),
				},
			})
				.then((response) => {
					console.warn(response);
				})
				.catch(console.error);
		}
	});
};

export const checkReporterStatus = (
	{ error, blockCode }: { error: Object, blockCode: string },
	callback: Function
): void => {
	apiFetch({
		path: 'blockera/v1/telemetry/log-error/status',
		method: 'POST',
		headers: {
			'X-WP-Nonce': window.wpApiSettings.nonce,
		},
		data: {
			action: 'blockera_log_error_status',
			...prepareData(error, blockCode),
		},
	})
		.then((response) => {
			callback(response);
		})
		.catch(console.error);
};

const prepareData = (error: Object, blockCode: string): Object => {
	return {
		error: JSON.stringify({
			message: error.message,
			stack: error.stack,
			file: error.file,
			line: error.line,
		}),
		error_type: 'react',
		block_code: blockCode,
		browser: {
			userAgent: navigator.userAgent,
			platform: navigator.platform,
			language: navigator.language,
			cookieEnabled: navigator.cookieEnabled,
			version: navigator.appVersion,
		},
	};
};
