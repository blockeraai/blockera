// @flow

/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { select, dispatch } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { registerBlockStyle } from '@wordpress/blocks';
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
import { kebabCase, mergeObject } from '@blockera/utils';
import { componentInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import {
	getBlockeraGlobalStylesMetaData,
	setBlockeraGlobalStylesMetaData,
} from '../../helpers';
import { generateUniqueStyleVariationHash } from './utils';

export const AddNewStyleModal = ({
	blockStyles,
	blockName,
	styles,
	setStyles,
	setBlockStyles,
	setCurrentBlockStyleVariation,
	setCurrentActiveStyle,
	isOpen,
	setIsOpen,
	counter,
	setCounter,
	counterMap,
}: {
	blockStyles: Array<Object>,
	blockName: string,
	styles?: Object,
	setStyles?: (styles: Object) => void,
	setBlockStyles: (styles: Array<Object>) => void,
	setCurrentBlockStyleVariation: (style: Object) => void,
	setCurrentActiveStyle: (style: Object) => void,
	isOpen: boolean,
	setIsOpen: (isOpen: boolean) => void,
	counter: number,
	setCounter: (counter: number) => void,
	counterMap: Object,
}): MixedElement => {
	const { setStyleVariationBlocks } = dispatch('blockera/editor');
	const postId = select('core').__experimentalGetCurrentGlobalStylesId();
	const [globalStyles, setGlobalStyles] = useEntityProp(
		'root',
		'globalStyles',
		'styles',
		postId
	);

	// Generate default name and ID for new style variation
	const getDefaultNameAndId = useCallback(() => {
		// Find first available number by checking existing style names
		let number = blockStyles.length + 1;

		const existingNumbers = blockStyles
			.map((style) => {
				const match = style.name.match(/^style-(\d+)$/);
				return match ? parseInt(match[1]) : null;
			})
			.filter((num) => num !== null);

		// reset number if there are no existing numbers.
		if (!existingNumbers.length) {
			number = 1;
		} else {
			// Sort existing numbers and get the highest number
			// $FlowFixMe
			const maxNumber = Math.max(...existingNumbers);
			number = maxNumber + 1;
		}

		// Find first gap in sequence or use next number
		while (existingNumbers.includes(number)) {
			number++;
		}

		const defaultLabel = __('Style', 'blockera') + ' ' + number;
		const defaultId = `style-${generateUniqueStyleVariationHash()}`;

		return { defaultLabel, defaultId };
	}, [blockStyles]);

	const [styleName, setStyleName] = useState('');
	const [styleID, setStyleID] = useState('');
	const [isIdManuallyEdited, setIsIdManuallyEdited] = useState(false);
	const [duplicateIdError, setDuplicateIdError] = useState('');

	// Check for duplicate ID
	const checkDuplicateId = useCallback(
		(id: string) => {
			if (!id) {
				setDuplicateIdError('');
				return;
			}

			const blockLabel =
				blockStyles.find((style) => style.name === id)?.label || null;

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

	// Reset form when modal opens/closes and set default values
	useEffect(() => {
		if (isOpen) {
			const { defaultLabel, defaultId } = getDefaultNameAndId();
			setStyleName(defaultLabel);
			setStyleID(defaultId);
			setIsIdManuallyEdited(false);
			setDuplicateIdError('');
			// Check for duplicate on default ID
			checkDuplicateId(defaultId);
		}
	}, [isOpen, getDefaultNameAndId, checkDuplicateId]);

	// Track if this is the first render after modal opens to prevent sync on default values
	const [isInitialLoad, setIsInitialLoad] = useState(false);

	// Sync name to id (kebab case) when name changes, unless id is manually edited
	// Don't sync on initial load when default values are set
	useEffect(() => {
		// On initial load, mark that we've loaded and don't sync
		if (isOpen && !isInitialLoad) {
			setIsInitialLoad(true);
			return;
		}

		// Only sync if not initial load, name exists, and ID hasn't been manually edited
		if (isInitialLoad && !isIdManuallyEdited && styleName) {
			const kebabId = kebabCase(styleName.toLowerCase().trim());
			setStyleID(kebabId);
			// Check for duplicate when syncing
			checkDuplicateId(kebabId);
		}
	}, [
		styleName,
		isIdManuallyEdited,
		checkDuplicateId,
		isOpen,
		isInitialLoad,
	]);

	// Reset initial load flag when modal closes
	useEffect(() => {
		if (!isOpen) {
			setIsInitialLoad(false);
		}
	}, [isOpen]);

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

	// Handle add button click
	const handleAdd = () => {
		if (!styleName.trim() || !styleID.trim()) {
			return;
		}

		if (duplicateIdError) {
			return;
		}

		const newCounter = counter + 1;
		counterMap[blockName] = newCounter;
		setCounter(newCounter);

		// Find first available number by checking existing style names
		let number = blockStyles.length + 1;

		const existingNumbers = blockStyles
			.map((style) => {
				const match = style.name.match(/^style-(\d+)$/);
				return match ? parseInt(match[1]) : null;
			})
			.filter((num) => num !== null);

		// reset number if there are no existing numbers.
		if (!existingNumbers.length) {
			number = 1;
		} else {
			// Sort existing numbers and get the highest number
			// $FlowFixMe
			const maxNumber = Math.max(...existingNumbers);
			number = maxNumber + 1;
		}

		// Find first gap in sequence or use next number
		while (existingNumbers.includes(number)) {
			number++;
		}

		// Use provided ID or generate unique one
		const name = styleID || `style-${generateUniqueStyleVariationHash()}`;
		const styleLabel =
			styleName.trim() || __('Style', 'blockera') + ' ' + number;
		const newStyle = {
			name,
			label: styleLabel,
			icon: {
				name: 'blockera',
				library: 'blockera',
			},
		};

		setBlockStyles([...blockStyles, newStyle]);

		if (styles && 'function' === typeof setStyles) {
			setStyles({
				...styles,
				variations: {
					...(styles.variations || {}),
					[newStyle.name]: {},
				},
			});
		}

		setStyleVariationBlocks(newStyle, blockName, 'manual');
		registerBlockStyle(blockName, newStyle);
		setCurrentBlockStyleVariation(newStyle);
		setCurrentActiveStyle(newStyle);

		const newGlobalStyles = mergeObject(
			{
				...globalStyles,
				...(!globalStyles?.blockeraMetaData
					? {
							blockeraMetaData: getBlockeraGlobalStylesMetaData(),
						}
					: {}),
			},
			{
				blockeraMetaData: {
					blocks: {
						[blockName]: {
							variations: {
								[newStyle.name]: newStyle,
							},
						},
					},
				},
				blocks: {
					[blockName]: {
						variations: {
							[newStyle.name]: newStyle,
						},
					},
				},
			}
		);

		setGlobalStyles(newGlobalStyles);
		setBlockeraGlobalStylesMetaData(newGlobalStyles.blockeraMetaData);

		// Close modal and reset form
		setIsOpen(false);
		setStyleName('');
		setStyleID('');
		setIsIdManuallyEdited(false);
		setDuplicateIdError('');
	};

	const isAddDisabled =
		!styleName.trim() || !styleID.trim() || !!duplicateIdError;

	return (
		<Modal
			className={componentInnerClassNames('style-variation-modal')}
			headerIcon={<Icon icon="plus" iconSize="34" />}
			headerTitle={__('Add new style variation', 'blockera')}
			isDismissible={true}
			onRequestClose={() => setIsOpen(false)}
			actions={
				<>
					<Button
						data-test="cancel-add-style-button"
						variant="tertiary"
						onClick={() => {
							setIsOpen(false);
							setStyleName('');
							setStyleID('');
							setIsIdManuallyEdited(false);
							setDuplicateIdError('');
						}}
					>
						{__('Cancel', 'blockera')}
					</Button>

					<Button
						data-test="add-style-button"
						disabled={isAddDisabled}
						variant="primary"
						onClick={handleAdd}
					>
						{__('Add', 'blockera')}
					</Button>
				</>
			}
		>
			<Flex direction="column" gap={40}>
				<Flex direction="column" gap={25}>
					<p style={{ margin: '0', color: '#707070' }}>
						{__(
							"Create a new style variation by providing a name and ID. Choose the ID carefully — it's used as the CSS class name and can't be changed later without breaking blocks that use this style.",
							'blockera'
						)}
					</p>

					<Flex direction="column" gap={20}>
						<ControlContextProvider
							value={{
								name: 'add-style-name',
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
								name: 'add-style-id',
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

								{isIdManuallyEdited &&
									styleID !==
										kebabCase(
											styleName.toLowerCase().trim()
										) && (
										<Button
											onClick={() => {
												const syncedId = kebabCase(
													styleName
														.toLowerCase()
														.trim()
												);
												setStyleID(syncedId);
												setIsIdManuallyEdited(false);
												checkDuplicateId(syncedId);
											}}
											variant="tertiary"
											icon={
												<Icon
													icon="undo"
													iconSize="16"
												/>
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
