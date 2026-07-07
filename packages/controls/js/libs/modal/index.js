//@flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { Modal as WPModal } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import {
	componentClassNames,
	componentInnerClassNames,
} from '@blockera/classnames';

/**
 * Internal dependencies
 */
import Flex from '../flex';
import type { ModalProps } from './type';

export default function Modal({
	children,
	actions,
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
						{headerIcon && (
							<span
								className={componentInnerClassNames(
									'modal__header-icon'
								)}
							>
								{headerIcon}
							</span>
						)}

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
			{actions !== undefined && actions !== null && actions !== false && (
				<Flex className={componentInnerClassNames('modal__actions')}>
					{actions}
				</Flex>
			)}
		</WPModal>
	);
}
