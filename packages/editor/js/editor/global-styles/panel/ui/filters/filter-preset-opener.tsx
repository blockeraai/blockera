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
import type { VariableType } from '../components/types.ts';
import type { WpFilterPreset } from './utils';
import { getFilterPresetAccessibilityDescription } from './utils';
import FilterPresetPreview from './filter-preset-preview';

function FilterPresetOpenerValue({
	preset,
}: {
	preset: WpFilterPreset | undefined;
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
			<FilterPresetPreview items={preset?.items ?? []} inline />
		</Flex>
	);
}

export type FilterPresetOpenerProps = {
	itemId: string;
	isOpen: boolean;
	children?: React.ReactNode;
	setOpen: (isOpen: boolean) => boolean;
	item: VariableType & WpFilterPreset;
	isOpenPopoverEvent: (event: React.MouseEvent) => boolean;
};

export function FilterPresetOpener({
	itemId,
	isOpen,
	setOpen,
	children,
	item: variable,
	isOpenPopoverEvent,
}: FilterPresetOpenerProps) {
	const a11y = getFilterPresetAccessibilityDescription(variable);

	return (
		<div
			className={classNames(
				controlInnerClassNames('repeater-group-header'),
				'blockera-filter-preset-opener-header'
			)}
			onClick={(event: React.MouseEvent) =>
				isOpenPopoverEvent(event) && setOpen(!isOpen)
			}
			aria-label={sprintf(
				// translators: %d: The item number (1-based index)
				__('Filter preset %d', 'blockera'),
				Number(itemId) + 1
			)}
			data-cy="filter-preset-repeater-item-header"
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
				<FilterPresetOpenerValue preset={variable} />
			</span>

			{children}
		</div>
	);
}
