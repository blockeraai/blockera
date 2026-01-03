/**
 * Type declarations for overlayscrollbars package.
 * These are stub declarations to allow TypeScript compilation.
 * Install the actual package: npm install overlayscrollbars
 */

declare module 'overlayscrollbars' {
	export interface OverlayScrollbarsOptions {
		scrollbars?: {
			visibility?: 'auto' | 'visible' | 'hidden' | 'scroll' | 'hover';
			autoHide?: 'never' | 'scroll' | 'leave' | 'move';
			autoHideDelay?: number;
			dragScrolling?: boolean;
			clickScrolling?: boolean;
			touchSupport?: boolean;
			snapHandle?: boolean;
		};
		overflow?: {
			x?: 'auto' | 'scroll' | 'hidden' | 'visible';
			y?: 'auto' | 'scroll' | 'hidden' | 'visible';
		};
		textarea?: {
			inheritedAttrs?: string | string[];
			dynWidth?: boolean;
			dynHeight?: boolean;
		};
	}

	export interface OverlayScrollbarsComponent {
		destroy: () => void;
		update: (options?: OverlayScrollbarsOptions) => void;
		scroll: (position: { x?: number; y?: number }) => void;
		elements: () => {
			viewport: HTMLElement;
			content: HTMLElement;
			scrollbarHorizontal: HTMLElement;
			scrollbarVertical: HTMLElement;
		};
		options: (options?: OverlayScrollbarsOptions) => OverlayScrollbarsOptions;
		state: () => unknown;
		plugin: (plugin: unknown) => unknown;
	}

	export interface OverlayScrollbarsStatic {
		new (
			element: HTMLElement | { target: HTMLElement; elements: { viewport: HTMLElement } },
			options?: OverlayScrollbarsOptions
		): OverlayScrollbarsComponent;
	}

	const OverlayScrollbars: OverlayScrollbarsStatic;
	export default OverlayScrollbars;
	export { OverlayScrollbars };
}
