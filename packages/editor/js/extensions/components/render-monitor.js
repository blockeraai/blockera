// @flow

/**
 * External dependencies
 */
import type { ComponentType } from 'react';
import { useRef, useEffect } from '@wordpress/element';

/**
 * Hook to monitor component re-renders and log why they occurred
 *
 * @param {string} componentName - Name of the component to monitor
 * @param {Object} props - Component props to compare
 */
export const useRenderMonitor = (componentName: string, props: Object) => {
	const prevProps = useRef(null);

	useEffect(() => {
		if (prevProps.current) {
			// Compare current and previous props
			const changedProps = Object.entries(props).reduce(
				(
					changes: { [key: string]: { from: any, to: any } },
					[key, value]
				) => {
					if (prevProps.current[key] !== value) {
						changes[key] = {
							from: prevProps.current[key],
							to: value,
						};
					}
					return changes;
				},
				{}
			);

			if (Object.keys(changedProps).length > 0) {
				/* @debug-ignore */
				// eslint-disable-next-line
				console.group(
					`[${componentName}] Re-render caused by prop changes:`
				);
				// eslint-disable-next-line
				// $FlowFixMe
				Object.entries(changedProps).forEach(([prop, { from, to }]) => {
					// eslint-disable-next-line
					/* @debug-ignore */
					console.log(`${prop}:`, { from, to });
				});
				/* @debug-ignore */
				// eslint-disable-next-line
				console.groupEnd();
			}
		}

		prevProps.current = props;
	});
};

/**
 * HOC to wrap components for render monitoring
 *
 * @param {ComponentType} WrappedComponent - Component to monitor
 * @param {string} componentName - Name to use in logging
 */
export const withRenderMonitor = (
	WrappedComponent: any,
	componentName: string
): ComponentType<any> => {
	return (props: Object) => {
		useRenderMonitor(componentName, props);
		return <WrappedComponent {...props} />;
	};
};
