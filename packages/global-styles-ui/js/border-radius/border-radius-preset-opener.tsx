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
import { getGlobalStylesBorderRadiusPresetPreviewCss } from '../preset-preview/injected-helpers';
import { usePresetRowPreviewInject } from '../components/preset-row-preview-inject';
import { getPresetRepeaterHeaderOnClick } from '../components/preset-repeater-header-click';
import type { VariableType } from '../components/types.ts';
import { radiusPresetSizeToString } from './utils';

export type BorderRadiusPresetOpenerProps = {
	itemId: string;
	isOpen: boolean;
	children?: React.ReactNode;
	setOpen: (isOpen: boolean) => boolean;
	item: VariableType & { size: string | number };
	isOpenPopoverEvent: (event: React.MouseEvent) => boolean;
};

export function BorderRadiusPresetOpener({
	itemId,
	isOpen,
	setOpen,
	children,
	item: variable,
	isOpenPopoverEvent,
}: BorderRadiusPresetOpenerProps) {
	const summary = radiusPresetSizeToString(variable?.size);
	const display = summary || __('EMPTY', 'blockera');

	const getPreviewDeclarations = useCallback(
		() => getGlobalStylesBorderRadiusPresetPreviewCss(variable?.size),
		[variable?.size]
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
				// translators: %d: The item number (1-based index)
				__('Border radius preset %d', 'blockera'),
				Number(itemId) + 1
			)}
			data-cy="border-radius-preset-repeater-item-header"
		>
			<span
				className={controlInnerClassNames('header-label')}
				data-cy="header-label"
			>
				{variable?.name}
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
					title={summary || undefined}
				>
					{display}
				</span>
			</span>

			{children}
		</div>
	);
}
