// @flow

/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useState, useCallback } from '@wordpress/element';

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
	DynamicHtmlFormatter,
	ControlContextProvider,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';
import { componentInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { sanitizeStyleVariationId } from './utils';

export const RenameModal = ({
	style,
	buttonText,
	blockStyles,
	handleOnRename,
	isConfirmedChangeID,
	setIsOpenRenameModal,
	setIsConfirmedChangeID,
}: {
	style: Object,
	buttonText: string,
	blockStyles: Array<Object>,
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
	const [duplicateIdError, setDuplicateIdError] = useState('');

	const checkDuplicateId = useCallback(
		(id: string) => {
			if (!id || id === style.name) {
				setDuplicateIdError('');
				return;
			}

			const blockLabel =
				blockStyles.find((s) => s.name === id)?.label || null;

			if (blockLabel !== null) {
				setDuplicateIdError(
					<>
						<p style={{ fontWeight: '500' }}>
							{sprintf(
								/* translators: %s: The block name. */
								__('Already in use by "%s".', 'blockera'),
								blockLabel
							)}
						</p>
						<p>{__('Try a different ID.', 'blockera')}</p>
					</>
				);
			} else {
				setDuplicateIdError('');
			}
		},
		[blockStyles, style.name]
	);

	const handleIdChange = (newValue: string) => {
		const kebabValue = sanitizeStyleVariationId(newValue);
		setStyleID(kebabValue);
		checkDuplicateId(kebabValue);
	};

	const isSaveDisabled =
		!!duplicateIdError ||
		(styleID === style.name
			? styleName === buttonText
			: !isConfirmedChangeID || !styleID.trim());

	return (
		<Modal
			className={componentInnerClassNames('style-variation-modal')}
			headerIcon={<Icon icon="pen" iconSize="34" />}
			headerTitle={
				style.label
					? sprintf(
							/* translators: %s: The style variation label. */
							__('Rename "%s"', 'blockera'),
							style.label
						)
					: __('Rename style variation', 'blockera')
			}
			isDismissible={true}
			onRequestClose={() => {
				setIsOpenRenameModal(false);
				setDuplicateIdError('');
			}}
			actions={
				<>
					<Button
						data-test="cancel-rename-button"
						variant="tertiary"
						onClick={() => {
							setIsOpenRenameModal(false);
							setIsConfirmedChangeID(false);
							setDuplicateIdError('');
						}}
					>
						{__('Cancel', 'blockera')}
					</Button>

					<Button
						data-test="save-rename-button"
						disabled={isSaveDisabled}
						variant="primary"
						onClick={() => {
							if (duplicateIdError) {
								return;
							}

							handleOnRename(
								{ label: styleName, name: styleID },
								style
							);

							setIsOpenRenameModal(false);
						}}
					>
						{__('Save', 'blockera')}
					</Button>
				</>
			}
		>
			<Flex direction="column" gap={40}>
				<Flex direction="column" gap={25}>
					<p style={{ margin: '0', color: '#707070' }}>
						{__(
							"The name is just a label and can be changed freely. Change the ID only if you haven't used this style on any block yet.",
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
								onChange={handleIdChange}
								columns="1fr 3fr"
								style={{ position: 'relative' }}
							>
								{duplicateIdError && (
									<NoticeControl type={'error'}>
										{duplicateIdError}
									</NoticeControl>
								)}

								{styleID !== style.name && (
									<NoticeControl type={'warning'}>
										<p style={{ fontWeight: '500' }}>
											{__(
												'ID changed — existing blocks will break',
												'blockera'
											)}
										</p>
										<p>
											<DynamicHtmlFormatter
												text={sprintf(
													/* translators: %1$s: Old class selector snippet. %2$s: New class selector snippet. */
													__(
														'Blocks currently use %1$s. After saving, update them to use %2$s manually.',
														'blockera'
													),
													'{old}',
													'{new}'
												)}
												replacements={{
													old: (
														<code
															style={{
																fontWeight:
																	'500',
															}}
														>
															.is-style-
															{style.name}
														</code>
													),
													new: (
														<code>
															.is-style-{styleID}
														</code>
													),
												}}
											/>
										</p>
									</NoticeControl>
								)}

								<p
									style={{
										margin: '0',
										color: '#707070',
										'font-size': '12px',
									}}
								>
									{__(
										'Lowercase letters, numbers, and hyphens only. Used as the CSS class name.',
										'blockera'
									)}
								</p>

								{styleID !== style.name && (
									<Button
										onClick={() => {
											setStyleID(style.name);
											setDuplicateIdError('');
										}}
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
						<ControlContextProvider
							value={{
								name: 'confirm-change-style-id',
								value: isConfirmedChangeID,
							}}
						>
							<CheckboxControl
								checkboxLabel={__(
									'I understand that blocks using the old ID will lose their styles.',
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
			</Flex>
		</Modal>
	);
};
