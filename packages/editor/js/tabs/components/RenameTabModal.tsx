/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { TextControl, Button } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { Modal } from '@blockera/controls';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { useEntity } from '../../hooks';
import { WORKSPACE_TABS_TEST_ID } from '../constants/testIds';
import type { Tab } from '../types';

/**
 * Rename tab modal props.
 */
export interface RenameTabModalProps {
	/** Whether modal is open. */
	isOpen: boolean;
	/** Close handler. */
	onClose: () => void;
	/** Save handler: (customTitle) => void. */
	onSave: (customTitle: string) => void;
	/** Tab object to rename. */
	tab: Tab | null;
}

/**
 * Rename Tab Modal component
 */
export default function RenameTabModal({
	isOpen,
	onClose,
	onSave,
	tab,
}: RenameTabModalProps): React.ReactElement | null {
	const [customTitle, setCustomTitle] = useState('');
	const entity = useEntity(tab?.type, tab?.id);
	const entityTitle = entity.title;

	// Initialize custom title when modal opens or tab changes
	useEffect(() => {
		if (isOpen && tab) {
			// Pre-fill with existing customTitle if it exists, otherwise empty
			setCustomTitle(tab.customTitle || '');
		}
	}, [isOpen, tab]);

	if (!isOpen || !tab) {
		return null;
	}

	const handleSave = (): void => {
		// Save the custom title (empty string clears the rename)
		onSave(customTitle.trim());
		onClose();
	};

	const handleRemoveRename = (): void => {
		// Clear the custom title
		onSave('');
		onClose();
	};

	const handleClose = (): void => {
		// Reset to original value on cancel
		setCustomTitle(tab.customTitle || '');
		onClose();
	};

	// Get the actual post title for display
	const actualTitle = entityTitle || tab.title || __('Untitled', 'blockera');

	const testId = (id: string): Record<string, string> => ({
		'test-id': id,
	});

	return (
		<Modal
			headerIcon={<Icon icon="pencil" library="wp" />}
			headerTitle={
				<>
					{sprintf(
						/* translators: %s: The tab title shown in the editor. */
						__('Rename "%s"', 'blockera'),
						tab.title
					)}
				</>
			}
			onRequestClose={handleClose}
			className="blockera-tabs-rename-modal"
			actions={
				<div className="blockera-tabs-rename-modal-actions">
					{tab.customTitle && (
						<Button
							variant="secondary"
							isDestructive
							onClick={handleRemoveRename}
							style={{ marginRight: 'auto' }}
							{...testId(
								WORKSPACE_TABS_TEST_ID.renameModalRemoveRename
							)}
						>
							{__('Remove rename', 'blockera')}
						</Button>
					)}

					<div className="blockera-tabs-rename-modal-actions-right">
						<Button
							variant="tertiary"
							onClick={handleClose}
							{...testId(
								WORKSPACE_TABS_TEST_ID.renameModalCancel
							)}
						>
							{__('Cancel', 'blockera')}
						</Button>
						<Button
							variant="primary"
							onClick={handleSave}
							{...testId(WORKSPACE_TABS_TEST_ID.renameModalSave)}
						>
							{__('Save', 'blockera')}
						</Button>
					</div>
				</div>
			}
		>
			<div
				className="blockera-tabs-rename-modal-content"
				{...testId(WORKSPACE_TABS_TEST_ID.renameModal)}
			>
				<TextControl
					label={__('Custom Tab Name', 'blockera')}
					value={customTitle}
					onChange={setCustomTitle}
					placeholder={actualTitle}
					help={__(
						'Leave empty to use the post title. This only changes the tab label and the post/page title won’t be changed.',
						'blockera'
					)}
					{...testId(WORKSPACE_TABS_TEST_ID.renameModalInput)}
				/>
			</div>
		</Modal>
	);
}
