/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useState, memo, createInterpolateElement } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Button, Flex, Modal } from '@blockera/controls';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import type { LockUser } from '../types';

/**
 * First letter of the first two words (e.g. "Sarah Johnson" → "SJ"); a single word uses its first two letters.
 */
function getDisplayInitials(displayName: string): string {
	const words = displayName.trim().split(/\s+/).filter(Boolean);
	if (words.length >= 2) {
		return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
	}
	if (words.length === 1) {
		const w = words[0];
		if (w.length >= 2) {
			return (w.charAt(0) + w.charAt(1)).toUpperCase();
		}
		return w.charAt(0).toUpperCase();
	}
	return '?';
}

function getLockUserSubline(user: LockUser | null): string | null {
	if (!user) {
		return null;
	}
	const email = user.email?.trim();
	const role = user.role?.trim();
	if (email && role) {
		return `${email} · ${role}`;
	}
	if (email) {
		return email;
	}
	if (role) {
		return role;
	}
	return null;
}

/**
 * Tab locked modal props.
 */
export interface TabLockedModalProps {
	/** Whether the modal is currently open. */
	isOpen: boolean;
	/** Title of the document being edited (shown in the message). */
	documentTitle: string;
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
	documentTitle,
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
	const userAvatar =
		lockUser?.avatar && lockUser.avatar.trim() !== ''
			? lockUser.avatar
			: null;
	const postLabel =
		documentTitle.trim() !== ''
			? documentTitle.trim()
			: __('Untitled', 'blockera');
	const subline = getLockUserSubline(lockUser);

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

	const leadMessage = createInterpolateElement(
		sprintf(
			/* translators: 1: User display name, 2: Document title (wrapped in <doc />). */
			__(
				'%1$s is currently editing <doc>%2$s</doc>. Taking over will end their session. Any unsaved changes they made will be lost.',
				'blockera'
			),
			userName,
			postLabel
		),
		{
			doc: <strong />,
		}
	);

	return (
		<Modal
			headerIcon={<Icon icon="lock" />}
			headerTitle={__('This tab is being edited', 'blockera')}
			// Empty handler required by Modal component, but modal is not dismissible
			onRequestClose={() => {}}
			// Prevent accidental dismissal - user must choose an action
			shouldCloseOnClickOutside={false}
			shouldCloseOnEsc={false}
			isDismissible={false}
			className="blockera-tabs-locked-modal"
			size="medium"
			actions={
				<div className="blockera-tabs-locked-modal-actions">
					<Button
						variant="tertiary"
						onClick={onCloseTab}
						disabled={isTakingOver}
					>
						{__('Close tab', 'blockera')}
					</Button>
					<Button
						variant="primary"
						onClick={handleTakeOver}
						isBusy={isTakingOver}
						disabled={isTakingOver}
					>
						{isTakingOver
							? __('Taking over…', 'blockera')
							: __('Take over editing', 'blockera')}
					</Button>
				</div>
			}
		>
			<div className="blockera-tabs-locked-modal-body">
				<p className="blockera-tabs-locked-modal__lead">
					{leadMessage}
				</p>

				<div className="blockera-tabs-locked-modal__profile">
					<Flex
						direction="row"
						alignItems="center"
						gap="16px"
						className="blockera-tabs-locked-modal__profile-inner"
					>
						{userAvatar ? (
							<img
								src={userAvatar}
								alt=""
								className="blockera-tabs-locked-modal__profile-avatar-img"
								width={56}
								height={56}
							/>
						) : (
							<span
								className="blockera-tabs-locked-modal__profile-initials"
								aria-hidden="true"
							>
								{getDisplayInitials(userName)}
							</span>
						)}
						<div className="blockera-tabs-locked-modal__profile-text">
							<div className="blockera-tabs-locked-modal__profile-name">
								{userName}
							</div>
							{subline ? (
								<div className="blockera-tabs-locked-modal__profile-sub">
									{subline}
								</div>
							) : null}
						</div>
					</Flex>
				</div>
			</div>
		</Modal>
	);
}

// Memoize to prevent unnecessary re-renders when parent state changes
const TabLockedModal = memo(TabLockedModalComponent);
export default TabLockedModal;
