/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Modal as WPModal } from '@wordpress/components';
import { componentClassNames } from '@publisher/classnames';

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
					{headerTitle ||
						__('Publisher Modal Component', 'publisher-core')}
				</>
			}
			{...props}
		>
			{children}
		</WPModal>
	);
}
