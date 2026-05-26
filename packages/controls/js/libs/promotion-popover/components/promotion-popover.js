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
import { componentClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import Popover from '../../popover';
import type { PopoverPlacement } from '../../popover/types/index';
import { Promoter } from './promoter';

export const PromotionPopover = ({
	title = __('Premium Feature', 'blockera'),
	design,
	icon,
	heading,
	description,
	featuresList,
	disableHintsText,
	onClose,
	buttonURL,
	buttonText,
	buttonTarget,
	isOpen: _isOpen,
	offset = 35,
	placement = 'left-start',
	...props
}: {
	design?: 'light' | 'dark',
	title?: string,
	icon?: string | MixedElement,
	heading?: string,
	description?: string | MixedElement,
	disableHintsText?: string | MixedElement,
	featuresList?: Array<string>,
	onClose: () => void,
	buttonURL?: string,
	buttonText?: string,
	buttonTarget?: string,
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
			<Promoter
				design={design}
				icon={icon}
				heading={heading}
				description={description}
				featuresList={featuresList}
				disableHintsText={disableHintsText}
				buttonURL={buttonURL}
				buttonText={buttonText}
				buttonTarget={buttonTarget}
			/>
		</Popover>
	);
};
