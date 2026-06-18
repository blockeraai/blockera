// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { componentInnerClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { Modal, Flex, Button, NoticeControl, CheckboxControl } from '../../';
import { ControlContextProvider } from '../../../context';

type ConfirmDeleteModalCopyProps = $ReadOnly<{
	headerTitle?: string,
	warningText?: string,
	errorNoticeText?: string,
	confirmCheckboxLabel?: string,
	deleteButtonLabel?: string,
}>;

type ConfirmDeleteModalProps = {
	item: Object,
	handleRemoveItem: (item: Object) => void,
	onClose: () => void,
	confirmDeleteModalProps?: ConfirmDeleteModalCopyProps,
};

const DEFAULT_DELETE_WARNING = __(
	'This action cannot be undone. Make sure you want to remove this item.',
	'blockera'
);

const DEFAULT_ERROR_NOTICE = __(
	'Deleting this item cannot be undone. Related settings or content that still reference it may be affected.',
	'blockera'
);

const DEFAULT_CHECKBOX_LABEL = __(
	'I understand and want to delete this item.',
	'blockera'
);

function ConfirmDeleteModal({
	item,
	handleRemoveItem,
	onClose,
	confirmDeleteModalProps,
}: ConfirmDeleteModalProps): MixedElement {
	const [isConfirmedDelete, setIsConfirmedDelete] = useState(false);

	const itemLabel = item?.label || item?.name || '';
	const itemLabelTrimmed = String(itemLabel).trim();
	const warningText =
		confirmDeleteModalProps?.warningText ?? DEFAULT_DELETE_WARNING;
	const headerTitle =
		confirmDeleteModalProps?.headerTitle ??
		(itemLabelTrimmed
			? sprintf(
					/* translators: %s: Repeater item label or name. */
					__('Delete "%s"?', 'blockera'),
					itemLabelTrimmed
				)
			: __('Delete item', 'blockera'));
	const errorNoticeText =
		confirmDeleteModalProps?.errorNoticeText ?? DEFAULT_ERROR_NOTICE;
	const confirmCheckboxLabel =
		confirmDeleteModalProps?.confirmCheckboxLabel ?? DEFAULT_CHECKBOX_LABEL;
	const deleteButtonLabel =
		confirmDeleteModalProps?.deleteButtonLabel ?? __('Delete', 'blockera');

	const handleRequestClose = () => {
		setIsConfirmedDelete(false);
		onClose();
	};

	return (
		<Modal
			className={componentInnerClassNames('delete-modal')}
			headerIcon={<Icon icon="trash" iconSize="34" />}
			headerTitle={headerTitle}
			isDismissible={true}
			onRequestClose={handleRequestClose}
			actions={
				<>
					<Button
						data-test="confirm-delete-modal-cancel-button"
						variant="tertiary"
						onMouseDown={(event: MouseEvent) => {
							event.stopPropagation();
						}}
						onClick={() => {
							setIsConfirmedDelete(false);
							onClose();
						}}
					>
						{__('Cancel', 'blockera')}
					</Button>

					<Button
						data-test="confirm-delete-modal-delete-button"
						disabled={!isConfirmedDelete}
						variant="primary"
						onMouseDown={(event: MouseEvent) => {
							event.stopPropagation();
						}}
						onClick={() => {
							handleRemoveItem(item);
						}}
					>
						{deleteButtonLabel}
					</Button>
				</>
			}
		>
			<div
				onMouseDown={(event: MouseEvent) => {
					event.stopPropagation();
				}}
			>
				<Flex direction="column" gap={30}>
					<Flex direction="column" gap={15}>
						<p style={{ margin: '0', color: '#1e1e1e' }}>
							{warningText}
						</p>
					</Flex>

					<Flex
						gap={15}
						className={componentInnerClassNames('consent-wrapper')}
						direction="column"
					>
						<NoticeControl type={'error'}>
							{errorNoticeText}
						</NoticeControl>

						<ControlContextProvider
							value={{
								name: 'confirm-delete-repeater-item',
								value: isConfirmedDelete,
							}}
						>
							<CheckboxControl
								checkboxLabel={confirmCheckboxLabel}
								onChange={(newValue: boolean) =>
									setIsConfirmedDelete(newValue)
								}
							/>
						</ControlContextProvider>
					</Flex>
				</Flex>
			</div>
		</Modal>
	);
}

export default ConfirmDeleteModal;
