// @flow

/**
 * External dependencies
 */
import { select, dispatch } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { useCallback, useState } from '@wordpress/element';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { registerBlockStyle, unregisterBlockStyle } from '@wordpress/blocks';

/**
 * Blockera dependencies
 */
import { mergeObject, kebabCase } from '@blockera/utils';

/**
 * Internal dependencies
 */

/**
 * Internal dependencies
 */
import { getDefaultStyle } from '../../utils';
import { getCalculatedNewStyle } from './helpers';

export const useBlockStyleItem = ({
	styles,
	blockName,
	setStyles,
	blockStyles,
	cachedStyle,
	setBlockStyles,
	setCachedStyle,
	setIsOpenContextMenu,
	setCurrentActiveStyle,
	deleteStyleVariationBlocks,
	currentBlockStyleVariation,
	setCurrentBlockStyleVariation,
}: {
	styles: Object,
	blockName: string,
	cachedStyle: Object,
	blockStyles: Array<Object>,
	currentBlockStyleVariation: Object,
	setStyles: (styles: Object) => void,
	setCachedStyle: (style: Object) => void,
	setCurrentActiveStyle: (style: Object) => void,
	setIsOpenContextMenu: (isOpen: boolean) => void,
	setBlockStyles: (styles: Array<Object>) => void,
	setCurrentBlockStyleVariation: (style: Object) => void,
	deleteStyleVariationBlocks: (
		style: string,
		single: boolean,
		blockName?: string
	) => void,
}): ({
	isConfirmedChangeID: boolean,
	setIsConfirmedChangeID: (isConfirmed: boolean) => void,
	handleOnRename: (
		newValue: { label: string, name: string },
		currentStyle: Object
	) => void,
	handleOnDelete: (currentStyleName: string) => void,
	handleOnDuplicate: (currentStyle: Object) => void,
	handleOnDetachStyle: (currentStyle: Object) => void,
	handleOnUsageForMultipleBlocks: (currentStyle: Object) => void,
	handleOnSaveCustomizations: (currentStyle: Object) => void,
	handleOnEnable: (status: boolean, currentStyle: Object) => void,
	handleOnClearAllCustomizations: (currentStyle: Object) => void,
}) => {
	const { setBlockStyles: setGlobalBlockStyles } =
		dispatch('blockera/editor');
	const base = select('core').__experimentalGetCurrentThemeBaseGlobalStyles();
	const postId = select('core').__experimentalGetCurrentGlobalStylesId();
	const [globalStyles, setGlobalStyles] = useEntityProp(
		'root',
		'globalStyles',
		'styles',
		postId
	);

	const [isConfirmedChangeID, setIsConfirmedChangeID] = useState(false);

	const { blockeraGlobalStylesMetaData } = window;

	const handleOnRename = useCallback(
		(
			newValue: { label: string, name: string },
			currentStyle: Object
		): void => {
			const { blockeraMetaData = blockeraGlobalStylesMetaData } =
				globalStyles;

			const editedStyle = {
				...currentStyle,
				...newValue,
			};

			const getUpdatedMetaData = (newStyle: Object): Object => {
				const updatedMetaData = mergeObject(blockeraMetaData, {
					blocks: {
						[blockName]: {
							variations: {
								[currentStyle.name]: {
									...newStyle,
									refId: newStyle.name,
									hasNewID:
										currentBlockStyleVariation?.name !==
										newStyle?.name,
								},
							},
						},
					},
				});

				return updatedMetaData;
			};

			let updatedMetaData;

			// Is user confirmed the change style name?
			if (isConfirmedChangeID) {
				editedStyle.name = kebabCase(newValue.name);

				const editedGlobalStyles = mergeObject(globalStyles, {
					blocks: {
						[blockName]: {
							variations: {
								[editedStyle.name]:
									globalStyles?.blocks?.[blockName]
										?.variations?.[
										currentBlockStyleVariation.name
									],
							},
						},
					},
				});

				const foundedStyle = blockStyles.find(
					(style) => style.name === currentBlockStyleVariation?.name
				);
				const index = blockStyles.indexOf(foundedStyle);

				setBlockStyles([
					...blockStyles.filter(
						(style) =>
							style.name !== currentBlockStyleVariation?.name
					),
					editedStyle,
				]);

				updatedMetaData = getUpdatedMetaData({
					...editedStyle,
					index,
				});

				setGlobalStyles({
					...editedGlobalStyles,
					blockeraMetaData: updatedMetaData,
				});

				unregisterBlockStyle(
					blockName,
					currentBlockStyleVariation.name
				);
				registerBlockStyle(blockName, editedStyle);

				deleteStyleVariationBlocks(currentStyle.name, true, blockName);
			} else {
				updatedMetaData = getUpdatedMetaData(editedStyle);

				setGlobalStyles({
					...globalStyles,
					blockeraMetaData: updatedMetaData,
				});
			}

			setCurrentBlockStyleVariation(editedStyle);

			window.blockeraGlobalStylesMetaData = updatedMetaData;
		},
		[
			blockName,
			blockStyles,
			globalStyles,
			setBlockStyles,
			setGlobalStyles,
			isConfirmedChangeID,
			currentBlockStyleVariation,
			blockeraGlobalStylesMetaData,
			setCurrentBlockStyleVariation,
		]
	);

	const handleOnUsageForMultipleBlocks = useCallback(
		(currentStyle: Object, action: 'add' | 'delete') => {
			if ('add' === action && !blockStyles.includes(currentStyle)) {
				setBlockStyles([...blockStyles, currentStyle]);
			} else if (
				'delete' === action &&
				blockStyles.includes(currentStyle)
			) {
				setBlockStyles(
					blockStyles.filter(
						(style) => style.name !== currentStyle.name
					)
				);
			}
		},
		[blockStyles, setBlockStyles]
	);

	const handleOnDuplicate = useCallback(
		(currentStyle) => {
			const duplicateStyle = getCalculatedNewStyle({
				styles,
				blockStyles,
				currentStyle,
				action: 'duplicate',
			});

			// Register the new block style
			registerBlockStyle(blockName, duplicateStyle);

			// Update styles context with new variation
			setStyles({
				...styles,
				variations: {
					...(styles.variations || {}),
					[duplicateStyle.name]: currentStyle,
				},
			});

			// TODO: Uncomment this when we will have a way to set the current block style variation while duplicating.
			// setCurrentBlockStyleVariation(duplicateStyle);
			// setCurrentActiveStyle(duplicateStyle);

			setBlockStyles([...blockStyles, duplicateStyle]);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[styles, blockStyles]
	);

	const handleOnClearAllCustomizations = (currentStyle: Object) => {
		setStyles({
			variations: {
				[currentStyle.name]: {},
			},
		});

		setGlobalBlockStyles(blockName, currentBlockStyleVariation.name, {});

		setIsOpenContextMenu(false);
	};

	const handleOnEnable = (status: boolean, currentStyle: Object) => {
		const { blockeraMetaData = blockeraGlobalStylesMetaData } =
			globalStyles;
		const updatedMetaData = mergeObject(blockeraMetaData, {
			blocks: {
				[blockName]: {
					variations: {
						[currentStyle.name]: {
							status,
							...currentStyle,
						},
					},
				},
			},
		});

		setGlobalStyles({
			...globalStyles,
			blockeraMetaData: updatedMetaData,
		});
		window.blockeraGlobalStylesMetaData = updatedMetaData;

		setCachedStyle({
			...cachedStyle,
			status,
		});

		if (false === status) {
			setCurrentBlockStyleVariation(undefined);
			setCurrentActiveStyle(getDefaultStyle(blockStyles));
		}
	};

	const handleOnDelete = (currentStyleName: string) => {
		setGlobalStyles({
			...globalStyles,
			blockeraMetaData: mergeObject(blockeraGlobalStylesMetaData, {
				blocks: {
					[blockName]: {
						variations: {
							[currentStyleName]: {
								isDeleted: true,
								...(blockStyles.filter(
									(style) => style.name === currentStyleName
								)?.[0] ?? {}),
							},
						},
					},
				},
			}),
		});

		setBlockStyles(
			blockStyles.filter((style) => style.name !== currentStyleName)
		);

		unregisterBlockStyle(blockName, currentStyleName);

		setStyles({
			...styles,
			...(styles.hasOwnProperty('variations') &&
			Object.keys(styles.variations).length > 0
				? {
						variations: Object.fromEntries(
							Object.entries(styles?.variations || {}).filter(
								([key]) => key !== currentStyleName
							)
						),
				  }
				: {}),
		});

		setCurrentBlockStyleVariation(undefined);
	};

	const handleOnSaveCustomizations = (currentStyle: Object) => {
		const { getSelectedBlock } = select(blockEditorStore);
		const selectedBlock = getSelectedBlock();

		const styleAttributes = selectedBlock.attributes;

		setGlobalStyles(
			mergeObject(globalStyles, {
				blocks: {
					[blockName]: {
						variations: {
							[currentStyle.name]: styleAttributes,
						},
					},
				},
			})
		);
	};

	const handleOnDetachStyle = (currentStyle: Object) => {
		setCurrentActiveStyle(getDefaultStyle(blockStyles));

		const { getSelectedBlock } = select(blockEditorStore);
		const { updateBlockAttributes } = dispatch(blockEditorStore);

		const selectedBlock = getSelectedBlock();

		updateBlockAttributes(
			selectedBlock.clientId,
			mergeObject(
				mergeObject(
					selectedBlock.attributes,
					base.styles.blocks[blockName].variations[currentStyle.name]
				),
				globalStyles.blocks[blockName].variations[currentStyle.name]
			)
		);
	};

	return {
		handleOnRename,
		handleOnEnable,
		handleOnDelete,
		handleOnDuplicate,
		handleOnDetachStyle,
		isConfirmedChangeID,
		setIsConfirmedChangeID,
		handleOnSaveCustomizations,
		handleOnUsageForMultipleBlocks,
		handleOnClearAllCustomizations,
	};
};
