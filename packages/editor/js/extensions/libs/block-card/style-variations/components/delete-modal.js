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
	DynamicHtmlFormatter,
	ControlContextProvider,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';
import { componentInnerClassNames } from '@blockera/classnames';

export const DeleteModal = ({
	style,
	counter,
	buttonText,
	setCounter,
	handleOnDelete,
	setIsOpenDeleteModal,
}: {
	style: Object,
	counter: number,
	buttonText: string,
	setCounter: (counter: number) => void,
	handleOnDelete: (style: Object) => void,
	setIsOpenDeleteModal: (isOpen: boolean) => void,
}): MixedElement => {
	const [isConfirmedDelete, setIsConfirmedDelete] = useState(false);

	return (
		<Modal
			className={componentInnerClassNames('delete-modal')}
			headerIcon={<Icon icon="trash" iconSize="34" />}
			headerTitle={__('Delete style variation', 'blockera')}
			isDismissible={true}
			onRequestClose={() => setIsOpenDeleteModal(false)}
		>
			<Flex direction="column" gap={40}>
				<Flex direction="column" gap={15}>
					<p style={{ margin: '0', color: '#1e1e1e' }}>
						<DynamicHtmlFormatter
							text={sprintf(
								/* translators: $1%s is a CSS selector, $2%s is ID. */
								__(
									'Are you sure you want to delete %s?',
									'blockera'
								),
								'{item}'
							)}
							replacements={{
								item: <strong>{buttonText}</strong>,
							}}
						/>
					</p>

					<p style={{ margin: '0', color: '#707070' }}>
						{__(
							'This will permanently delete the style and all connections to blocks using it. Those blocks will lose their styles and revert to defaults.',
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
						{__(
							'Deleting this style variation cannot be undone. Blocks using the style variation will lose their styles unless updated manually.',
							'blockera'
						)}
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

				<Flex justifyContent="space-between">
					<Button
						data-test="delete-button"
						disabled={!isConfirmedDelete}
						variant="primary"
						onClick={() => {
							handleOnDelete(style.name);

							setIsOpenDeleteModal(false);
						}}
					>
						{__('Delete', 'blockera')}
					</Button>

					<Button
						data-test="cancel-delete-button"
						variant="tertiary"
						onClick={() => {
							setIsOpenDeleteModal(false);
							setIsConfirmedDelete(false);
							setCounter(counter - 1);
						}}
					>
						{__('Cancel', 'blockera')}
					</Button>
				</Flex>
			</Flex>
		</Modal>
	);
};
