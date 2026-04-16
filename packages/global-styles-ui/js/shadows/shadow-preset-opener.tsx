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
import { getGlobalStylesShadowPresetPreviewAttributes } from '../preset-preview/injected-helpers';
import {
	type PresetCanvasPreviewPayload,
	usePresetRowCanvasPreview,
} from '../components/preset-row-preview-inject';
import { getPresetRepeaterHeaderOnClick } from '../components/preset-repeater-header-click';
import type { VariableType } from '../components/types.ts';
import type { WpShadowPreset } from './utils';
import {
	getShadowPresetAccessibilityDescription,
	shadowCssFromPreset,
} from './utils';
import ShadowPresetPreview from './shadow-preset-preview';

function ShadowPresetOpenerValue({
	preset,
}: {
	preset: WpShadowPreset | undefined;
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
			<ShadowPresetPreview
				shadow={
					preset
						? shadowCssFromPreset(
								preset as unknown as Record<string, unknown>
							)
						: ''
				}
				inline
				width={10}
				height={10}
				borderRadius={0}
			/>
		</Flex>
	);
}

export type ShadowPresetOpenerProps = {
	itemId: string;
	isOpen: boolean;
	children?: React.ReactNode;
	setOpen: (isOpen: boolean) => boolean;
	item: VariableType & WpShadowPreset;
	isOpenPopoverEvent: (event: React.MouseEvent) => boolean;
};

export function ShadowPresetOpener({
	itemId,
	isOpen,
	setOpen,
	children,
	item: variable,
	isOpenPopoverEvent,
}: ShadowPresetOpenerProps) {
	const a11y = getShadowPresetAccessibilityDescription(variable);

	const getPayload = useCallback((): PresetCanvasPreviewPayload | null => {
		const patch = getGlobalStylesShadowPresetPreviewAttributes(
			variable as unknown as Record<string, unknown>
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
				'blockera-shadow-preset-opener-header'
			)}
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
				__('Shadow preset %d', 'blockera'),
				Number(itemId) + 1
			)}
			data-cy="shadow-preset-repeater-item-header"
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
					// box-shadow draws outside the tile; hidden clips the preview in the opener.
					overflow: 'visible',
				}}
				title={a11y || undefined}
			>
				<ShadowPresetOpenerValue preset={variable} />
			</span>

			{children}
		</div>
	);
}
