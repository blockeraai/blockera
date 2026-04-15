/**
 * External dependencies
 */
import React from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { ColorIndicator } from '@blockera/controls';
import { controlInnerClassNames } from '@blockera/classnames';
/**
 * Internal dependencies
 */
import { getGlobalStylesGradientPresetPreviewCss } from '../preset-preview/injected-helpers';
import { usePresetRowPreviewInject } from '../components/preset-row-preview-inject';
import { getPresetRepeaterHeaderOnClick } from '../components/preset-repeater-header-click';
import type { VariableType } from '../components/types';

export type GradientPresetOpenerProps = {
	itemId: string;
	isOpen: boolean;
	children?: React.ReactNode;
	setOpen: (isOpen: boolean) => boolean;
	item: VariableType & { gradient?: string };
	isOpenPopoverEvent: (event: React.MouseEvent) => boolean;
};

export function GradientPresetOpener({
	itemId,
	isOpen,
	setOpen,
	children,
	item: variable,
	isOpenPopoverEvent,
}: GradientPresetOpenerProps) {
	const getPreviewDeclarations = useCallback(
		() => getGlobalStylesGradientPresetPreviewCss(variable?.gradient),
		[variable?.gradient]
	);

	const previewHandlers = usePresetRowPreviewInject(getPreviewDeclarations);

	return (
		<div
			className={controlInnerClassNames('repeater-group-header')}
			onClick={getPresetRepeaterHeaderOnClick({
				item: variable,
				isOpen,
				setOpen,
				isOpenPopoverEvent,
			})}
			onMouseEnter={previewHandlers.onMouseEnter}
			onMouseLeave={previewHandlers.onMouseLeave}
			aria-label={sprintf(
				/* translators: %d: The item number (1-based index) */
				__('Gradient preset %d', 'blockera'),
				Number(itemId) + 1
			)}
			data-cy="gradient-repeater-item-header"
		>
			<span
				className={controlInnerClassNames('header-icon')}
				data-cy="header-icon"
			>
				{variable?.gradient ? (
					<ColorIndicator
						type="gradient"
						value={variable.gradient}
						size={18}
					/>
				) : (
					<ColorIndicator type="color" value="none" size={18} />
				)}
			</span>

			<span
				className={controlInnerClassNames('header-label')}
				data-cy="header-label"
			>
				{variable?.name}
			</span>

			{children}
		</div>
	);
}
