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
import { getGlobalStylesGradientPresetPreviewDeclarations } from '../preset-preview/injected-helpers';
import {
	type PresetCanvasPreviewPayload,
	usePresetRowCanvasPreview,
} from '../components/preset-row-preview-inject';
import { getPresetRepeaterHeaderOnClick } from '../components/preset-repeater-header-click';
import { useCanEditGlobalStyles } from '../components/use-global-styles-preset-edit';
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
	const canEditGlobalStyles = useCanEditGlobalStyles();
	const getPayload = useCallback((): PresetCanvasPreviewPayload | null => {
		const declarations = getGlobalStylesGradientPresetPreviewDeclarations(
			variable?.gradient
		);
		if (!declarations) {
			return null;
		}
		return { kind: 'declarations', declarations };
	}, [variable?.gradient]);

	const previewHandlers = usePresetRowCanvasPreview(getPayload);

	return (
		<div
			className={controlInnerClassNames('repeater-group-header')}
			onClick={getPresetRepeaterHeaderOnClick({
				item: variable,
				isOpen,
				setOpen,
				isOpenPopoverEvent,
				allowEditPopover: canEditGlobalStyles,
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
