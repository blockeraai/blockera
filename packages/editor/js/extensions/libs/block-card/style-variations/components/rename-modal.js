// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	Flex,
	Modal,
	Button,
	InputControl,
	NoticeControl,
	CheckboxControl,
	ControlContextProvider,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';
import { kebabCase } from '@blockera/utils';
import { componentInnerClassNames } from '@blockera/classnames';

export const RenameModal = ({
	style,
	buttonText,
	handleOnRename,
	isConfirmedChangeID,
	setIsOpenRenameModal,
	setIsConfirmedChangeID,
}: {
	style: Object,
	buttonText: string,
	isConfirmedChangeID: boolean,
	setIsOpenRenameModal: (isOpen: boolean) => void,
	setIsConfirmedChangeID: (isConfirmed: boolean) => void,
	handleOnRename: (
		newValue: { label: string, name: string },
		currentStyle: Object
	) => void,
}): MixedElement => {
	const [styleName, setStyleName] = useState(buttonText);
	const [styleID, setStyleID] = useState(style.name);

	return (
		<Modal
			className={componentInnerClassNames('rename-modal')}
			headerIcon={<Icon icon="pen" iconSize="24" />}
			headerTitle={__('Rename style variation', 'blockera')}
			isDismissible={true}
			onRequestClose={() => setIsOpenRenameModal(false)}
		>
			<Flex direction="column" gap={15}>
				<p>
					{__(
						'Adjust the name and ID of this style variation to keep your styles organized and consistent.',
						'blockera'
					)}
				</p>
				<ControlContextProvider
					value={{
						name: 'rename-style',
						value: styleName,
					}}
				>
					<InputControl
						label={__('Name', 'blockera')}
						onChange={(newValue: string) => setStyleName(newValue)}
					/>
				</ControlContextProvider>
				<ControlContextProvider
					value={{
						name: 'rename-style-id',
						value: styleID,
					}}
				>
					<InputControl
						label={__('ID', 'blockera')}
						onChange={(newValue: string) =>
							setStyleID(kebabCase(newValue.toLowerCase().trim()))
						}
					/>
				</ControlContextProvider>
				{styleID !== style.name && (
					<Flex
						gap={15}
						className={componentInnerClassNames('consent-wrapper')}
						direction="column"
					>
						<NoticeControl type={'warning'}>
							{__(
								'Changing the style variation ID will break existing connections. Blocks using the old ID will lose their styles unless updated manually.',
								'blockera'
							)}
						</NoticeControl>
						<ControlContextProvider
							value={{
								name: 'confirm-change-style-id',
								value: isConfirmedChangeID,
							}}
						>
							<CheckboxControl
								checkboxLabel={__(
									'I accept that blocks using the old ID will lose their styles.',
									'blockera'
								)}
								onChange={(newValue: boolean) =>
									setIsConfirmedChangeID(newValue)
								}
							/>
						</ControlContextProvider>
					</Flex>
				)}

				<Flex justifyContent="space-between">
					<Button
						disabled={
							styleID === style.name
								? styleName === buttonText
								: !isConfirmedChangeID
						}
						variant="primary"
						onClick={() => {
							handleOnRename(
								{ label: styleName, name: styleID },
								style
							);

							setIsOpenRenameModal(false);
						}}
					>
						{__('Save', 'blockera')}
					</Button>
					<Button
						variant="secondary"
						onClick={() => {
							setIsOpenRenameModal(false);
							setIsConfirmedChangeID(false);
						}}
					>
						{__('Cancel', 'blockera')}
					</Button>
				</Flex>
			</Flex>
		</Modal>
	);
};
