/**
 * External dependencies
 */
import React from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { classNames, controlInnerClassNames } from '@blockera/classnames';
import { Flex } from '@blockera/controls';
/**
 * Internal dependencies
 */
import { getGlobalStylesTextShadowPreviewAttributes } from '../preset-preview/injected-helpers';
import {
	type PresetCanvasPreviewPayload,
	usePresetRowCanvasPreview,
} from '../components/preset-row-preview-inject';
import { getPresetRepeaterHeaderOnClick } from '../components/preset-repeater-header-click';
import { useCanEditGlobalStyles } from '../components/use-global-styles-preset-edit';
import type { VariableType } from '../components/types.ts';
import type { WpTextShadowPreset } from './utils';
import {
	getTextShadowPresetAccessibilityDescription,
	textShadowCssFromPreset,
} from './utils';
import TextShadowPresetPreview from './text-shadow-preset-preview';
import { usePresetTaxonomyHeaderLabel } from '../components';

function TextShadowPresetOpenerValue({
	preset,
}: {
	preset: WpTextShadowPreset | undefined;
}) {
	return (
		<Flex
			alignItems="center"
			justifyContent="flex-end"
			style={{
				width: 'fit-content',
				maxWidth: '100%',
				minWidth: 0,
				flexShrink: 0,
				overflow: 'visible',
			}}
		>
			<TextShadowPresetPreview
				shadow={
					preset
						? textShadowCssFromPreset(
								preset as unknown as Record<string, unknown>
							)
						: ''
				}
				inline
				size={12}
			/>
		</Flex>
	);
}

export type TextShadowPresetOpenerProps = {
	itemId: string;
	isOpen: boolean;
	children?: React.ReactNode;
	contextType?: 'repeater' | 'taxonomy';
	setOpen: (isOpen: boolean) => boolean;
	item: VariableType & WpTextShadowPreset;
	isOpenPopoverEvent: (event: React.MouseEvent) => boolean;
};

export function TextShadowPresetOpener({
	itemId,
	isOpen,
	setOpen,
	children,
	item: variable,
	isOpenPopoverEvent,
	contextType = 'repeater',
}: TextShadowPresetOpenerProps) {
	const canEditGlobalStyles = useCanEditGlobalStyles();
	const headerLabel = usePresetTaxonomyHeaderLabel(variable, contextType);
	const a11y = getTextShadowPresetAccessibilityDescription(variable);

	const getPayload = useCallback((): PresetCanvasPreviewPayload | null => {
		const patch = getGlobalStylesTextShadowPreviewAttributes(
			textShadowCssFromPreset(
				variable as unknown as Record<string, unknown>
			)
		);
		if (!patch || !Object.keys(patch).length) {
			return null;
		}
		return { kind: 'attributes', patch };
	}, [variable]);

	const previewHandlers = usePresetRowCanvasPreview(getPayload);

	return (
		<div
			className={classNames(
				controlInnerClassNames('repeater-group-header'),
				'blockera-text-shadow-preset-opener-header'
			)}
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
				__('Text shadow preset %d', 'blockera'),
				Number(itemId) + 1
			)}
			data-cy="text-shadow-preset-repeater-item-header"
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
				style={{
					display: 'flex',
					justifyContent: 'flex-end',
					alignItems: 'center',
					minWidth: 0,
					maxWidth: '100%',
					overflow: 'visible',
				}}
				title={a11y || undefined}
			>
				<TextShadowPresetOpenerValue preset={variable} />
			</span>

			{children}
		</div>
	);
}
