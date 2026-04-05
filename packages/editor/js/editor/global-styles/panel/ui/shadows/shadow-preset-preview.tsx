/**
 * External dependencies
 */
import React from 'react';

type Props = {
	shadow: string;
};

/**
 * Small swatch showing the preset’s `box-shadow` on a tile (mirrors border-radius preview layout).
 */
export default function ShadowPresetPreview({ shadow }: Props) {
	const value = String(shadow ?? '').trim();

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
			<div
				style={{
					width: 56,
					height: 56,
					borderRadius: 6,
					background: 'var(--wp-admin-theme-color, #3858e9)',
					boxShadow: value || undefined,
				}}
			/>
		</div>
	);
}
