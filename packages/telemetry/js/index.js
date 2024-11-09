// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { createRoot } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { OptInModal } from './components/opt-in';

const App = (): MixedElement => {
	if ('1' !== window.blockeraTelemetryIsOff) {
		return <></>;
	}

	return <OptInModal kind={'blockera/v1'} name={'telemetry/opt-in'} />;
};

window.onload = () => {
	const rootElement = document.querySelector('#blockera-telemetry-container');
	const root = createRoot(rootElement);

	root.render(<App />);
};
