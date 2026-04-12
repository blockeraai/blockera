/**
 * External dependencies
 */
import React from 'react';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { classNames, controlInnerClassNames } from '@blockera/classnames';
import { Flex, getTypeLabel } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { getPresetRepeaterHeaderOnClick } from '../components/preset-repeater-header-click';
import type { VariableType } from '../components/types.ts';
import type { WpTransitionPreset } from './utils';
import { getTransitionPresetAccessibilityDescription } from './utils';
import TransitionPresetPreview from './transition-preset-preview';

function TransitionPresetOpenerValue({
	preset,
}: {
	preset: WpTransitionPreset | undefined;
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
			<TransitionPresetPreview items={preset?.items ?? []} inline />
		</Flex>
	);
}

export type TransitionPresetOpenerProps = {
	itemId: string;
	isOpen: boolean;
	children?: React.ReactNode;
	setOpen: (isOpen: boolean) => boolean;
	item: VariableType & WpTransitionPreset;
	isOpenPopoverEvent: (event: React.MouseEvent) => boolean;
};

export function TransitionPresetOpener({
	itemId,
	isOpen,
	setOpen,
	children,
	item: variable,
	isOpenPopoverEvent,
}: TransitionPresetOpenerProps) {
	const a11y = getTransitionPresetAccessibilityDescription(
		variable,
		getTypeLabel
	);

	return (
		<div
			className={classNames(
				controlInnerClassNames('repeater-group-header'),
				'blockera-transition-preset-opener-header'
			)}
			onClick={getPresetRepeaterHeaderOnClick({
				item: variable,
				isOpen,
				setOpen,
				isOpenPopoverEvent,
			})}
			aria-label={sprintf(
				// translators: %d: The item number (1-based index)
				__('Transition preset %d', 'blockera'),
				Number(itemId) + 1
			)}
			data-cy="transition-preset-repeater-item-header"
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
				<TransitionPresetOpenerValue preset={variable} />
			</span>

			{children}
		</div>
	);
}
