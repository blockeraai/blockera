/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Modal,
	Button,
	__experimentalHStack as HStack,
} from '@wordpress/components';
import { memo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { WORKSPACE_TABS_TEST_ID } from '../constants/testIds';

/**
 * Tab unavailable modal props.
 */
export interface TabUnavailableModalProps {
	/** Whether the modal is open. */
	isOpen: boolean;
	/** Document label (title or fallback). */
	documentLabel: string;
	/** Called when the user dismisses the modal. */
	onConfirm: () => void;
}

/**
 * Modal shown when a workspace tab points at a document that no longer exists or
 * cannot be edited (deleted, trashed, private, or missing capabilities).
 */
function TabUnavailableModalComponent({
	isOpen,
	documentLabel,
	onConfirm,
}: TabUnavailableModalProps): React.ReactElement | null {
	if (!isOpen) {
		return null;
	}

	return (
		<Modal
			title={__('Document unavailable', 'blockera')}
			onRequestClose={onConfirm}
			shouldCloseOnClickOutside={false}
			shouldCloseOnEsc
			isDismissible
			className="blockera-tabs-unavailable-modal"
			size="medium"
		>
			<div
				className="blockera-tabs-unavailable-modal__content"
				{...{
					'test-id': WORKSPACE_TABS_TEST_ID.unavailableModalRoot,
				}}
			>
				<p>
					{__(
						'This item cannot be opened in the editor. It may have been deleted, moved to the trash, made private, or you may no longer have permission to edit it.',
						'blockera'
					)}
				</p>
				<p className="blockera-tabs-unavailable-modal__label">
					<strong>{documentLabel}</strong>
				</p>
				<p>
					{__(
						'The tab has been removed from your open tabs and recently closed list.',
						'blockera'
					)}
				</p>
				<HStack
					className="blockera-tabs-unavailable-modal__buttons"
					justify="flex-end"
					spacing={3}
				>
					<Button
						variant="primary"
						onClick={onConfirm}
						{...{
							'test-id':
								WORKSPACE_TABS_TEST_ID.unavailableModalConfirm,
						}}
					>
						{__('OK', 'blockera')}
					</Button>
				</HStack>
			</div>
		</Modal>
	);
}

const TabUnavailableModal = memo(TabUnavailableModalComponent);
export default TabUnavailableModal;
