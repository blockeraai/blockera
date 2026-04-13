// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useState, useEffect, useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	Flex,
	Modal,
	Button,
	InputControl,
	NoticeControl,
	ControlContextProvider,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';
import { kebabCase } from '@blockera/utils';
import { componentInnerClassNames } from '@blockera/classnames';

export const DuplicateModal = ({
	style,
	handleOnDuplicate,
	setIsOpenDuplicateModal,
	setIsConfirmedChangeID,
	blockStyles,
}: {
	style: Object,
	buttonText: string,
	isConfirmedChangeID: boolean,
	setIsOpenDuplicateModal: (isOpen: boolean) => void,
	setIsConfirmedChangeID: (isConfirmed: boolean) => void,
	handleOnDuplicate: (
		currentStyle: Object,
		customValues?: { label: string, name: string }
	) => void,
	blockStyles: Array<Object>,
}): MixedElement => {
	// Generate default duplicate name and id
	const getDefaultDuplicateName = () => {
		const baseLabel =
			style.label && style.label.replace(/\s\(Copy(\s\d+|)\)$/, '')
				? style.label.replace(/\s\(Copy(\s\d+|)\)$/, '')
				: __('Style', 'blockera');

		const existingLabels = blockStyles.map((s) => s.label);
		let counter = 1;
		let newLabel = `${baseLabel} (Copy)`;

		while (existingLabels.includes(newLabel)) {
			newLabel = `${baseLabel} (Copy ${counter})`;
			counter++;
		}

		return newLabel;
	};

	const getDefaultDuplicateId = () => {
		const baseName = style.name
			? style.name.replace(/-copy(-?(\d+|))$/, '')
			: 'style';

		const existingNames = blockStyles.map((s) => s.name);
		let counter = 1;
		let newName = `${baseName}-copy`;

		while (existingNames.includes(newName)) {
			newName = `${baseName}-copy-${counter}`;
			counter++;
		}

		return newName;
	};

	const [styleName, setStyleName] = useState(getDefaultDuplicateName());
	const [styleID, setStyleID] = useState(getDefaultDuplicateId());
	const [isIdManuallyEdited, setIsIdManuallyEdited] = useState(false);
	const [duplicateIdError, setDuplicateIdError] = useState('');

	// Reset form when modal opens
	useEffect(() => {
		const defaultName = getDefaultDuplicateName();
		const defaultId = getDefaultDuplicateId();
		setStyleName(defaultName);
		setStyleID(defaultId);
		setIsIdManuallyEdited(false);
		setDuplicateIdError('');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [style, blockStyles]);

	// Check for duplicate ID
	const checkDuplicateId = useCallback(
		(id: string) => {
			if (!id) {
				setDuplicateIdError('');
				return;
			}

			const isDuplicate = blockStyles.some((s) => s.name === id);
			if (isDuplicate) {
				setDuplicateIdError(
					__(
						'This ID already exists. Please choose a different ID.',
						'blockera'
					)
				);
			} else {
				setDuplicateIdError('');
			}
		},
		[blockStyles]
	);

	// Sync name to id (kebab case) when name changes, unless id is manually edited
	useEffect(() => {
		if (!isIdManuallyEdited && styleName) {
			const kebabId = kebabCase(styleName.toLowerCase().trim());
			setStyleID(kebabId);
			// Check for duplicate when syncing
			checkDuplicateId(kebabId);
		}
	}, [styleName, isIdManuallyEdited, checkDuplicateId]);

	// Handle name input change
	const handleNameChange = (newValue: string) => {
		setStyleName(newValue);
	};

	// Handle ID input change
	const handleIdChange = (newValue: string) => {
		const kebabValue = kebabCase(newValue.toLowerCase().trim());
		setStyleID(kebabValue);
		setIsIdManuallyEdited(true);
		checkDuplicateId(kebabValue);
	};

	return (
		<Modal
			className={componentInnerClassNames('style-variation-modal')}
			headerIcon={<Icon icon="duplicate" iconSize="34" />}
			headerTitle={__('Duplicate style variation', 'blockera')}
			isDismissible={true}
			onRequestClose={() => setIsOpenDuplicateModal(false)}
		>
			<Flex direction="column" gap={40}>
				<Flex direction="column" gap={25}>
					<p style={{ margin: '0', color: '#707070' }}>
						{__(
							'Create a copy of this style variation with a new name and ID.',
							'blockera'
						)}
					</p>

					<Flex direction="column" gap={20}>
						<ControlContextProvider
							value={{
								name: 'duplicate-style',
								value: styleName,
							}}
						>
							<InputControl
								label={__('Name', 'blockera')}
								onChange={handleNameChange}
								columns="1fr 3fr"
							/>
						</ControlContextProvider>

						<ControlContextProvider
							value={{
								name: 'duplicate-style-id',
								value: styleID,
							}}
						>
							<InputControl
								label={__('ID', 'blockera')}
								onChange={handleIdChange}
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
										'Use a–z, 0–9, and hyphens only.',
										'blockera'
									)}
								</p>

								{styleID !== getDefaultDuplicateId() && (
									<Button
										onClick={() => {
											const defaultId =
												getDefaultDuplicateId();
											setStyleID(defaultId);
											setIsIdManuallyEdited(false);
											checkDuplicateId(defaultId);
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

				{duplicateIdError && (
					<NoticeControl type={'warning'}>
						{duplicateIdError}
					</NoticeControl>
				)}

				<Flex justifyContent="space-between">
					<Button
						data-test="save-duplicate-button"
						disabled={
							!styleName.trim() ||
							!styleID.trim() ||
							!!duplicateIdError
						}
						variant="primary"
						onClick={() => {
							handleOnDuplicate(style, {
								label: styleName,
								name: styleID,
							});

							setIsOpenDuplicateModal(false);
							setIsConfirmedChangeID(false);
						}}
					>
						{__('Duplicate', 'blockera')}
					</Button>

					<Button
						data-test="cancel-duplicate-button"
						variant="tertiary"
						onClick={() => {
							setIsOpenDuplicateModal(false);
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
