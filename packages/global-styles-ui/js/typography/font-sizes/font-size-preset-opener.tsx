/**
 * External dependencies
 */
import React from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
/**
 * Internal dependencies
 */
import { getGlobalStylesFontSizePresetPreviewAttributes } from '../../preset-preview/injected-helpers';
import {
	type PresetCanvasPreviewPayload,
	usePresetRowCanvasPreview,
} from '../../components/preset-row-preview-inject';
import { getPresetRepeaterHeaderOnClick } from '../../components/preset-repeater-header-click';
import { useCanEditGlobalStyles } from '../../components/use-global-styles-preset-edit';
import { usePresetTaxonomyHeaderLabel } from '../../components';
import type { VariableType } from '../../components/types.ts';

export type FontSizePresetOpenerProps = {
	itemId: string;
	isOpen: boolean;
	children?: React.ReactNode;
	contextType?: 'repeater' | 'taxonomy';
	setOpen: (isOpen: boolean) => boolean;
	item: VariableType & { size: string };
	isOpenPopoverEvent: (event: React.MouseEvent) => boolean;
};

export function FontSizePresetOpener({
	itemId,
	isOpen,
	setOpen,
	children,
	item: variable,
	isOpenPopoverEvent,
	contextType = 'repeater',
}: FontSizePresetOpenerProps) {
	const canEditGlobalStyles = useCanEditGlobalStyles();
	const headerLabel = usePresetTaxonomyHeaderLabel(variable, contextType);
	const getPayload = useCallback((): PresetCanvasPreviewPayload | null => {
		const patch = getGlobalStylesFontSizePresetPreviewAttributes(
			variable?.size
		);
		if (!patch || !Object.keys(patch).length) {
			return null;
		}
		return { kind: 'attributes', patch };
	}, [variable?.size]);

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
				beforeClick: previewHandlers.onClick,
			})}
			onMouseEnter={previewHandlers.onMouseEnter}
			onMouseLeave={previewHandlers.onMouseLeave}
			aria-label={sprintf(
				// translators: %d: The item number (1-based index)
				__('Font size variable %d', 'blockera'),
				Number(itemId) + 1
			)}
			data-cy="font-size-repeater-item-header"
		>
			<span
				className={controlInnerClassNames('header-label')}
				data-cy="header-label"
			>
				{headerLabel}
			</span>

			<span
				className={controlInnerClassNames('header-values')}
				data-cy="header-values"
			>
				<span
					style={{
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
						maxWidth: '110px',
						textTransform: 'lowercase',
						opacity: 0.5,
					}}
				>
					{variable?.size}
				</span>
			</span>

			{children}
		</div>
	);
}
