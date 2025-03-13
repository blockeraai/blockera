// @flow

/**
 * External dependencies
 */
import type { ComponentType } from 'react';
import { useEffect, useRef } from '@wordpress/element';

/**
 * Hook to detect performance bottlenecks in React components
 *
 * @param {string} componentName - Name of the component being monitored
 * @param {number} renderThreshold - Time threshold in ms to consider a render slow (default: 16ms - 60fps)
 * @param {number} updateThreshold - Time threshold in ms to consider an update slow (default: 100ms)
 */
export const usePerformanceMonitor = (
	componentName: string,
	renderThreshold: number = 16,
	updateThreshold: number = 100
): void => {
	const renderStartTime = useRef(0);
	const updateStartTime = useRef(0);

	useEffect(() => {
		renderStartTime.current = performance.now();

		return () => {
			const renderDuration = performance.now() - renderStartTime.current;
			if (renderDuration > renderThreshold) {
				console.warn(
					`[Performance Warning] Component "${componentName}" took ${renderDuration.toFixed(
						2
					)}ms to render. This is above the ${renderThreshold}ms threshold.`
				);
			}
		};
	});

	useEffect(() => {
		updateStartTime.current = performance.now();

		return () => {
			const updateDuration = performance.now() - updateStartTime.current;
			if (updateDuration > updateThreshold) {
				console.warn(
					`[Performance Warning] Component "${componentName}" took ${updateDuration.toFixed(
						2
					)}ms to update. This is above the ${updateThreshold}ms threshold.`
				);
			}
		};
	}, [componentName]);
};

/**
 * Higher-order component to wrap components for performance monitoring
 *
 * @param {ComponentType} WrappedComponent - Component to monitor
 * @param {string} componentName - Name of the component
 * @param {Object} options - Configuration options
 * @return {ComponentType} - Wrapped component with performance monitoring
 */
export const withPerformanceMonitoring = (
	WrappedComponent: any,
	componentName: string,
	options: {
		renderThreshold?: number,
		updateThreshold?: number,
	} = {}
): any => {
	const { renderThreshold, updateThreshold } = options;

	return (props: any) => {
		usePerformanceMonitor(componentName, renderThreshold, updateThreshold);
		return <WrappedComponent {...props} />;
	};
};

/**
 * Example usage:
 *
 * 1. Basic usage with default thresholds:
 * ```js
 * const MyComponent = withPerformanceMonitoring(
 *   ({ title }) => <h1>{title}</h1>,
 *   'MyComponent'
 * );
 * ```
 *
 * 2. Custom thresholds:
 * ```js
 * const MyHeavyComponent = withPerformanceMonitoring(
 *   ({ data }) => <DataGrid data={data} />,
 *   'MyHeavyComponent',
 *   { renderThreshold: 100, updateThreshold: 50 }
 * );
 * ```
 *
 * 3. Direct hook usage in functional component:
 * ```js
 * const MyComponent = () => {
 *   usePerformanceMonitor('MyComponent', 16, 8);
 *   return <div>Content</div>;
 * };
 * ```
 *
 * 4. Monitoring complex components:
 * ```js
 * const ComplexDashboard = withPerformanceMonitoring(
 *   ({ charts, tables }) => (
 *     <div>
 *       <Charts data={charts} />
 *       <Tables data={tables} />
 *     </div>
 *   ),
 *   'ComplexDashboard',
 *   { renderThreshold: 200, updateThreshold: 100 }
 * );
 * ```
 */
