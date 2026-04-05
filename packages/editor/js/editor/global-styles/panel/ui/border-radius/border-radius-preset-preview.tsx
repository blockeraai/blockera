/**
 * External dependencies
 */
import React from 'react';

/**
 * Blockera dependencies
 */
import { classNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { radiusSizeToPreviewCss } from './utils';

const PREVIEW_SIZE = 24;

const PREVIEW_GRADIENT =
	'linear-gradient(145deg, rgba(56, 88, 233, 0.22), rgba(56, 88, 233, 0.08))';

const EMPTY_PREVIEW_STYLE: React.CSSProperties = {
	display: 'inline-block',
	width: PREVIEW_SIZE,
	height: PREVIEW_SIZE,
	boxSizing: 'border-box',
	borderRadius: 0,
	border: '1px dashed rgba(120, 120, 120, 0.45)',
	background: 'rgba(120, 120, 120, 0.06)',
	flexShrink: 0,
	verticalAlign: 'middle',
};

const PREVIEW_CENTER_WRAP: React.CSSProperties = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	width: '100%',
	boxSizing: 'border-box',
	padding: '10px 12px',
};

export type BorderRadiusPresetPreviewProps = {
	size: string | number;
};

export default function BorderRadiusPresetPreview({
	size,
}: BorderRadiusPresetPreviewProps) {
	const raw = String(size ?? '').trim();

	const inner = !raw ? (
		<span aria-hidden style={EMPTY_PREVIEW_STYLE} />
	) : (
		<span
			aria-hidden
			style={{
				display: 'inline-block',
				width: PREVIEW_SIZE,
				height: PREVIEW_SIZE,
				boxSizing: 'border-box',
				borderRadius: radiusSizeToPreviewCss(size),
				background: PREVIEW_GRADIENT,
				border: '1px solid rgba(56, 88, 233, 0.35)',
				flexShrink: 0,
				verticalAlign: 'middle',
			}}
		/>
	);

	return (
		<div
			className={classNames(
				'global-styles-ui-preset-preview',
				'global-styles-ui-border-radius-preset-preview'
			)}
			style={PREVIEW_CENTER_WRAP}
		>
			{inner}
		</div>
	);
}
