/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Modal,
	Button,
	__experimentalHStack as HStack,
} from '@wordpress/components';
import { useState, memo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { LockUser } from '../types';

/**
 * Tab locked modal props.
 */
export interface TabLockedModalProps {
	/** Whether the modal is currently open. */
	isOpen: boolean;
	/** User who has locked the post. */
	lockUser: LockUser | null;
	/** Async handler for "Take Over" action. */
	onTakeOver: () => Promise<void>;
	/** Handler for "Close Tab" action. */
	onCloseTab: () => void;
}

/**
 * Tab Locked Modal Component
 *
 * Displays a modal when a tab is locked by another user.
 * This replaces the block editor's built-in PostLockedModal when multiple tabs are open.
 *
 * ## User Actions:
 * - "Close Tab": Closes the locked tab and switches to the previous tab
 * - "Take Over": Acquires the lock for the current user, allowing them to edit
 *
 * ## Design Decisions:
 * - Modal cannot be dismissed (no X button, no ESC, no click outside)
 * - User MUST choose one of the two actions
 * - This matches WordPress's behavior for critical lock dialogs
 */
function TabLockedModalComponent({
	isOpen,
	lockUser,
	onTakeOver,
	onCloseTab,
}: TabLockedModalProps): React.ReactElement | null {
	// Track loading state for the take over action
	const [isTakingOver, setIsTakingOver] = useState(false);

	// Early return if modal is not open (performance optimization)
	if (!isOpen) {
		return null;
	}

	// Extract user info with fallbacks
	const userName = lockUser?.name || __('Another user', 'blockera');
	const userAvatar = lockUser?.avatar;

	/**
	 * Handle take over button click
	 *
	 * Shows loading state while the async operation is in progress.
	 * The parent component handles the actual lock acquisition.
	 */
	const handleTakeOver = async (): Promise<void> => {
		setIsTakingOver(true);
		try {
			await onTakeOver();
		} finally {
			// Always reset loading state, even on error
			setIsTakingOver(false);
		}
	};

	return (
		<Modal
			title={__('This tab is being edited', 'blockera')}
			// Empty handler required by Modal component, but modal is not dismissible
			onRequestClose={() => {}}
			// Prevent accidental dismissal - user must choose an action
			shouldCloseOnClickOutside={false}
			shouldCloseOnEsc={false}
			isDismissible={false}
			className="blockera-tabs-locked-modal"
			size="medium"
		>
			<HStack alignment="top" spacing={6}>
				{/* User avatar (optional) */}
				{userAvatar && (
					<img
						src={userAvatar}
						alt={__('Avatar', 'blockera')}
						className="blockera-tabs-locked-modal__avatar"
						width={64}
						height={64}
					/>
				)}

				<div className="blockera-tabs-locked-modal__content">
					{/* Main message with user name highlighted */}
					<p>
						<strong>{userName}</strong>{' '}
						{__('is currently editing this post.', 'blockera')}
					</p>

					{/* Explanation of consequences */}
					<p>
						{__(
							'You can take over editing, which will prevent them from saving their changes, or close this tab.',
							'blockera'
						)}
					</p>

					{/* Action buttons */}
					<HStack
						className="blockera-tabs-locked-modal__buttons"
						justify="flex-end"
						spacing={3}
					>
						<Button
							variant="tertiary"
							onClick={onCloseTab}
							disabled={isTakingOver}
						>
							{__('Close Tab', 'blockera')}
						</Button>
						<Button
							variant="primary"
							onClick={handleTakeOver}
							isBusy={isTakingOver}
							disabled={isTakingOver}
						>
							{isTakingOver
								? __('Taking over…', 'blockera')
								: __('Take Over', 'blockera')}
						</Button>
					</HStack>
				</div>
			</HStack>
		</Modal>
	);
}

// Memoize to prevent unnecessary re-renders when parent state changes
const TabLockedModal = memo(TabLockedModalComponent);
export default TabLockedModal;
