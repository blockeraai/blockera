/**
 * Type declarations for SVG imports.
 *
 * In editor code, SVGs are imported as React components (SVGR-style).
 */
declare module '*.svg' {
	import type { FC, SVGProps } from 'react';

	const Component: FC<SVGProps<SVGSVGElement>>;
	export default Component;
}
