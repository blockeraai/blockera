/**
 * External dependencies
 */
import React from 'react';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { classNames, controlInnerClassNames } from '@blockera/classnames';
import { Flex } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { getPresetRepeaterHeaderOnClick } from '../components/preset-repeater-header-click';
import type { VariableType } from '../components/types.ts';
import type { WpTransformPreset } from './utils';
import { getTransformPresetAccessibilityDescription } from './utils';
import TransformPresetPreview from './transform-preset-preview';

/** Inline preview in the repeater header (mirrors transition preset opener layout). */
function TransformPresetOpenerValue({
	preset,
}: {
	preset: WpTransformPreset | undefined;
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
			<TransformPresetPreview items={preset?.items ?? []} inline />
		</Flex>
	);
}

export type TransformPresetOpenerProps = {
	itemId: string;
	isOpen: boolean;
	children?: React.ReactNode;
	setOpen: (isOpen: boolean) => boolean;
	item: VariableType & WpTransformPreset;
	isOpenPopoverEvent: (event: React.MouseEvent) => boolean;
};

export function TransformPresetOpener({
	itemId,
	isOpen,
	setOpen,
	children,
	item: variable,
	isOpenPopoverEvent,
}: TransformPresetOpenerProps) {
	const a11y = getTransformPresetAccessibilityDescription(variable);

	return (
		<div
			className={classNames(
				controlInnerClassNames('repeater-group-header'),
				'blockera-transform-preset-opener-header'
			)}
			onClick={getPresetRepeaterHeaderOnClick({
				item: variable,
				isOpen,
				setOpen,
				isOpenPopoverEvent,
			})}
			aria-label={sprintf(
				// translators: %d: The item number (1-based index)
				__('Transform preset %d', 'blockera'),
				Number(itemId) + 1
			)}
			data-cy="transform-preset-repeater-item-header"
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
					overflow: 'visible',
				}}
				title={a11y || undefined}
			>
				<TransformPresetOpenerValue preset={variable} />
			</span>

			{children}
		</div>
	);
}
