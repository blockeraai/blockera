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
	currentBlockStyleVariation,
	setCurrentBlockStyleVariation,
}: {
	styles: Object,
	blockName: string,
	cachedStyle: Object,
	blockStyles: Array<Object>,
	currentBlockStyleVariation: Object,
	setCachedStyle: (style: Object) => void,
	setCurrentActiveStyle: (style: Object) => void,
	setIsOpenContextMenu: (isOpen: boolean) => void,
	setBlockStyles: (styles: Array<Object>) => void,
	setStyles: (styles: Object, options?: Object) => void,
	setCurrentBlockStyleVariation: (style: Object) => void,
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
	handleOnSaveCustomizations: (currentStyle: Object) => void,
	handleOnEnable: (status: boolean, currentStyle: Object) => void,
	handleOnClearAllCustomizations: (currentStyle: Object) => void,
}) => {
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
									isDeleted:
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

				updatedMetaData = getUpdatedMetaData(editedStyle);

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

				setGlobalStyles({
					...editedGlobalStyles,
					blockeraMetaData: updatedMetaData,
				});

				unregisterBlockStyle(
					blockName,
					currentBlockStyleVariation.name
				);
				registerBlockStyle(blockName, editedStyle);

				const foundedStyle = blockStyles.find(
					(style) => style.name === currentBlockStyleVariation?.name
				);
				const index = blockStyles.indexOf(foundedStyle);

				setBlockStyles([
					...blockStyles.slice(0, index),
					currentBlockStyleVariation,
					...blockStyles.slice(index + 1),
				]);
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

			setCurrentBlockStyleVariation(duplicateStyle);

			setCurrentActiveStyle(duplicateStyle);

			setBlockStyles([...blockStyles, duplicateStyle]);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[styles, blockStyles]
	);

	const handleOnClearAllCustomizations = (currentStyle: Object) => {
		setStyles(
			{
				variations: {
					[currentStyle.name]: {},
				},
			},
			{
				action: 'clear-all-customizations',
			}
		);

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
		handleOnClearAllCustomizations,
	};
};
