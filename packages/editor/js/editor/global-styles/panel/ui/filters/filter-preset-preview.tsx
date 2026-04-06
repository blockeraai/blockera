/**
 * External dependencies
 */
import React from 'react';
import { memo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { formatPresetItemsSummary, type FilterPresetItem } from './utils';

type Props = {
	items: FilterPresetItem[];
	inline?: boolean;
};

function iconForFirstItem(items: FilterPresetItem[]): string {
	const t = items[0]?.type;
	switch (t) {
		case 'drop-shadow':
			return 'filter-drop-shadow';
		case 'brightness':
			return 'filter-brightness';
		case 'contrast':
			return 'filter-contrast';
		case 'hue-rotate':
			return 'filter-hue-rotate';
		case 'saturate':
			return 'filter-saturate';
		case 'grayscale':
			return 'filter-grayscale';
		case 'invert':
			return 'filter-invert';
		case 'sepia':
			return 'filter-sepia';
		case 'blur':
		default:
			return 'filter-blur';
	}
}

function FilterPresetPreview({ items, inline = false }: Props) {
	const summary = formatPresetItemsSummary(items);
	const hasContent = Boolean(summary);
	const icon = iconForFirstItem(items);

	const inner = (
		<div
			aria-hidden
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: 6,
				maxWidth: '100%',
				minWidth: 0,
				boxSizing: 'border-box',
				padding: inline ? '2px 8px' : '10px 12px',
				borderRadius: 6,
				border: hasContent
					? '1px solid rgba(120, 120, 120, 0.25)'
					: '1px dashed rgba(120, 120, 120, 0.45)',
				background: hasContent
					? 'rgba(120, 120, 120, 0.06)'
					: 'rgba(120, 120, 120, 0.04)',
				flexShrink: inline ? 0 : undefined,
			}}
		>
			<Icon icon={icon} iconSize={16} />
			{hasContent ? (
				<span
					style={{
						fontSize: 11,
						lineHeight: 1.3,
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
						minWidth: 0,
					}}
				>
					{summary}
				</span>
			) : (
				<span style={{ fontSize: 11, opacity: 0.65 }}>—</span>
			)}
		</div>
	);

	if (inline) {
		return (
			<span style={{ display: 'inline-flex', maxWidth: '100%' }}>
				{inner}
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
			{inner}
		</div>
	);
}

export default memo(FilterPresetPreview);
