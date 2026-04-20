// @flow

/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	Flex,
	Modal,
	Button,
	NoticeControl,
	CheckboxControl,
	ControlContextProvider,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';
import { componentInnerClassNames } from '@blockera/classnames';

export const DeleteModal = ({
	style,
	handleOnDelete,
	setIsOpenDeleteModal,
}: {
	style: Object,
	handleOnDelete: (style: Object) => void,
	setIsOpenDeleteModal: (isOpen: boolean) => void,
}): MixedElement => {
	const [isConfirmedDelete, setIsConfirmedDelete] = useState(false);

	return (
		<Modal
			className={componentInnerClassNames('delete-modal')}
			headerIcon={<Icon icon="trash" iconSize="34" />}
			headerTitle={
				style.label
					? sprintf(
							/* translators: %s: The style variation label. */
							__('Delete "%s"?', 'blockera'),
							style.label
						)
					: __('Delete style variation', 'blockera')
			}
			isDismissible={true}
			onRequestClose={() => setIsOpenDeleteModal(false)}
			actions={
				<>
					<Button
						data-test="cancel-delete-button"
						variant="tertiary"
						onClick={() => {
							setIsOpenDeleteModal(false);
							setIsConfirmedDelete(false);
						}}
					>
						{__('Cancel', 'blockera')}
					</Button>

					<Button
						data-test="delete-button"
						disabled={!isConfirmedDelete}
						variant="primary"
						onClick={() => {
							handleOnDelete(style.name);

							setIsOpenDeleteModal(false);
						}}
					>
						{__('Delete style variation', 'blockera')}
					</Button>
				</>
			}
		>
			<Flex direction="column" gap={30}>
				<Flex direction="column" gap={15}>
					<p style={{ margin: '0', color: '#1e1e1e' }}>
						{__(
							'The style variation will be permanently removed from your site. Any blocks using it will lose their styling and revert to their default appearance.',
							'blockera'
						)}
					</p>
				</Flex>

				<Flex
					gap={15}
					className={componentInnerClassNames('consent-wrapper')}
					direction="column"
				>
					<NoticeControl type={'error'}>
						{__('This action cannot be undone.', 'blockera')}
					</NoticeControl>

					<ControlContextProvider
						value={{
							name: 'confirm-change-style-id',
							value: isConfirmedDelete,
						}}
					>
						<CheckboxControl
							checkboxLabel={__(
								'I understand and want to delete this style variation.',
								'blockera'
							)}
							onChange={(newValue: boolean) =>
								setIsConfirmedDelete(newValue)
							}
							isBold={true}
						/>
					</ControlContextProvider>
				</Flex>
			</Flex>
		</Modal>
	);
};
