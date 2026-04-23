/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon as WordPressIcon } from '@wordpress/components';
import { layout } from '@wordpress/icons';
import { memo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Button, Flex, Modal } from '@blockera/controls';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { WORKSPACE_TABS_TEST_ID } from '../constants/testIds';
import {
	getUnavailableCardTypeLabel,
	getUnavailableDocumentKind,
	getUnavailableLeadMessage,
	getUnavailableModalHeaderTitle,
} from '../utils/unavailableDocumentPresentation';
import { getTabIcon } from '../utils/getTabIcon';

/**
 * Tab unavailable modal props.
 */
export interface TabUnavailableModalProps {
	/** Whether the modal is open. */
	isOpen: boolean;
	/** Document label (title or fallback). */
	documentLabel: string;
	/** Post type for copy and icon (e.g. `post`, `page`, `wp_template`). */
	documentType: string;
	/** Slug when known; refines template/pattern icons. */
	documentSlug: string | null;
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
	documentType,
	documentSlug,
	onConfirm,
}: TabUnavailableModalProps): React.ReactElement | null {
	if (!isOpen) {
		return null;
	}

	const kind = getUnavailableDocumentKind(documentType);
	const headerTitle = getUnavailableModalHeaderTitle(kind);
	const leadMessage = getUnavailableLeadMessage(kind);
	const cardTypeLabel = getUnavailableCardTypeLabel(kind);
	const documentIcon =
		kind === 'tab'
			? layout
			: getTabIcon({
					postType: documentType,
					slug: documentSlug,
				});

	return (
		<Modal
			headerIcon={<Icon icon="trash" />}
			headerTitle={headerTitle}
			onRequestClose={onConfirm}
			shouldCloseOnClickOutside={false}
			shouldCloseOnEsc
			isDismissible
			className="blockera-tabs-unavailable-modal"
			size="medium"
			actions={
				<Flex
					className="blockera-tabs-unavailable-modal__buttons"
					justifyContent="flex-end"
					gap="12px"
				>
					<Button
						variant="primary"
						onClick={onConfirm}
						{...({
							'test-id':
								WORKSPACE_TABS_TEST_ID.unavailableModalConfirm,
						} as Record<string, string>)}
					>
						{__('OK', 'blockera')}
					</Button>
				</Flex>
			}
		>
			<div
				className="blockera-tabs-unavailable-modal__content"
				{...({
					'test-id': WORKSPACE_TABS_TEST_ID.unavailableModalRoot,
				} as Record<string, string>)}
			>
				<p className="blockera-tabs-unavailable-modal__lead">
					{leadMessage}
				</p>

				<div className="blockera-tabs-unavailable-modal__card">
					<div
						className="blockera-tabs-unavailable-modal__card-icon-wrap"
						aria-hidden
					>
						<WordPressIcon icon={documentIcon} size={24} />
					</div>
					<div className="blockera-tabs-unavailable-modal__card-text">
						<div className="blockera-tabs-unavailable-modal__card-title">
							{documentLabel}
						</div>
						<div className="blockera-tabs-unavailable-modal__card-type">
							{cardTypeLabel}
						</div>
					</div>
				</div>

				<div className="blockera-tabs-unavailable-modal__note">
					<span className="blockera-tabs-unavailable-modal__note-icon">
						<Icon icon="information" library="ui" iconSize={18} />
					</span>
					<span className="blockera-tabs-unavailable-modal__note-text">
						{__(
							"The tab is closed and won't appear in your recently closed list.",
							'blockera'
						)}
					</span>
				</div>
			</div>
		</Modal>
	);
}

const TabUnavailableModal = memo(TabUnavailableModalComponent);
export default TabUnavailableModal;
