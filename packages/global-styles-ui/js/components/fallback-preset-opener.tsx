/**
 * External dependencies
 */
import React from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { getVariableIcon, useVarPickerPresetContext } from '@blockera/controls';
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import {
	type PresetCanvasPreviewPayload,
	usePresetRowCanvasPreview,
} from './preset-row-preview-inject';
import { getPresetRepeaterHeaderOnClick } from './preset-repeater-header-click';
import type { VariableType } from './types';

export type FallbackCatalogRow = VariableType & {
	id?: string;
	value?: unknown;
};

export type FallbackPresetOpenerProps = {
	itemId: string;
	isOpen: boolean;
	children?: React.ReactNode;
	setOpen: (isOpen: boolean) => boolean;
	item: FallbackCatalogRow;
	isOpenPopoverEvent: (event: React.MouseEvent) => boolean;
};

export function FallbackPresetOpener({
	itemId,
	isOpen,
	setOpen,
	children,
	item: variable,
	isOpenPopoverEvent,
}: FallbackPresetOpenerProps) {
	const { variableType } = useVarPickerPresetContext();
	const type = variableType || '';

	const getPayload = useCallback((): PresetCanvasPreviewPayload | null => {
		if (
			typeof variable?.value === 'string' &&
			variable.value.includes(':')
		) {
			return {
				kind: 'declarations',
				declarations: variable.value.trim(),
			};
		}
		return null;
	}, [variable?.value]);

	const previewHandlers = usePresetRowCanvasPreview(getPayload);

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
				/* translators: %s: variable preset display name */
				__('Variable preset: %s', 'blockera'),
				variable?.name || itemId
			)}
			data-cy="fallback-catalog-repeater-item-header"
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
				{getVariableIcon({
					type,
					value:
						typeof variable?.value === 'string'
							? variable.value
							: undefined,
				})}
			</span>

			{children}
		</div>
	);
}
