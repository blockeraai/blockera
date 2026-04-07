/**
 * External dependencies
 */
import React from 'react';
import { memo } from '@wordpress/element';

type Props = {
	shadow: string;
	width?: number;
	height?: number;
	borderRadius?: number;
	inline?: boolean;
};

const TILE_BG = 'var(--wp-admin-theme-color, #3858e9)';

/**
 * Preview for a theme.json text-shadow preset (CSS `text-shadow` on sample type).
 */
function TextShadowPresetPreview({
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
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
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
				background: '#f0f0f1',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				overflow: 'visible',
			}}
		>
			<span
				style={{
					fontSize: Math.min(width, height) * 0.42,
					fontWeight: 700,
					lineHeight: 1,
					color: TILE_BG,
					textShadow: value,
				}}
			>
				Ag
			</span>
		</div>
	);

	if (inline) {
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

export default memo(TextShadowPresetPreview);
