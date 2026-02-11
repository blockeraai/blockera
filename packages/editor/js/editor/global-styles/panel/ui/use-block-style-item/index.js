// @flow

/**
 * External dependencies
 */
import { applyFilters } from '@wordpress/hooks';
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
import { isBaseBreakpoint } from '../../../../header-ui/components';
import { getAttributesWithIds } from '../../../../../hooks/use-attributes';
import { useBlockContext } from '../../../../../extensions/components/block-context';
import { blockeraExtensionsBootstrap } from '../../../../../extensions/libs/bootstrap';
import { generateUniqueClassName } from '../../../../../extensions/components/block-base';
import { isNormalStateOnBaseBreakpoint } from '../../../../../extensions/libs/block-card/block-states/helpers';
import {
	isInnerBlock,
	prepareBlockeraDefaultAttributesValues,
} from '../../../../../extensions/components/utils';

export const useBlockStyleItem = ({
	styles,
	blockName,
	setStyles,
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
	handleOnDuplicate: (
		currentStyle: Object,
		customValues?: { label: string, name: string }
	) => void,
	handleOnDetachStyle: (currentStyle: Object) => void,
	handleOnUsageForMultipleBlocks: (currentStyle: Object) => void,
	handleOnSaveCustomizations: (
		currentStyle: Object,
		defaultStyles?: Object
	) => void,
	handleOnEnable: (status: boolean, currentStyle: Object) => void,
	handleOnClearAllCustomizations: (currentStyle: Object) => void,
}) => {
	const {
		setBlockStyles: setGlobalBlockStyles,
		setEditorSelectedBlockEvent,
	} = dispatch('blockera/editor');
	const base = select('core').__experimentalGetCurrentThemeBaseGlobalStyles();
	const postId = select('core').__experimentalGetCurrentGlobalStylesId();
	const [globalStyles, setGlobalStyles] = useEntityProp(
		'root',
		'globalStyles',
		'styles',
		postId
	);

	const [isConfirmedChangeID, setIsConfirmedChangeID] = useState(false);

	const blockContextValue = useBlockContext();
	const { handleOnChangeAttributes, getAttributes } = blockContextValue;

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
		(
			currentStyle: Object,
			customValues?: { label: string, name: string }
		) => {
			const duplicateStyle = customValues
				? {
						name: customValues.name,
						label: customValues.label,
						icon: {
							name: 'blockera',
							library: 'blockera',
						},
					}
				: getCalculatedNewStyle({
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
								// $FlowFixMe
								[duplicateStyle.name]: duplicateStyle,
							},
						},
					},
				}
			);

			setBlockeraGlobalStylesMetaData(blockeraMetaData);

			setGlobalStyles(
				mergeObject(globalStyles, {
					blockeraMetaData,
					blocks: {
						[blockName]: {
							variations: {
								// $FlowFixMe
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
		let currentStyleValue = getNormalizedStyle(
			styleAttributes,
			_defaultStyles
		);

		// Run wp compatibility.
		blockeraExtensionsBootstrap();

		for (const key in currentStyleValue) {
			currentStyleValue = {
				...currentStyleValue,
				/**
				 * Filterable style value for wp compatibility reasons.
				 * running just for setAttributes functionalities.
				 */
				...applyFilters(
					'blockera.blockEdit.setAttributes',
					getNormalizedStyle(styleAttributes, _defaultStyles),
					key,
					currentStyleValue[key]?.value || currentStyleValue[key],
					{
						action: 'normal',
						reset: false,
					},
					getAttributes,
					{
						blockId: blockName,
						clientId: selectedBlock.clientId,
						innerBlocks: blockContextValue.additional.innerBlocks,
						currentBlock: blockContextValue.currentBlock,
						blockVariations: blockContextValue.blockVariations,
						defaultAttributes: blockContextValue.defaultAttributes,
						currentState: isInnerBlock(
							blockContextValue.currentBlock
						)
							? blockContextValue.currentInnerBlockState
							: blockContextValue.currentState,
						currentBreakpoint: blockContextValue.currentBreakpoint,
						activeBlockVariation:
							blockContextValue.activeBlockVariation,
						getActiveBlockVariation:
							blockContextValue.getActiveBlockVariation,
						currentInnerBlockState:
							blockContextValue.currentInnerBlockState,
						isNormalState: blockContextValue.isNormalState,
						isMasterBlock: !isInnerBlock(
							blockContextValue.currentBlock
						),
						isBaseBreakpoint: isBaseBreakpoint(
							blockContextValue.currentBreakpoint
						),
						isMasterNormalState: isNormalStateOnBaseBreakpoint(
							blockContextValue.currentState,
							blockContextValue.currentBreakpoint
						),
						insideBlockInspector: false,
					}
				),
			};
		}

		// Skip while not exists any changesets.
		if (!Object.keys(currentStyleValue).length) {
			return;
		}

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
		const defaultValue =
			prepareBlockeraDefaultAttributesValues(_defaultStyles);

		// Set the editor selected block event to save customizations.
		setEditorSelectedBlockEvent('save-customizations');

		handleOnChangeAttributes('className', `is-style-${currentStyle.name}`, {
			effectiveItems: defaultValue,
			shouldUpdateClassName: false,
			ref: {
				current: {
					action: 'save-customizations',
				},
			},
		});

		setCurrentActiveStyle(currentStyle, 'save-customizations');
	};

	const handleOnDetachStyle = (currentStyle: Object) => {
		setCurrentActiveStyle(getDefaultStyle(blockStyles), 'detach');

		const { getSelectedBlock } = select(blockEditorStore);

		const selectedBlock = getSelectedBlock();

		const className = generateUniqueClassName(
			selectedBlock.clientId,
			selectedBlock?.attributes?.className || ''
		);

		const newAttributes = mergeObject(
			mergeObject(
				selectedBlock.attributes,
				isRootStyle(currentStyle)
					? base?.styles?.blocks?.[blockName] || {}
					: base?.styles?.blocks?.[blockName]?.variations?.[
							currentStyle.name
						] || {}
			),
			isRootStyle(currentStyle)
				? globalStyles?.blocks?.[blockName] || {}
				: globalStyles?.blocks?.[blockName]?.variations?.[
						currentStyle.name
					] || {}
		);

		// Set the editor selected block event to detach style.
		setEditorSelectedBlockEvent('detach-style');

		handleOnChangeAttributes('className', `blockera-block ${className}`, {
			effectiveItems: getAttributesWithIds(
				newAttributes,
				'blockeraPropsId',
				true
			),
		});
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
