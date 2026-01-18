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
import { omit, mergeObject, kebabCase, cloneObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { getDefaultStyle } from '../utils';
import { getCalculatedNewStyle, isRootStyle } from './helpers';
import {
	getBlockeraGlobalStylesMetaData,
	setBlockeraGlobalStylesMetaData,
} from '../../../helpers';
import { getNormalizedStyle } from '../../context';
import { type T_SET_CURRENT_ACTIVE_STYLE } from '../types';
import { getAttributesWithIds } from '../../../../../hooks/use-attributes';
import { generateUniqueClassName } from '../../../../../extensions/components/block-base';

export const useBlockStyleItem = ({
	styles,
	blockName,
	setStyles,
	userConfig,
	blockStyles,
	cachedStyle,
	defaultStyles,
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
	userConfig: Object,
	cachedStyle: Object,
	defaultStyles: Object,
	blockStyles: Array<Object>,
	currentBlockStyleVariation: Object,
	setStyles: (styles: Object) => void,
	setCachedStyle: (style: Object) => void,
	setCurrentActiveStyle: T_SET_CURRENT_ACTIVE_STYLE,
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
	handleOnSaveCustomizations: (
		currentStyle: Object,
		defaultStyles?: Object
	) => void,
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

	const handleOnRename = useCallback(
		(
			newValue: { label: string, name: string },
			currentStyle: Object
		): void => {
			const { blockeraMetaData = getBlockeraGlobalStylesMetaData() } =
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

				setBlockeraGlobalStylesMetaData(updatedMetaData);

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

				setBlockeraGlobalStylesMetaData(updatedMetaData);

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
			deleteStyleVariationBlocks,
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

			setCurrentBlockStyleVariation(duplicateStyle);
			setCurrentActiveStyle(duplicateStyle);

			setBlockStyles([...blockStyles, duplicateStyle]);

			const blockeraMetaData = mergeObject(
				getBlockeraGlobalStylesMetaData(),
				{
					blocks: {
						[blockName]: {
							variations: {
								[duplicateStyle.name]: duplicateStyle,
							},
						},
					},
				}
			);

			setBlockeraGlobalStylesMetaData(blockeraMetaData);

			setGlobalStyles(
				mergeObject(userConfig.styles, {
					blockeraMetaData,
					blocks: {
						[blockName]: {
							variations: {
								[duplicateStyle.name]: getNormalizedStyle(
									styles,
									defaultStyles
								),
							},
						},
					},
				})
			);

			setIsOpenContextMenu(false);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[styles, blockStyles]
	);

	const handleOnClearAllCustomizations = (currentStyle: Object) => {
		const newGlobalStyles = cloneObject(globalStyles);

		if (!isRootStyle(currentStyle)) {
			if (
				newGlobalStyles?.blocks?.[blockName]?.variations?.[
					currentStyle.name
				]
			) {
				if (
					1 ===
					Object.keys(
						newGlobalStyles?.blocks?.[blockName]?.variations
					).length
				) {
					delete newGlobalStyles?.blocks?.[blockName]?.variations;
					if (
						!Object.keys(newGlobalStyles?.blocks?.[blockName])
							.length
					) {
						delete newGlobalStyles?.blocks?.[blockName];
						if (!Object.keys(newGlobalStyles?.blocks).length) {
							delete newGlobalStyles?.blocks;
						}
					}
				} else {
					delete newGlobalStyles?.blocks?.[blockName]?.variations?.[
						currentStyle.name
					];
				}
			}
		} else if (
			Object.keys(newGlobalStyles?.blocks?.[blockName]?.variations).length
		) {
			newGlobalStyles.blocks[blockName] = {
				variations: newGlobalStyles?.blocks?.[blockName]?.variations,
			};
		} else {
			delete newGlobalStyles?.blocks?.[blockName];
			if (!Object.keys(newGlobalStyles?.blocks).length) {
				delete newGlobalStyles?.blocks;
			}
		}

		setGlobalStyles(newGlobalStyles);

		setGlobalBlockStyles(
			blockName,
			currentBlockStyleVariation?.name || 'default',
			{}
		);

		setIsOpenContextMenu(false);
	};

	const handleOnEnable = (status: boolean, currentStyle: Object) => {
		const { blockeraMetaData = getBlockeraGlobalStylesMetaData() } =
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
		setBlockeraGlobalStylesMetaData(updatedMetaData);

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
		const blockeraMetaData = mergeObject(
			getBlockeraGlobalStylesMetaData(),
			{
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
			}
		);

		setBlockeraGlobalStylesMetaData(blockeraMetaData);

		setGlobalStyles({
			...globalStyles,
			blockeraMetaData,
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

	/**
	 * Save all user customization into the current selected block style variation.
	 * It's working on selected block settings to assign this settings,
	 * as a global style for this block based on selected style variation.
	 *
	 * @param {Object} currentStyle the current style variation as object includes name, label, icon, ...
	 *
	 * @return {void}
	 */
	const handleOnSaveCustomizations = (
		currentStyle: Object,
		_defaultStyles: Object
	): void => {
		const { getSelectedBlock } = select(blockEditorStore);
		const selectedBlock = getSelectedBlock();

		let styleAttributes = selectedBlock.attributes;

		const ignoredAttributes: Array<string> = [];

		for (const attribute in styleAttributes) {
			if (ignoredAttributes.includes(attribute)) {
				continue;
			}

			if (!attribute.startsWith('blockera')) {
				ignoredAttributes.push(attribute);
			}
		}

		styleAttributes = omit(styleAttributes, ignoredAttributes);

		// Normalizing style attributes...
		const currentStyleValue = getNormalizedStyle(
			styleAttributes,
			_defaultStyles
		);

		// Skip while not exists any changesets.
		if (!Object.keys(currentStyleValue).length) {
			return;
		}

		const { updateBlockAttributes } = dispatch(blockEditorStore);

		// Cloned globalStyles object.
		let _globalStyles = cloneObject(globalStyles);

		if (isRootStyle(currentStyle)) {
			_globalStyles = mergeObject(_globalStyles, {
				blocks: {
					[blockName]: currentStyleValue,
				},
			});
		} else {
			_globalStyles = mergeObject(_globalStyles, {
				blocks: {
					[blockName]: {
						variations: {
							[currentStyle.name]: currentStyleValue,
						},
					},
				},
			});
		}

		setGlobalStyles(_globalStyles);

		updateBlockAttributes(_defaultStyles);
		setCurrentActiveStyle(currentStyle, 'save-customizations');
	};

	const handleOnDetachStyle = (currentStyle: Object) => {
		setCurrentActiveStyle(getDefaultStyle(blockStyles), 'detach');

		const { getSelectedBlock } = select(blockEditorStore);
		const { updateBlockAttributes } = dispatch(blockEditorStore);

		const selectedBlock = getSelectedBlock();

		const className = generateUniqueClassName(selectedBlock.clientId);

		const newAttributes = mergeObject(
			mergeObject(
				selectedBlock.attributes,
				base.styles.blocks[blockName].variations[currentStyle.name]
			),
			globalStyles.blocks[blockName].variations[currentStyle.name]
		);

		newAttributes.blockeraPropsId = getAttributesWithIds(
			newAttributes,
			'blockeraPropsId',
			true
		);
		newAttributes.className = `blockera-block ` + className;

		updateBlockAttributes(selectedBlock.clientId, newAttributes);
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
