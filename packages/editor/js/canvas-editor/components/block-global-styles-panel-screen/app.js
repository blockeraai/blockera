// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useState } from '@wordpress/element';
import { ErrorBoundary } from 'react-error-boundary';

/**
 * Internal dependencies
 */
import { ErrorBoundaryFallback } from '../../../extensions/hooks/block-settings';
import { GlobalStylesPanelContextProvider } from './context';
import { Panel } from './panel';

export default function App(props: Object): MixedElement {
	const [isReportingErrorCompleted, setIsReportingErrorCompleted] =
		useState(false);

	return (
		<ErrorBoundary
			fallbackRender={({ error }) => (
				<ErrorBoundaryFallback
					{...{
						props,
						error,
						from: 'root',
						isReportingErrorCompleted,
						setIsReportingErrorCompleted,
						fallbackComponent: () => <></>,
					}}
				/>
			)}
		>
			<GlobalStylesPanelContextProvider value={props}>
				<Panel />
			</GlobalStylesPanelContextProvider>
		</ErrorBoundary>
	);
}
