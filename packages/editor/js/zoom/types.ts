/**
 * Type definitions for the zoom feature.
 */

/**
 * Zoom percentage value (10-200).
 */
export type ZoomPercent = number;

/**
 * Message sent from iframe to parent window with content height.
 */
export interface IframeHeightMessage {
	type: 'IFRAME_HEIGHT';
	height: number;
}

/**
 * Message sent from parent to iframe to pause/resume height updates.
 */
export interface PauseUpdatesMessage {
	type: 'BLOCKERA_ZOOM_PAUSE_UPDATES';
	pause: boolean;
}

/**
 * Union type for all postMessage types used by zoom feature.
 */
export type ZoomMessage = IframeHeightMessage | PauseUpdatesMessage;

/**
 * Props for ZoomControl component.
 */
export interface ZoomControlProps {
	/** Optional className for styling */
	className?: string;
}

/**
 * Return type for useZoom hook.
 */
export interface UseZoomReturn {
	/** Current zoom percentage */
	zoomPercent: ZoomPercent;
	/** Set zoom percentage */
	setZoomPercent: (zoom: ZoomPercent) => void;
	/** Reset zoom to default (100%) */
	resetZoom: () => void;
	/** Zoom in by step amount */
	zoomIn: () => void;
	/** Zoom out by step amount */
	zoomOut: () => void;
	/** Zoom to fit content inside viewport with 20px gap */
	zoomToFit: () => void;
	/** Zoom to 50% */
	zoomTo50: () => void;
	/** Initial height set when zooming (for preventing shrinking) */
	initialHeight: number | null;
}

/**
 * Return type for useIframeHeight hook.
 */
export interface UseIframeHeightReturn {
	/** Current content height from iframe */
	contentHeight: number | null;
	/** Manually trigger height recalculation */
	recalculateHeight: () => void;
}

/**
 * Options for useIframeObserver hook.
 */
export interface UseIframeObserverOptions {
	/** Callback when iframe is detected */
	onIframeLoad?: (iframe: HTMLIFrameElement) => void;
	/** Callback when iframe is replaced */
	onIframeReplace?: (iframe: HTMLIFrameElement) => void;
}

/**
 * Return type for useIframeObserver hook.
 */
export interface UseIframeObserverReturn {
	/** Current iframe element or null */
	iframe: HTMLIFrameElement | null;
	/** Iframe document or null */
	iframeDocument: Document | null;
}

/**
 * Options for useZoomKeyboard hook.
 */
export interface UseZoomKeyboardOptions {
	/** Current zoom percentage */
	zoomPercent: ZoomPercent;
	/** Callback when zoom should change */
	onZoomChange: (zoom: ZoomPercent) => void;
	/** Callback for zoom to fit action */
	onZoomToFit?: () => void;
	/** Whether keyboard shortcuts are enabled */
	enabled?: boolean;
}
