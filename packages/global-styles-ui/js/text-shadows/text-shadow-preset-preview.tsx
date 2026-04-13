/**
 * External dependencies
 */
import type { CSSProperties } from 'react';
import { memo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { VariablePreview } from '../components/variable-preview';

type Props = {
	shadow: string;
	size?: number;
	/**
	 * Repeater opener: no full-width wrapper — width follows the swatch (`fit-content`).
	 */
	inline?: boolean;
};

const TILE_BG = 'var(--blockera-controls-primary-color)';

/** Module-level so we do not allocate new style objects on every render. */
const INLINE_PREVIEW_CHROME: CSSProperties = {
	minHeight: 0,
	marginBottom: 0,
	border: 'none',
	background: 'transparent',
	padding: 0,
};

const PANEL_PREVIEW_CHROME: CSSProperties = {
	width: '100%',
	padding: '24px 0',
};

/**
 * Preview for a theme.json text-shadow preset (CSS `text-shadow` on sample type).
 */
function TextShadowPresetPreview({ shadow, size = 30, inline = false }: Props) {
	const value = String(shadow ?? '').trim();

	const swatch = (
		<span
			aria-hidden
			style={{
				fontSize: size,
				color: TILE_BG,
				textShadow: value || 'none',
			}}
		>
			Ag
		</span>
	);

	// Pad so blur/spread (paints past glyph bounds) is not clipped by flex/header layout.
	const bleed = inline ? Math.max(6, Math.round(size * 0.5)) : 0;

	if (inline) {
		return (
			<span
				style={{
					display: 'inline-flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexShrink: 0,
					maxWidth: '100%',
					overflow: 'visible',
					boxSizing: 'content-box',
					padding: bleed,
					lineHeight: 0,
				}}
			>
				<VariablePreview
					type="text-shadow"
					style={INLINE_PREVIEW_CHROME}
				>
					{swatch}
				</VariablePreview>
			</span>
		);
	}

	return (
		<VariablePreview type="text-shadow" style={PANEL_PREVIEW_CHROME}>
			{swatch}
		</VariablePreview>
	);
}

export default memo(TextShadowPresetPreview);
