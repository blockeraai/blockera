/**
 * External dependencies
 */
import type { CSSProperties } from 'react';

/**
 * Blockera dependencies
 */
import { ColorIndicator } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { VariablePreview } from '../components/variable-preview';

export interface GradientPreviewProps {
	gradient?: string;
}

const PREVIEW_INDICATOR_SIZE = 18;
const SWATCH_HEIGHT_PX = PREVIEW_INDICATOR_SIZE;
const SWATCH_MAX_WIDTH_PX = 200;

export default function GradientPreview({ gradient }: GradientPreviewProps) {
	const value = String(gradient ?? '').trim();

	if (!value) {
		return (
			<VariablePreview type="gradient">
				<ColorIndicator
					type="gradient"
					value="none"
					size={PREVIEW_INDICATOR_SIZE}
				/>
			</VariablePreview>
		);
	}

	const swatchStyle: CSSProperties = {
		width: '80%',
		maxWidth: SWATCH_MAX_WIDTH_PX,
		height: SWATCH_HEIGHT_PX,
		borderRadius: SWATCH_HEIGHT_PX / 2,
		background: value,
		boxSizing: 'border-box',
		boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.25)',
		flexShrink: 0,
	};

	return (
		<VariablePreview type="gradient">
			<div aria-hidden style={swatchStyle} />
		</VariablePreview>
	);
}
