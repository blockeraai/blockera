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
import Modal from '../../modal';
import Popover from '../../popover';
import type { PopoverPlacement } from '../../popover/types/index';
import { Promoter } from './promoter';

export const UpgradePrompt = ({
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
	type = 'popover',
	anchor,
	'data-test': dataTest,
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
	'data-test'?: string,
	placement?: PopoverPlacement,
	type?: 'popover' | 'modal',
	anchor?: HTMLElement,
}): MixedElement => {
	const [isOpen, setOpen] = useState(_isOpen);

	useEffect(() => setOpen(_isOpen), [_isOpen]);

	if (!isOpen) {
		return <></>;
	}

	const handleClose = () => {
		onClose();
		setOpen(false);
	};

	const promoterTestIdProps =
		dataTest !== undefined && dataTest !== null && dataTest !== ''
			? { 'test-id': dataTest }
			: {};

	const promoter = (
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
			{...promoterTestIdProps}
		/>
	);

	if (type === 'modal') {
		return (
			<Modal
				headerIcon={<Icon icon="lock" iconSize="24" />}
				headerTitle={title}
				onRequestClose={handleClose}
				className={componentClassNames('upgrade-prompt')}
				data-test={dataTest}
				{...props}
			>
				{promoter}
			</Modal>
		);
	}

	return (
		<Popover
			placement={placement}
			offset={offset}
			anchor={anchor}
			title={
				<>
					<Icon icon="lock" iconSize="24" />
					{title}
				</>
			}
			onClose={handleClose}
			className={componentClassNames('upgrade-prompt')}
			data-test={dataTest}
			{...props}
		>
			{promoter}
		</Popover>
	);
};
