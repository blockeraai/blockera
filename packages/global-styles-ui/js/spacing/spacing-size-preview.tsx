/**
 * External dependencies
 */
import type { CSSProperties } from 'react';

/**
 * Internal dependencies
 */
import { VariablePreview } from '../components/variable-preview';

const PREVIEW_BAR_HEIGHT_PX = 40;
const MEASURE_ROW_HEIGHT_PX = 8;
const ARROW_TIP_PX = 5;

const measureColor = 'var(--blockera-controls-primary-color)';

interface SpacingSizePreviewProps {
	size: string | undefined;
}

function SpacingWidthMeasure() {
	const half = MEASURE_ROW_HEIGHT_PX / 2;

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				width: '100%',
				marginTop: 6,
				height: MEASURE_ROW_HEIGHT_PX,
				boxSizing: 'border-box',
				position: 'absolute',
				left: 0,
				bottom: '-15px',
			}}
			aria-hidden
		>
			{/* Solid left arrow (tip points left) */}
			<div
				style={{
					width: 0,
					height: 0,
					borderTop: `${half}px solid transparent`,
					borderBottom: `${half}px solid transparent`,
					borderRight: `${ARROW_TIP_PX}px solid ${measureColor}`,
					flexShrink: 0,
				}}
			/>
			{/* Dashed span between arrowheads */}
			<div
				style={{
					flex: '1 1 0',
					minWidth: 0,
					borderTop: `1px dashed ${measureColor}`,
					height: 0,
				}}
			/>
			{/* Solid right arrow (tip points right) */}
			<div
				style={{
					width: 0,
					height: 0,
					borderTop: `${half}px solid transparent`,
					borderBottom: `${half}px solid transparent`,
					borderLeft: `${ARROW_TIP_PX}px solid ${measureColor}`,
					flexShrink: 0,
				}}
			/>
		</div>
	);
}

export default function SpacingSizePreview({ size }: SpacingSizePreviewProps) {
	const widthValue = size?.trim() ? size : '0';

	const sideStyle: CSSProperties = {
		flex: '1 1 0',
		minWidth: 0,
		backgroundColor:
			'var(--blockera-controls-border-color-extra-soft, #dcdcde)',
		height: PREVIEW_BAR_HEIGHT_PX + 'px',
	};

	const centerColumnStyle: CSSProperties = {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'stretch',
		flex: '0 0 auto',
		width: widthValue,
		maxWidth: '100%',
		position: 'relative',
	};

	const centerBarStyle: CSSProperties = {
		width: '100%',
		backgroundColor: 'var(--blockera-controls-primary-color)',
		height: PREVIEW_BAR_HEIGHT_PX + 'px',
		flexShrink: 0,
	};

	return (
		<VariablePreview type="spacing">
			<div style={sideStyle} aria-hidden />

			<div style={centerColumnStyle}>
				<div style={centerBarStyle} aria-hidden />
				<SpacingWidthMeasure />
			</div>

			<div style={sideStyle} aria-hidden />
		</VariablePreview>
	);
}
