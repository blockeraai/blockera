/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { CSSProperties } from 'react';

/**
 * Internal dependencies
 */
import { VariablePreview } from '../../components/variable-preview';
import { useGlobalStyle } from '../../context/global-style-hooks';

const MEASURE_COL_WIDTH_PX = 8;
const ARROW_TIP_PX = 5;
const measureColor = 'var(--blockera-controls-primary-color)';

type LineHeightPreset = {
	size: string;
};

interface LineHeightPreviewProps {
	lineHeight: LineHeightPreset;
}

/**
 * Vertical measure (up/down arrows + dashed span) — mirrors SpacingWidthMeasure
 * but along the line-box height instead of spacing width.
 */
function LineHeightHeightMeasure() {
	const half = MEASURE_COL_WIDTH_PX / 2;

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				width: MEASURE_COL_WIDTH_PX,
				flexShrink: 0,
				alignSelf: 'stretch',
				boxSizing: 'border-box',
				position: 'absolute',
				left: '-16px',
				bottom: '2px',
				height: 'calc(100% - 4px)',
				top: '2px',
				transition: 'var(--blockera-controls-transition)',
			}}
			aria-hidden
		>
			{/* Solid up arrow (tip points up) */}
			<div
				style={{
					width: 0,
					height: 0,
					borderLeft: `${half}px solid transparent`,
					borderRight: `${half}px solid transparent`,
					borderBottom: `${ARROW_TIP_PX}px solid ${measureColor}`,
					flexShrink: 0,
					position: 'absolute',
					top: '-2px',
				}}
			/>
			{/* Dashed span between arrowheads */}
			<div
				style={{
					flex: '1 1 0',
					minHeight: 0,
					borderLeft: `1px dashed ${measureColor}`,
					width: 0,
				}}
			/>
			{/* Solid down arrow (tip points down) */}
			<div
				style={{
					width: 0,
					height: 0,
					borderLeft: `${half}px solid transparent`,
					borderRight: `${half}px solid transparent`,
					borderTop: `${ARROW_TIP_PX}px solid ${measureColor}`,
					flexShrink: 0,
					position: 'absolute',
					bottom: '-2px',
				}}
			/>
		</div>
	);
}

function LineHeightPreview({ lineHeight }: LineHeightPreviewProps) {
	const [typographyStyle] = useGlobalStyle('typography', '');
	const fontFamily =
		typeof typographyStyle.fontFamily === 'string'
			? typographyStyle.fontFamily
			: undefined;

	const rowStyle: CSSProperties = {
		display: 'flex',
		alignItems: 'stretch',
		gap: 0,
		maxWidth: '80%',
		position: 'relative',
	};

	const previewStyle: CSSProperties = {
		lineHeight: lineHeight.size,
		fontFamily,
		backgroundColor:
			'color-mix(in srgb, var(--blockera-controls-primary-color) 20%, #fff 100%)',
		display: 'block',
		flex: '1 1 auto',
		textAlign: 'center',
		padding: '0 24px',
		borderTop: `1px solid ${measureColor}`,
		borderBottom: `1px solid ${measureColor}`,
	};

	return (
		<VariablePreview type="line-height">
			<div style={rowStyle}>
				<LineHeightHeightMeasure />
				<span style={previewStyle}>{__('Aa', 'blockera')}</span>
			</div>
		</VariablePreview>
	);
}

export default LineHeightPreview;
