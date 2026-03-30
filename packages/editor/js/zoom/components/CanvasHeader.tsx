/**
 * Canvas header injected into the editor canvas iframe.
 * Shows responsive breakpoint info and (when active) zoom controls.
 *
 * Visibility is controlled by `syncCanvasHeader` in the parent (not base → show;
 * base + zoom → show; base + 100% → hide).
 *
 * Close behavior:
 * - Zoom only → reset zoom.
 * - Non-base, no zoom → switch to base (postMessage to parent).
 * - Non-base + zoom → reset zoom and switch to base (two postMessages).
 */

import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import type { ReactNode } from 'react';

import { Button } from '@blockera/controls';

import PreviewHeader from '../../preview-mode/header/PreviewHeader';
import { loadZoomFromStorage } from '../utils/storage';

import { BreakpointIcon as BreakpointIconUntyped } from '../../editor/header-ui/components/breakpoints/breakpoint-icon';

type BreakpointInfo = {
	label?: string;
	base?: boolean;
	settings?: { min?: string; max?: string };
};

type BlockeraExtensionsSelect = {
	getExtensionCurrentBlockStateBreakpoint?: () => string;
};

type BlockeraEditorSelect = {
	getBreakpoints?: () => Record<string, BreakpointInfo>;
};

const BreakpointIcon = BreakpointIconUntyped as unknown as (
	props: any
) => ReactNode;

export interface CanvasHeaderProps {
	zoomPercent?: number;
	onResetZoom: () => void;
	onResetBreakpointToBase?: () => void;
}

export default function CanvasHeader({
	zoomPercent,
	onResetZoom,
	onResetBreakpointToBase,
}: CanvasHeaderProps): JSX.Element {
	// Subscribes to blockera/extensions + blockera/editor; re-renders when breakpoint data changes.
	const { breakpointId, breakpointInfo, isBase } = useSelect((select) => {
		const extensionsSelect = select('blockera/extensions') as
			| BlockeraExtensionsSelect
			| undefined;
		const editorSelect = select('blockera/editor') as
			| BlockeraEditorSelect
			| undefined;

		const currentId =
			extensionsSelect?.getExtensionCurrentBlockStateBreakpoint?.() ??
			'desktop';
		const breakpoints = editorSelect?.getBreakpoints?.() ?? {};
		const info: BreakpointInfo = breakpoints[currentId] ?? {};
		const base = info.base === true;

		return {
			breakpointId: currentId,
			breakpointInfo: info,
			isBase: base,
		};
	}, []);

	const effectiveZoomPercent =
		typeof zoomPercent === 'number' && !Number.isNaN(zoomPercent)
			? zoomPercent
			: loadZoomFromStorage();

	const isZoomed = effectiveZoomPercent !== 100;
	const showResetBreakpointToBase = !isZoomed && !isBase;
	const shouldResetZoomAndBreakpointToBase = isZoomed && !isBase;

	const handleClose = (): void => {
		if (shouldResetZoomAndBreakpointToBase) {
			onResetZoom();
			onResetBreakpointToBase?.();
			return;
		}

		if (isZoomed) {
			onResetZoom();
			return;
		}

		if (!isBase) {
			(onResetBreakpointToBase || onResetZoom)();
			return;
		}

		onResetZoom();
	};

	const start = isZoomed ? (
		<Button
			variant="tertiary"
			className="blockera-canvas-header__action-btn blockera-canvas-header__action-btn--reset"
			onClick={onResetZoom}
			aria-label={__('Reset zoom to 100%', 'blockera')}
			showTooltip={true}
			noBorder={true}
		>
			{__('Reset Zoom', 'blockera')}
		</Button>
	) : undefined;

	const center: ReactNode = (
		<div className="blockera-canvas-header__url-bar-content">
			<span
				style={{
					display: 'inline-flex',
					alignItems: 'center',
					gap: 2,
					minWidth: 0,
				}}
			>
				<BreakpointIcon
					name={breakpointId}
					context="canvas"
					tooltip={false}
					showBaseBreakpointFlag={false}
				/>

				<strong
					style={{
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
					}}
				>
					{breakpointInfo?.label ?? breakpointId}
				</strong>
			</span>

			{isZoomed ? (
				<>
					<span>·</span>
					<strong>
						{effectiveZoomPercent}% {__('Zoom', 'blockera')}
					</strong>
				</>
			) : null}
		</div>
	);

	return (
		<PreviewHeader
			content={center}
			start={start}
			end={isZoomed || showResetBreakpointToBase ? undefined : <span />}
			onClose={handleClose}
			dataBlockeraZoomHeader={true}
		/>
	);
}
