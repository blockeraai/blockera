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
import type { WpTextShadowPreset } from './utils';
import { getTextShadowPresetAccessibilityDescription } from './utils';
import TextShadowPresetPreview from './text-shadow-preset-preview';

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
				shadow={preset?.shadow ?? ''}
				inline
				width={12}
				height={12}
				borderRadius={0}
			/>
		</Flex>
	);
}

export type TextShadowPresetOpenerProps = {
	itemId: string;
	isOpen: boolean;
	children?: React.ReactNode;
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
}: TextShadowPresetOpenerProps) {
	const a11y = getTextShadowPresetAccessibilityDescription(variable);

	return (
		<div
			className={classNames(
				controlInnerClassNames('repeater-group-header'),
				'blockera-text-shadow-preset-opener-header'
			)}
			onClick={(event: React.MouseEvent) =>
				isOpenPopoverEvent(event) && setOpen(!isOpen)
			}
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
				<TextShadowPresetOpenerValue preset={variable} />
			</span>

			{children}
		</div>
	);
}
