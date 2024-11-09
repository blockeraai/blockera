// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { createRoot } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';
import { store as coreDataStore } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import { OptInModal } from './components/opt-in';
import { dispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

const App = (): MixedElement => {
	if ('1' !== window.blockeraTelemetryIsOff) {
		return <></>;
	}

	return <OptInModal kind={'blockera/v1'} name={'telemetry/opt-in'} />;
};

window.onload = () => {
	domReady(() => {
		const { addEntities } = dispatch(coreDataStore);

		addEntities([
			{
				label: __('Blockera Opt-In', 'blockera'),
				kind: 'blockera/v1',
				name: 'telemetry/opt-in',
				baseURL: '/blockera/v1/telemetry/opt-in',
			},
		]);

		const rootElement = document.querySelector(
			'#blockera-telemetry-container'
		);
		const root = createRoot(rootElement);

		root.render(<App />);
	});
};
