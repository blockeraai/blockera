// @flow

/**
 * External dependencies
 */
import apiFetch from '@wordpress/api-fetch';

export const sender = (error: Object, blockCode: Object): void => {
	apiFetch({
		path: 'blockera/v1/telemetry/log-error',
		method: 'POST',
		data: {
			action: 'blockera_log_error',
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
		},
	})
		.then((response) => {
			console.warn(response);
		})
		.catch(console.error);
};
