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
			className={componentInnerClassNames('style-variation-modal')}
			headerIcon={<Icon icon="pen" iconSize="34" />}
			headerTitle={__('Rename style variation', 'blockera')}
			isDismissible={true}
			onRequestClose={() => setIsOpenRenameModal(false)}
		>
			<Flex direction="column" gap={40}>
				<Flex direction="column" gap={25}>
					<p style={{ margin: '0', color: '#707070' }}>
						{__(
							'Adjust the name and ID of this style variation to keep your styles organized and consistent.',
							'blockera'
						)}
					</p>

					<Flex direction="column" gap={20}>
						<ControlContextProvider
							value={{
								name: 'rename-style',
								value: styleName,
							}}
						>
							<InputControl
								label={__('Name', 'blockera')}
								onChange={(newValue: string) =>
									setStyleName(newValue)
								}
								columns="1fr 3fr"
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
									setStyleID(
										kebabCase(newValue.toLowerCase().trim())
									)
								}
								columns="1fr 3fr"
								style={{ position: 'relative' }}
							>
								<p
									style={{
										margin: '5px 0 0',
										color: '#707070',
										'font-style': 'italic',
										'font-size': '13px',
									}}
								>
									{__(
										'Use a-z, 0-9, and hyphens only.',
										'blockera'
									)}
								</p>

								{styleID !== style.name && (
									<Button
										onClick={() => setStyleID(style.name)}
										variant="tertiary"
										icon={
											<Icon icon="undo" iconSize="16" />
										}
										size="input"
										style={{
											position: 'absolute',
											right: '4px',
											top: '4px',
											padding: '2px 6px 2px 4px',
											'--blockera-controls-input-height':
												'22px',
											gap: '2px',
											'font-size': '11px',
											'text-transform': 'uppercase',
											'font-weight': '500',
										}}
									>
										{__('Undo', 'blockera')}
									</Button>
								)}
							</InputControl>
						</ControlContextProvider>
					</Flex>
				</Flex>

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
								isBold={true}
							/>
						</ControlContextProvider>
					</Flex>
				)}

				<Flex justifyContent="space-between">
					<Button
						data-test="save-rename-button"
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
						data-test="cancel-rename-button"
						variant="tertiary"
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
