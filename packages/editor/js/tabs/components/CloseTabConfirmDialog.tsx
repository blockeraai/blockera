/**
 * WordPress dependencies
 */
import { Modal, Button } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { Tab } from '../types';

/**
 * Close tab confirm dialog props.
 */
export interface CloseTabConfirmDialogProps {
	/** Whether dialog is open. */
	isOpen: boolean;
	/** Close handler. */
	onClose: () => void;
	/** Handler for Save & Close action. */
	onSaveAndClose: () => void;
	/** Handler for Close Without Saving action. */
	onCloseWithoutSaving: () => void;
	/** Array of tab objects to close. */
	tabs?: Tab[];
	/** Function to get tab title: (tab) => string. */
	getTabTitle?: (tab: Tab) => string;
	/** Handler for Review tab action: (tab) => void. */
	onReviewTab?: (tab: Tab) => void;
	/** Key of the currently active tab. */
	activeTabKey?: string | null;
	/** Whether save is in progress. */
	isSaving?: boolean;
}

/**
 * Close Tab Confirmation Dialog Component
 */
export default function CloseTabConfirmDialog({
	isOpen,
	onClose,
	onSaveAndClose,
	onCloseWithoutSaving,
	tabs = [],
	getTabTitle,
	onReviewTab,
	activeTabKey,
	isSaving = false,
}: CloseTabConfirmDialogProps): React.ReactElement | null {
	if (!isOpen || tabs.length === 0) {
		return null;
	}

	const isMultiple = tabs.length > 1;
	const tabCount = tabs.length;

	// Check if we're closing the active tab (single tab close scenario)
	const isClosingActiveTab =
		!isMultiple && activeTabKey && tabs[0]?.key === activeTabKey;

	// Show tabs list only if:
	// - Multiple tabs are being closed, OR
	// - Single tab is being closed but it's NOT the active tab
	const showTabsList = isMultiple || !isClosingActiveTab;

	// Modal title: singular when closing active tab, plural otherwise
	const modalTitle = isClosingActiveTab
		? __('Unsaved Tab', 'blockera')
		: __('Unsaved Tabs', 'blockera');

	return (
		<Modal
			title={modalTitle}
			onRequestClose={onClose}
			className="blockera-tabs-close-confirm-dialog"
		>
			<div className="blockera-tabs-close-confirm-content">
				<p>
					{isMultiple
						? sprintf(
								/* translators: %d: number of tabs */
								__(
									'%d tabs have unsaved changes. Save before closing?',
									'blockera'
								),
								tabCount
						  )
						: __(
								'This tab has unsaved changes. Save before closing?',
								'blockera'
						  )}
				</p>

				{showTabsList && tabs.length > 0 && (
					<div className="blockera-tabs-close-confirm-tabs-list">
						{tabs.map((tab) => {
							const title = getTabTitle
								? getTabTitle(tab)
								: tab.title || __('Untitled', 'blockera');
							return (
								<div
									key={tab.key}
									className="blockera-tabs-close-confirm-tab-item"
								>
									<strong className="blockera-tabs-close-confirm-tab-title">
										{title}
									</strong>

									{onReviewTab && (
										<Button
											variant="secondary"
											size="small"
											onClick={() => onReviewTab(tab)}
											disabled={isSaving}
											className="blockera-tabs-close-confirm-review-button"
										>
											{__('Review tab', 'blockera')}
										</Button>
									)}
								</div>
							);
						})}
					</div>
				)}
			</div>

			<div className="blockera-tabs-close-confirm-actions">
				<Button
					variant="primary"
					onClick={onSaveAndClose}
					isBusy={isSaving}
					disabled={isSaving}
				>
					{isMultiple
						? __('Save All & Close', 'blockera')
						: __('Save & Close', 'blockera')}
				</Button>

				<Button
					variant="secondary"
					isDestructive
					onClick={onCloseWithoutSaving}
					disabled={isSaving}
				>
					{isMultiple
						? __('Close All Without Saving', 'blockera')
						: __('Close Without Saving', 'blockera')}
				</Button>

				<Button
					variant="secondary"
					onClick={onClose}
					disabled={isSaving}
				>
					{__('Cancel', 'blockera')}
				</Button>
			</div>
		</Modal>
	);
}
