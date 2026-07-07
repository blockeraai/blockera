/**
 * External dependencies
 */
import type { ReactNode } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { classNames, componentInnerClassNames } from '@blockera/classnames';

export type PresetVariationsLayoutProps = {
	/**
	 * When true, content is the full editor (e.g. inside repeater popover fields).
	 * When false, content is the compact repeater row (e.g. `repeaterItemVariations`).
	 */
	editable: boolean;
	children: ReactNode;
};

/**
 * Shared chrome for preset “variations” blocks (color shades, etc.).
 */
export function PresetVariationsLayout({
	editable,
	children,
}: PresetVariationsLayoutProps) {
	return (
		<div
			className={classNames(
				componentInnerClassNames('preset-variations-layout'),
				{
					'is-editable': editable,
					'is-compact': !editable,
				}
			)}
			style={{
				border: '1px solid var(--blockera-controls-border-color-soft)',
				borderRadius: 2,
				padding: editable ? '12px 14px' : '10px 12px',
			}}
			aria-label={__('Preset variations', 'blockera')}
		>
			{children}
		</div>
	);
}
