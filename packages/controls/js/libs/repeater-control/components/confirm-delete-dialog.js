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
import {
	Modal,
	Flex,
	Button,
	NoticeControl,
	CheckboxControl,
	DynamicHtmlFormatter,
} from '../../';
import { ControlContextProvider } from '../../../context';

type ConfirmDeleteDialogProps = {
	item: Object,
	handleRemoveItem: (item: Object) => void,
	onClose: () => void,
	deleteConfirmWarningText?: string,
};

const DEFAULT_DELETE_WARNING = __(
	'This action cannot be undone. Make sure you want to remove this item.',
	'blockera'
);

function ConfirmDeleteDialog({
	item,
	handleRemoveItem,
	onClose,
	deleteConfirmWarningText,
}: ConfirmDeleteDialogProps): MixedElement {
	const [isConfirmedDelete, setIsConfirmedDelete] = useState(false);

	const itemLabel = item?.label || item?.name || '';
	const warningText = deleteConfirmWarningText ?? DEFAULT_DELETE_WARNING;

	const handleRequestClose = () => {
		setIsConfirmedDelete(false);
		onClose();
	};

	return (
		<Modal
			className={componentInnerClassNames('style-variation-modal')}
			headerIcon={<Icon icon="trash" iconSize="34" />}
			headerTitle={__('Delete item', 'blockera')}
			isDismissible={true}
			onRequestClose={handleRequestClose}
		>
			<Flex direction="column" gap={40}>
				<Flex direction="column" gap={15}>
					<p style={{ margin: '0', color: '#1e1e1e' }}>
						<DynamicHtmlFormatter
							text={sprintf(
								/* translators: %s: Item label placeholder wrapped by formatter. */
								__(
									'Are you sure you want to delete %s?',
									'blockera'
								),
								'{item}'
							)}
							replacements={{
								item: <strong>{itemLabel}</strong>,
							}}
						/>
					</p>

					<p style={{ margin: '0', color: '#707070' }}>
						{warningText}
					</p>
				</Flex>

				<Flex
					gap={15}
					className={componentInnerClassNames('consent-wrapper')}
					direction="column"
				>
					<NoticeControl type={'error'}>
						{__(
							'Deleting this item cannot be undone. Related settings or content that still reference it may be affected.',
							'blockera'
						)}
					</NoticeControl>

					<ControlContextProvider
						value={{
							name: 'confirm-delete-repeater-item',
							value: isConfirmedDelete,
						}}
					>
						<CheckboxControl
							checkboxLabel={__(
								'I understand and want to delete this item.',
								'blockera'
							)}
							onChange={(newValue: boolean) =>
								setIsConfirmedDelete(newValue)
							}
							isBold={true}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex justifyContent="space-between">
					<Button
						data-test="confirm-delete-repeater-button"
						disabled={!isConfirmedDelete}
						variant="primary"
						onClick={() => {
							handleRemoveItem(item);
						}}
					>
						{__('Delete', 'blockera')}
					</Button>

					<Button
						data-test="cancel-delete-repeater-button"
						variant="tertiary"
						onClick={() => {
							setIsConfirmedDelete(false);
							onClose();
						}}
					>
						{__('Cancel', 'blockera')}
					</Button>
				</Flex>
			</Flex>
		</Modal>
	);
}

export default ConfirmDeleteDialog;
