// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { OptInModal } from './components/opt-in';

const App = (): MixedElement => {
	if ('1' !== window.blockeraTelemetryIsOff) {
		return <></>;
	}

	return <OptInModal path={'blockera/v1/telemetry/opt-in'} />;
};

window.onload = () => {
	domReady(() => {
		const rootElement = document.querySelector(
			'#blockera-telemetry-container'
		);
		const root = createRoot(rootElement);

		root.render(<App />);
	});
};
