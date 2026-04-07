/**
 * External dependencies
 */
import React from 'react';

type Props = {
	/** Combined CSS `box-shadow` (layers joined with ", ") */
	shadow: string;
	width?: number;
	height?: number;
	borderRadius?: number;
	/**
	 * Repeater opener: no full-width wrapper — width follows the swatch (`fit-content`).
	 */
	inline?: boolean;
};

const TILE_BG = 'var(--wp-admin-theme-color, #3858e9)';

/**
 * Swatch for the preset’s `box-shadow` on a tile. Panel uses full width; `inline` sizes to the swatch only.
 */
export default function ShadowPresetPreview({
	shadow,
	width = 56,
	height = 56,
	borderRadius = 6,
	inline = false,
}: Props) {
	const value = String(shadow ?? '').trim();

	const swatch = !value ? (
		<div
			aria-hidden
			style={{
				width,
				height,
				borderRadius,
				boxSizing: 'border-box',
				border: '1px dashed rgba(120, 120, 120, 0.45)',
				background: 'rgba(120, 120, 120, 0.06)',
				flexShrink: 0,
			}}
		/>
	) : (
		<div
			aria-hidden
			style={{
				width,
				height,
				borderRadius,
				boxSizing: 'border-box',
				flexShrink: 0,
				background: TILE_BG,
				boxShadow: value,
			}}
		/>
	);

	if (inline) {
		// Pad so box-shadow (which paints outside the 12×12 tile) isn’t clipped by flex/header layout.
		const bleed = Math.max(6, Math.round(Math.max(width, height) * 0.5));
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
				{swatch}
			</span>
		);
	}

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				padding: '12px 0',
				width: '100%',
			}}
		>
			{swatch}
		</div>
	);
}
