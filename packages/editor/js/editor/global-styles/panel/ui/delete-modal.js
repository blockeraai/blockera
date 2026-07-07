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
	isSizeVariationUi = false,
}: {
	style: Object,
	handleOnDelete: (style: Object) => void,
	setIsOpenDeleteModal: (isOpen: boolean) => void,
	isSizeVariationUi?: boolean,
}): MixedElement => {
	const [isConfirmedDelete, setIsConfirmedDelete] = useState(false);

	let headerTitle = isSizeVariationUi
		? __('Delete size variation', 'blockera')
		: __('Delete style variation', 'blockera');

	if (style.label) {
		headerTitle = sprintf(
			/* translators: %s: The variation label. */
			__('Delete "%s"?', 'blockera'),
			style.label
		);
	}

	return (
		<Modal
			className={componentInnerClassNames('delete-modal', {
				'is-variation-ui-size': isSizeVariationUi,
			})}
			headerIcon={<Icon icon="trash" iconSize="34" />}
			headerTitle={headerTitle}
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
						{isSizeVariationUi
							? __('Delete size variation', 'blockera')
							: __('Delete style variation', 'blockera')}
					</Button>
				</>
			}
		>
			<Flex direction="column" gap={30}>
				<Flex direction="column" gap={15}>
					<p style={{ margin: '0', color: '#1e1e1e' }}>
						{isSizeVariationUi
							? __(
									'The size variation will be permanently removed from your site. Any blocks using it will lose their size preset and revert to the default size.',
									'blockera'
								)
							: __(
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
							checkboxLabel={
								isSizeVariationUi
									? __(
											'I understand and want to delete this size variation.',
											'blockera'
										)
									: __(
											'I understand and want to delete this style variation.',
											'blockera'
										)
							}
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
