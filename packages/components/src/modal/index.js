/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Modal as WPModal } from '@wordpress/components';

/**
 * Render ModalIcon Component
 *
 * @param {object} children
 * @returns {React.ReactElement}
 */
export default function Modal({ children, headerIcon, headerTitle, ...props }) {
	return (
		<WPModal
			className="publisher-modal-component"
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
