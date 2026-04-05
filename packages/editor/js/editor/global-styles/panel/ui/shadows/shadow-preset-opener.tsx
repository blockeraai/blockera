/**
 * External dependencies
 */
import React from 'react';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { Flex } from '@blockera/controls';

/**
 * Internal dependencies
 */
import type { VariableType } from '../components/types.ts';
import type { WpShadowPreset } from './utils';
import {
	getShadowPresetAccessibilityDescription,
	truncateShadowCssForHeader,
} from './utils';

function ShadowPresetOpenerValue({
	preset,
}: {
	preset: WpShadowPreset | undefined;
}) {
	const css = String(preset?.shadow ?? '').trim();
	if (!css) {
		return <span>{__('EMPTY', 'blockera')}</span>;
	}

	return (
		<Flex
			alignItems="center"
			gap={8}
			justifyContent="flex-end"
			style={{ minWidth: 0, maxWidth: '100%', overflow: 'hidden' }}
		>
			<div
				aria-hidden
				style={{
					width: 22,
					height: 22,
					borderRadius: 4,
					flexShrink: 0,
					background: 'var(--wp-admin-theme-color, #3858e9)',
					boxShadow: css,
				}}
			/>
			<span
				style={{
					fontSize: 11,
					fontVariantNumeric: 'tabular-nums',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					whiteSpace: 'nowrap',
					minWidth: 0,
				}}
			>
				{truncateShadowCssForHeader(css, 44)}
			</span>
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

	return (
		<div
			className={controlInnerClassNames('repeater-group-header')}
			onClick={(event: React.MouseEvent) =>
				isOpenPopoverEvent(event) && setOpen(!isOpen)
			}
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
					overflow: 'hidden',
				}}
				title={a11y || undefined}
			>
				<ShadowPresetOpenerValue preset={variable} />
			</span>

			{children}
		</div>
	);
}
