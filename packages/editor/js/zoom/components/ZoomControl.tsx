/**
 * Zoom control component with button and popover.
 */

import { useState, useEffect, useRef, useCallback } from '@wordpress/element';
import {
	DropdownMenu,
	MenuGroup,
	MenuItem,
	Icon,
	Fill,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { displayShortcutList } from '@wordpress/keycodes';
import type { ReactNode } from 'react';
import { chevronDown } from '@wordpress/icons';

/**
 * Blockera dependencies
 */
import { ControlContextProvider, InputControl } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { useZoom } from '../hooks/useZoom';
import { useZoomKeyboard } from '../hooks/useZoomKeyboard';
import { useIframeObserver } from '../hooks/useIframeObserver';
import { useIframeHeight } from '../hooks/useIframeHeight';
import { getEditorCanvasIframe, getIframeDocument } from '../utils/iframeUtils';
import {
	DEFAULT_ZOOM,
	MIN_ZOOM,
	MAX_ZOOM,
	MIN_IFRAME_HEIGHT,
	MAX_REASONABLE_HEIGHT,
} from '../utils/constants';
import type { ZoomControlProps } from '../types';

/**
 * Apply height to iframe based on content height and zoom level.
 * Prevents double scrollbars by setting iframe height to actual content height.
 */
function applyIframeHeight(
	height: number,
	zoomPercent: number,
	initialHeight?: number | null
): void {
	const iframe = getEditorCanvasIframe();
	if (!iframe) {
		return;
	}

	// If we have an initial height and the received height is smaller, use initial height
	// This prevents the iframe from shrinking below the initial height set before zoom
	const effectiveHeight =
		initialHeight !== null &&
		initialHeight !== undefined &&
		initialHeight > height
			? initialHeight
			: height;

	// If zoom is at 100%, remove height constraint and let WordPress handle it
	if (zoomPercent === DEFAULT_ZOOM) {
		iframe.style.removeProperty('height');
		iframe.style.removeProperty('overflow');

		// Ensure overflow is set to auto to allow scrolling
		requestAnimationFrame(() => {
			if (!iframe.classList.contains('is-zoomed-out')) {
				iframe.style.setProperty('overflow', 'auto', 'important');
			}
		});

		return;
	}

	// When zoomed, set iframe height to content height
	// CSS transform scale is visual only - it doesn't change DOM measurements
	// So iframe height should match content height exactly
	// Use effectiveHeight which already has initial height protection applied
	if (effectiveHeight > 0 && effectiveHeight <= MAX_REASONABLE_HEIGHT) {
		const finalHeight = Math.max(MIN_IFRAME_HEIGHT, effectiveHeight);

		// Temporarily pause iframe updates to prevent feedback loop
		const iframeDoc = getIframeDocument(iframe);
		if (iframeDoc?.defaultView) {
			iframeDoc.defaultView.postMessage(
				{ type: 'BLOCKERA_ZOOM_PAUSE_UPDATES', pause: true },
				'*'
			);
		}

		// Set height with !important to override any WordPress styles
		iframe.style.setProperty('height', `${finalHeight}px`, 'important');
		iframe.setAttribute('scrolling', 'no');
		iframe.style.setProperty('overflow', 'hidden', 'important');

		// Resume iframe updates after a delay
		setTimeout(() => {
			if (iframeDoc?.defaultView) {
				iframeDoc.defaultView.postMessage(
					{ type: 'BLOCKERA_ZOOM_PAUSE_UPDATES', pause: false },
					'*'
				);
			}
		}, 1000);
	}
}

/**
 * ZoomControl component that renders in the editor header.
 * Provides zoom controls and manages iframe zoom state.
 *
 * @param props - Component props.
 * @return The zoom control portal or null if container not found.
 */
export default function ZoomControl({
	className = '',
}: ZoomControlProps): ReactNode {
	const {
		zoomPercent,
		setZoomPercent,
		resetZoom,
		zoomIn,
		zoomOut,
		zoomToFit,
		zoomTo50,
		initialHeight,
	} = useZoom();

	// Keep ref in sync with zoomPercent for use in callbacks
	const zoomPercentRef = useRef(zoomPercent);
	const [currentInitialHeight, setCurrentInitialHeight] = useState<
		number | null
	>(null);

	useEffect(() => {
		zoomPercentRef.current = zoomPercent;
	}, [zoomPercent]);

	// Sync React state when zoom changes from preview iframe (same-tab localStorage has no storage event)
	useEffect(() => {
		const onSync = (e: Event): void => {
			const detail = (e as CustomEvent<{ zoom: number }>).detail;
			if (
				detail &&
				typeof detail.zoom === 'number' &&
				!Number.isNaN(detail.zoom)
			) {
				setZoomPercent(detail.zoom);
			}
		};
		const onFitRequest = (): void => {
			zoomToFit();
		};
		window.addEventListener('blockera-editor-zoom-sync', onSync);
		window.addEventListener(
			'blockera-editor-zoom-to-fit-request',
			onFitRequest
		);
		return () => {
			window.removeEventListener('blockera-editor-zoom-sync', onSync);
			window.removeEventListener(
				'blockera-editor-zoom-to-fit-request',
				onFitRequest
			);
		};
	}, [setZoomPercent, zoomToFit]);

	// Update initial height when zoom hook provides it
	useEffect(() => {
		setCurrentInitialHeight(
			initialHeight !== null && initialHeight !== undefined
				? initialHeight
				: null
		);
	}, [initialHeight]);

	// Setup keyboard shortcuts
	useZoomKeyboard({
		zoomPercent,
		onZoomChange: setZoomPercent,
		onZoomToFit: zoomToFit,
		enabled: true,
	});

	// Memoize callbacks to prevent unnecessary re-renders
	const handleIframeLoad = useCallback(() => {
		// Iframe loaded, ensure zoom is applied
		// Use setTimeout to ensure iframe is fully ready
		setTimeout(() => {
			setZoomPercent(zoomPercentRef.current);
		}, 100);
	}, [setZoomPercent]);

	const handleHeightChange = useCallback(
		(height: number) => {
			// onHeightChange already receives the effective height (with initial height protection applied)
			applyIframeHeight(
				height,
				zoomPercentRef.current,
				currentInitialHeight
			);
		},
		[currentInitialHeight]
	);

	const handleSetInitialHeight = useCallback((height: number) => {
		setCurrentInitialHeight(height);
	}, []);

	// Observe iframe lifecycle
	useIframeObserver({
		onIframeLoad: handleIframeLoad,
	});

	// Manage iframe height based on content
	useIframeHeight({
		zoomPercent,
		onHeightChange: handleHeightChange,
		enabled: true,
		initialHeight: currentInitialHeight,
		onSetInitialHeight: handleSetInitialHeight,
	});

	// Format shortcut for display in MenuItem
	const formatShortcut = (modifier: string, character: string): string => {
		const shortcut = displayShortcutList[modifier](character);
		return Array.isArray(shortcut) ? shortcut.join('') : shortcut;
	};

	// Parse value from InputControl (e.g. "75%") and apply zoom
	const handleZoomInputChange = useCallback(
		(newValue: string | number): void => {
			const str = String(newValue).replace(/%$/, '');
			const num = parseInt(str, 10);
			if (!isNaN(num) && num >= MIN_ZOOM && num <= MAX_ZOOM) {
				setZoomPercent(num);
			}
		},
		[setZoomPercent]
	);

	return (
		<Fill name="blockera/slots/editor-header-settings">
			<div className="blockera-zoom-control-wrapper">
				<DropdownMenu
					icon={null}
					label={__('Zoom', 'blockera')}
					toggleProps={{
						className:
							className +
							` ${
								zoomPercent !== DEFAULT_ZOOM ? 'is-zoomed' : ''
							}`,
						size: 'compact' as const,
						children: (
							<>
								<span>{Math.round(zoomPercent)}%</span>
								<Icon icon={chevronDown} size={16} />
							</>
						),
					}}
					popoverProps={{
						placement: 'bottom-end',
					}}
				>
					{({ onClose }) => (
						<>
							<MenuGroup>
								{/* Zoom level input: Blockera InputControl with % unit only */}
								<div style={{ padding: '0 8px 8px 8px' }}>
									<ControlContextProvider
										value={{
											name: 'blockera-zoom-level',
											value: `${Math.round(zoomPercent)}%`,
										}}
									>
										<InputControl
											label={__('Zoom level', 'blockera')}
											unitType="percent"
											units={[
												{
													value: '%',
													label: '%',
													format: 'number',
												},
											]}
											min={MIN_ZOOM}
											max={MAX_ZOOM}
											size="small"
											drag={false}
											arrows={true}
											onChange={handleZoomInputChange}
										/>
									</ControlContextProvider>
								</div>
							</MenuGroup>

							<MenuGroup>
								<MenuItem
									onClick={() => {
										zoomIn();
										onClose();
									}}
									shortcut={formatShortcut('primary', '=')}
								>
									{__('Zoom in', 'blockera')}
								</MenuItem>
								<MenuItem
									onClick={() => {
										zoomOut();
										onClose();
									}}
									shortcut={formatShortcut('primary', '-')}
								>
									{__('Zoom out', 'blockera')}
								</MenuItem>
								<MenuItem
									onClick={() => {
										zoomToFit();
										onClose();
									}}
									shortcut={formatShortcut(
										'primaryShift',
										'1'
									)}
								>
									{__('Zoom to fit', 'blockera')}
								</MenuItem>
								<MenuItem
									onClick={() => {
										zoomTo50();
										onClose();
									}}
								>
									{__('Zoom to 50%', 'blockera')}
								</MenuItem>
								<MenuItem
									onClick={() => {
										resetZoom();
										onClose();
									}}
									shortcut={formatShortcut('primary', '0')}
								>
									{__('Zoom to 100%', 'blockera')}
								</MenuItem>
							</MenuGroup>
						</>
					)}
				</DropdownMenu>
			</div>
		</Fill>
	);
}
