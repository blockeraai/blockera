/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Modal as WPModal } from '@wordpress/components';
import { componentClassNames } from '@blockera/classnames';

export default function Modal({
	children,
	headerIcon,
	headerTitle,
	className,
	...props
}) {
	return (
		<WPModal
			className={componentClassNames('modal', className)}
			title={
				<>
					{headerIcon && headerIcon}
					{headerTitle || __('Blockera Modal Component', 'blockera')}
				</>
			}
			{...props}
		>
			{children}
		</WPModal>
	);
}
