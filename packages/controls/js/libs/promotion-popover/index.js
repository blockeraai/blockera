// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import {
	componentClassNames,
	componentInnerClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import Flex from '../flex';
import Popover from '../popover';
import { default as Logo } from './icons/logo.svg';
import type { PopoverPlacement } from '../popover/types/index';

export const PromotionPopover = ({
	title = __('Premium Feature', 'blockera'),
	icon = <Logo />,
	heading = __('It’s a PRO Feature', 'blockera'),
	description = (
		<p>{__('Elevate Your Design with Premium Features:', 'blockera')}</p>
	),
	featuresList = [
		__('All responsive breakpoints', 'blockera'),
		__('All block states', 'blockera'),
		__('Advanced features', 'blockera'),
		__('Premium blocks', 'blockera'),
	],
	disableHintsText = __(
		'You can disable Pro hints in settings panel.',
		'blockera'
	),
	onClose,
	buttonURL = 'https://blockera.ai/upgrade-to-pro/',
	buttonText = __('Upgrade to PRO', 'blockera'),
	isOpen: _isOpen,
	offset = 35,
	placement = 'left-start',
	...props
}: {
	title?: string,
	icon?: string | MixedElement,
	heading?: string,
	description?: string | MixedElement,
	disableHintsText?: string | MixedElement,
	featuresList?: Array<string>,
	onClose: () => void,
	buttonURL?: string,
	buttonText?: string,
	isOpen?: boolean,
	offset?: number,
	placement?: PopoverPlacement,
}): MixedElement => {
	const [isOpen, setOpen] = useState(_isOpen);

	useEffect(() => setOpen(_isOpen), [_isOpen]);

	if (!isOpen) {
		return <></>;
	}

	return (
		<Popover
			placement={placement}
			offset={offset}
			title={
				<>
					<Icon icon="lock" iconSize="24" />
					{title}
				</>
			}
			onClose={() => {
				onClose();
				setOpen(false);
			}}
			className={componentClassNames('promotion-popover')}
			{...props}
		>
			<Flex direction="column" gap={'15px'}>
				{icon && (
					<div
						className={componentInnerClassNames(
							'promotion-popover__image'
						)}
					>
						{icon}
					</div>
				)}

				{heading && (
					<h3
						className={componentInnerClassNames(
							'promotion-popover__heading'
						)}
					>
						{heading}
					</h3>
				)}

				{description && (
					<div
						className={componentInnerClassNames(
							'promotion-popover__description'
						)}
					>
						{description}
					</div>
				)}

				{featuresList.length > 0 && (
					<ul
						className={componentInnerClassNames(
							'promotion-popover__list'
						)}
					>
						{featuresList.map((feature, index) => (
							<li key={index}>
								<Icon icon="check" iconSize="20" />
								{feature}
							</li>
						))}
					</ul>
				)}

				{buttonURL && (
					<a
						className={componentInnerClassNames(
							'promotion-popover__button',
							'components-button',
							'blockera-component-button',
							'is-primary'
						)}
						href={buttonURL}
						target="_blank"
						rel="noreferrer"
					>
						{buttonText}
					</a>
				)}

				{disableHintsText && (
					<div
						className={componentInnerClassNames(
							'promotion-popover__description disable-pro-hints'
						)}
					>
						{disableHintsText}
					</div>
				)}
			</Flex>
		</Popover>
	);
};
