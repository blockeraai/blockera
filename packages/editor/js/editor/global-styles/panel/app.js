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
import { VARIATION_SURFACE_STYLE } from './variation-surfaces';

export default function App(props: Object): MixedElement {
	const { variationSurface = VARIATION_SURFACE_STYLE, ...rest } = props;
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
			<GlobalStylesPanelContextProvider
				value={{ ...rest, variationSurface }}
			>
				<Panel />
			</GlobalStylesPanelContextProvider>
		</ErrorBoundary>
	);
}
