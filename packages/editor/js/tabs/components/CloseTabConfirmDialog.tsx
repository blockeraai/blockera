/**
 * WordPress dependencies
 */
import { Icon as WordPressIcon } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { memo, useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Button, ChangeIndicator, Modal } from '@blockera/controls';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { useEntity } from '../../hooks';
import type { Tab } from '../types';
import { WORKSPACE_TABS_TEST_ID } from '../constants/testIds';
import { getTabIcon } from '../utils/getTabIcon';

interface CloseTabConfirmTabRowProps {
	tab: Tab;
	title: string;
	activeTabKey: string | null | undefined;
	onOpenTab?: (tab: Tab) => void;
	isSaving: boolean;
}

/**
 * One row in the close-confirm list: change indicator, icon, title, open/current control.
 */
const CloseTabConfirmTabRow = memo(function CloseTabConfirmTabRow({
	tab,
	title,
	activeTabKey,
	onOpenTab,
	isSaving,
}: CloseTabConfirmTabRowProps): React.ReactElement {
	const entity = useEntity(tab.type, tab.id);

	const isCurrentTab = Boolean(activeTabKey) && tab.key === activeTabKey;

	const slugForIcon = entity.slug ?? tab.slug;
	const typeIcon = useMemo(
		() => getTabIcon({ postType: tab.type, slug: slugForIcon }),
		[tab.type, slugForIcon]
	);

	return (
		<div className="blockera-tabs-close-confirm-tab-item">
			<div className="blockera-tabs-close-confirm-tab-indicator-column">
				<ChangeIndicator
					isChanged={entity.dirty}
					primaryColor="var(--blockera-controls-primary-color)"
					size="6"
					isAnimated={true}
				/>
			</div>
			<div className="blockera-tabs-close-confirm-tab-main">
				<div className="blockera-tabs-close-confirm-tab-heading">
					<span
						className="blockera-tabs-close-confirm-tab-type-icon"
						aria-hidden
					>
						<WordPressIcon icon={typeIcon} size={20} />
					</span>
					<strong className="blockera-tabs-close-confirm-tab-title">
						{title}
					</strong>
				</div>
			</div>

			<div className="blockera-tabs-close-confirm-tab-trailing">
				{isCurrentTab ? (
					<span className="blockera-tabs-close-confirm-current-tab">
						{__('Current tab', 'blockera')}
					</span>
				) : (
					onOpenTab && (
						<Button
							{...({
								'test-id':
									WORKSPACE_TABS_TEST_ID.closeConfirmOpenTab(
										tab.key
									),
							} as Record<string, string>)}
							variant="secondary"
							size="small"
							onClick={() => onOpenTab(tab)}
							disabled={isSaving}
							className="blockera-tabs-close-confirm-open-tab-button"
						>
							{__('Open tab', 'blockera')}
						</Button>
					)
				)}
			</div>
		</div>
	);
});

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
	/** Handler to switch editor to a tab from this list: (tab) => void. */
	onOpenTab?: (tab: Tab) => void;
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
	onOpenTab,
	activeTabKey,
	isSaving = false,
}: CloseTabConfirmDialogProps): React.ReactElement | null {
	if (!isOpen || tabs.length === 0) {
		return null;
	}

	const isMultiple = tabs.length > 1;
	const tabCount = tabs.length;

	const modalTitle = __('Save changes before closing?', 'blockera');

	return (
		<Modal
			headerIcon={<Icon icon="warning" />}
			headerTitle={modalTitle}
			onRequestClose={onClose}
			className="blockera-tabs-close-confirm-dialog"
			actions={
				<div className="blockera-tabs-close-confirm-actions">
					<Button
						{...({
							'test-id':
								WORKSPACE_TABS_TEST_ID.closeConfirmCancel,
						} as Record<string, string>)}
						variant="tertiary"
						onClick={onClose}
						disabled={isSaving}
					>
						{__('Cancel', 'blockera')}
					</Button>

					<Button
						{...({
							'test-id':
								WORKSPACE_TABS_TEST_ID.closeConfirmCloseWithoutSaving,
						} as Record<string, string>)}
						variant="secondary"
						isDestructive
						onClick={onCloseWithoutSaving}
						disabled={isSaving}
					>
						{__("Don't save", 'blockera')}
					</Button>

					<Button
						{...({
							'test-id':
								WORKSPACE_TABS_TEST_ID.closeConfirmSaveAndClose,
						} as Record<string, string>)}
						variant="primary"
						onClick={onSaveAndClose}
						isBusy={isSaving}
						disabled={isSaving}
					>
						{isMultiple
							? __('Save all & close', 'blockera')
							: __('Save & close', 'blockera')}
					</Button>
				</div>
			}
		>
			<div
				{...({
					'test-id': WORKSPACE_TABS_TEST_ID.closeConfirmModalRoot,
				} as Record<string, string>)}
			>
				<div className="blockera-tabs-close-confirm-content">
					<p>
						{isMultiple
							? sprintf(
									/* translators: %d: number of tabs */
									__(
										'%d tabs have unsaved changes. Saving keeps your edits; closing without saving discards them.',
										'blockera'
									),
									tabCount
								)
							: __(
									'This tab has unsaved changes that will be lost if you close it.',
									'blockera'
								)}
					</p>

					<div
						className="blockera-tabs-close-confirm-tabs-list"
						{...({
							'test-id':
								WORKSPACE_TABS_TEST_ID.closeConfirmTabsList,
						} as Record<string, string>)}
					>
						{tabs.map((tab) => {
							const rowTitle = getTabTitle
								? getTabTitle(tab)
								: tab.title || __('Untitled', 'blockera');
							return (
								<CloseTabConfirmTabRow
									key={tab.key}
									tab={tab}
									title={rowTitle}
									activeTabKey={activeTabKey}
									onOpenTab={onOpenTab}
									isSaving={isSaving}
								/>
							);
						})}
					</div>
				</div>
			</div>
		</Modal>
	);
}
