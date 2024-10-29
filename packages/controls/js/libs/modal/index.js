//@flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';
import { Modal as WPModal } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { componentClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { ModalProps } from './type';

export default function Modal({
	children,
	headerIcon,
	headerTitle,
	className,
	isDismissible = true,
	...props
}: ModalProps): MixedElement {
	return (
		<WPModal
			className={componentClassNames('modal', className)}
			title={
				<>
					{headerIcon && headerIcon}
					{headerTitle || __('Blockera Modal Component', 'blockera')}
				</>
			}
			isDismissible={isDismissible}
			{...props}
		>
			{children}
		</WPModal>
	);
}
