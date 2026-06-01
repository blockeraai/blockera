// @flow

/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
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
import { componentInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { sanitizeStyleVariationId } from './utils';

export const DuplicateModal = ({
	style,
	handleOnDuplicate,
	setIsOpenDuplicateModal,
	setIsConfirmedChangeID,
	blockStyles,
	isSizeVariationUi = false,
}: {
	style: Object,
	buttonText: string,
	isConfirmedChangeID: boolean,
	isSizeVariationUi?: boolean,
	setIsOpenDuplicateModal: (isOpen: boolean) => void,
	setIsConfirmedChangeID: (isConfirmed: boolean) => void,
	handleOnDuplicate: (
		currentStyle: Object,
		customValues?: { label: string, name: string }
	) => void,
	blockStyles: Array<Object>,
}): MixedElement => {
	const defaultVariationLabel = isSizeVariationUi
		? __('Size', 'blockera')
		: __('Style', 'blockera');
	const defaultVariationSlugPrefix = isSizeVariationUi ? 'size' : 'style';

	// Generate default duplicate name and id
	const getDefaultDuplicateName = () => {
		const baseLabel =
			style.label && style.label.replace(/\s\(Copy(\s\d+|)\)$/, '')
				? style.label.replace(/\s\(Copy(\s\d+|)\)$/, '')
				: defaultVariationLabel;

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
			: defaultVariationSlugPrefix;

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

	// Check for duplicate ID (same behavior as add-new-style-modal)
	const checkDuplicateId = useCallback(
		(id: string) => {
			if (!id) {
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
		[blockStyles]
	);

	// Sync name to id (kebab case) when name changes, unless id is manually edited
	useEffect(() => {
		if (!isIdManuallyEdited && styleName) {
			const kebabId = sanitizeStyleVariationId(styleName);
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
		const kebabValue = sanitizeStyleVariationId(newValue);
		setStyleID(kebabValue);
		setIsIdManuallyEdited(true);
		checkDuplicateId(kebabValue);
	};

	let headerTitle = isSizeVariationUi
		? __('Duplicate size variation', 'blockera')
		: __('Duplicate style variation', 'blockera');

	if (style.label) {
		headerTitle = sprintf(
			/* translators: %s: The variation label. */
			__('Duplicate "%s"', 'blockera'),
			style.label
		);
	}

	return (
		<Modal
			className={componentInnerClassNames('style-variation-modal', {
				'is-variation-ui-size': isSizeVariationUi,
			})}
			headerIcon={<Icon icon="duplicate" iconSize="34" />}
			headerTitle={headerTitle}
			isDismissible={true}
			onRequestClose={() => setIsOpenDuplicateModal(false)}
			actions={
				<>
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

					<Button
						data-test="save-duplicate-button"
						disabled={
							!styleName.trim() ||
							!styleID.trim() ||
							!!duplicateIdError
						}
						variant="primary"
						onClick={() => {
							if (duplicateIdError) {
								return;
							}

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
				</>
			}
		>
			<Flex direction="column" gap={40}>
				<Flex direction="column" gap={25}>
					<p style={{ margin: '0', color: '#707070' }}>
						{isSizeVariationUi
							? __(
									"A copy will be created with a new name and ID. Choose the ID carefully — it will be used in your site's code and cannot be changed without breaking blocks that use this size.",
									'blockera'
								)
							: __(
									"A copy will be created with a new name and ID. Choose the ID carefully — it will be used in your site's code and cannot be changed without breaking the styles on affected blocks.",
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
								{duplicateIdError && (
									<NoticeControl type={'error'}>
										{duplicateIdError}
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
			</Flex>
		</Modal>
	);
};
