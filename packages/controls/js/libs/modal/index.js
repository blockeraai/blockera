//@flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
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
				headerTitle ? (
					<>
						{headerIcon}
						{headerTitle}
					</>
				) : null
			}
			{...(!headerTitle && {
				__experimentalHideHeader: true,
			})}
			isDismissible={isDismissible}
			{...props}
		>
			{children}
		</WPModal>
	);
}
