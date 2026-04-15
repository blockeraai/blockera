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
import { getGlobalStylesBorderPresetPreviewCss } from '../preset-preview/injected-helpers';
import { usePresetRowPreviewInject } from '../components/preset-row-preview-inject';
import { getPresetRepeaterHeaderOnClick } from '../components/preset-repeater-header-click';
import type { VariableType } from '../components/types.ts';
import type { BorderBoxPreset } from './utils';
import { getBorderPresetAccessibilityDescription } from './utils';
import { BorderPresetOpenerValue } from './border-preset-opener-value';

export type BorderPresetOpenerProps = {
	itemId: string;
	isOpen: boolean;
	children?: React.ReactNode;
	setOpen: (isOpen: boolean) => boolean;
	item: VariableType & BorderBoxPreset;
	isOpenPopoverEvent: (event: React.MouseEvent) => boolean;
};

export function BorderPresetOpener({
	itemId,
	isOpen,
	setOpen,
	children,
	item: variable,
	isOpenPopoverEvent,
}: BorderPresetOpenerProps) {
	const a11ySummary = getBorderPresetAccessibilityDescription(
		variable?.border
	);

	const getPreviewDeclarations = useCallback(
		() => getGlobalStylesBorderPresetPreviewCss(variable?.border),
		[variable?.border]
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
				__('Border preset %d', 'blockera'),
				Number(itemId) + 1
			)}
			data-cy="border-preset-repeater-item-header"
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
				style={{
					display: 'flex',
					justifyContent: 'flex-end',
					alignItems: 'center',
					minWidth: 0,
					maxWidth: '100%',
					overflow: 'hidden',
				}}
				title={a11ySummary || undefined}
			>
				<BorderPresetOpenerValue border={variable?.border} />
			</span>

			{children}
		</div>
	);
}
