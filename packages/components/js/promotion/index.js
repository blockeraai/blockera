// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useEffect, useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Popover } from '@blockera/components';

export const Promotion = ({
	onClose,
	shopPage,
	buttonText,
	description,
	type = 'popup',
	isOpen: _isOpen,
	...props
}: Object): MixedElement => {
	const [isOpen, setOpen] = useState(_isOpen);

	useEffect(() => setOpen(_isOpen), [_isOpen]);

	if (!isOpen || 'popup' !== type) {
		return <></>;
	}

	return (
		<Popover
			{...{
				...props,
				onClose: () => {
					onClose();
					setOpen(false);
				},
			}}
		>
			<p>{description}</p>
			<a href={shopPage}>{buttonText}</a>
		</Popover>
	);
};
