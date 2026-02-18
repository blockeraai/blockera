// @flow

/**
 * External dependencies
 */
import { applyFilters } from '@wordpress/hooks';
import { select, dispatch } from '@wordpress/data';
import { useEntityProp, store as coreStore } from '@wordpress/core-data';
import { useCallback, useState } from '@wordpress/element';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { store as editorStore } from '@wordpress/editor';
import { registerBlockStyle, unregisterBlockStyle } from '@wordpress/blocks';

/**
 * Blockera dependencies
 */
import { omit, mergeObject, kebabCase, cloneObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { getDefaultStyle } from '../utils';
import {
	getCalculatedNewStyle,
	isRootStyle,
	getStyleValuesFromSources,
	getBlockTypesForStyle,
	buildBlocksUpdateForStyle,
	buildDuplicateStyleMetaData,
	removeStyleVariationFromGlobalStyles,
	buildVariationMetaDataUpdate,
} from './helpers';
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
import { generateUniqueClassName } from '../../../../../extensions/components/registered-classnames';
import { isNormalStateOnBaseBreakpoint } from '../../../../../extensions/libs/block-card/block-states/helpers';
import {
	isInnerBlock,
	prepareBlockeraDefaultAttributesValues,
} from '../../../../../extensions/components/utils';

export const useBlockStyleItem = ({
	styles,
	counter,
	blockName,
	setStyles,
	counterMap,
	setCounter,
	blockStyles,
	cachedStyle,
	defaultStyles,
	setBlockStyles,
	setCachedStyle,
	inGlobalStylesPanel,
	onSelectStylePreview,
	setIsOpenContextMenu,
	setCurrentActiveStyle,
	setStyleVariationBlocks,
	getStyleVariationBlocks,
	currentBlockStyleVariation,
	deleteStyleVariationBlocks,
	setCurrentBlockStyleVariation,
}: {
	// The main state in global styles panel. for outside of the global styles panel, it's the empty object always.
	styles: Object,
	// The current counter state.
	counter: number,
	// The current selected block name.
	blockName: string,
	// The object to mapping blocks style variations count.
	counterMap: Object,
	// The blockeraGlobalStylesMetaData state.
	cachedStyle: Object,
	// The default styles object for the current selected block.
	defaultStyles: Object,
	// The block styles array the main of state for the current selected block.
	blockStyles: Array<Object>,
	// Whether the current block customizing in the global styles panel.
	inGlobalStylesPanel: boolean,
	// The current selected block style variation.
	currentBlockStyleVariation: Object,
	// The function to set the main state in global styles panel.
	setStyles: (styles: Object) => void,
	// The function to set the counter next state.
	setCounter: (counter: number) => void,
	// The function to set the cached style. (the blockeraGlobalStylesMetaData global state)
	setCachedStyle: (style: Object) => void,
	// The function to select the style preview.
	onSelectStylePreview: (style: Object) => void,
	// The function to set the current selected style as an active style for block level to add related css classes to that.
	setCurrentActiveStyle: T_SET_CURRENT_ACTIVE_STYLE,
	// The function to set the is open context menu.
	setIsOpenContextMenu: (isOpen: boolean) => void,
	// The function to set the block styles array. (update the BlockStyles component state)
	setBlockStyles: (styles: Array<Object>) => void,
	// The function to set the current selected style variation. (update the Blockera global state)
	setCurrentBlockStyleVariation: (style: Object) => void,
	// The function to delete the style variation blocks. (delete from the Blockera global state)
	deleteStyleVariationBlocks: (
		style: string,
		single: boolean,
		blockName?: string
	) => void,
	// The function to set the style variation blocks. (update the Blockera global state)
	setStyleVariationBlocks: (
		style: string,
		blocks: Array<string>,
		type?: 'auto' | 'manual'
	) => void,
	// The function to get the style variation blocks by name. (get from the Blockera global state)
	getStyleVariationBlocks: (style: string) => Array<string>,
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

			const getUpdatedMetaData = (newStyle: Object): Object =>
				mergeObject(
					blockeraMetaData,
					buildVariationMetaDataUpdate(blockName, currentStyle.name, {
						...newStyle,
						refId: newStyle.name,
						hasNewID:
							currentBlockStyleVariation?.name !== newStyle?.name,
					})
				);

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
			const newCounter = counter + 1;
			counterMap[blockName] = newCounter;
			setCounter(newCounter);

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

			const blockTypesToRegister = getBlockTypesForStyle(
				blockName,
				getStyleVariationBlocks,
				duplicateStyle.name
			);

			blockTypesToRegister.forEach((blockType) => {
				registerBlockStyle(blockType, duplicateStyle);
			});

			if (setStyleVariationBlocks) {
				setStyleVariationBlocks(
					duplicateStyle.name,
					blockTypesToRegister,
					'manual'
				);
			}

			setCurrentBlockStyleVariation(duplicateStyle);
			setCurrentActiveStyle(duplicateStyle);

			setBlockStyles([...blockStyles, duplicateStyle]);

			const { baseValues, userValues } = getStyleValuesFromSources(
				base,
				globalStyles,
				blockName,
				currentStyle
			);
			const duplicateStyleValues = mergeObject(baseValues, userValues);

			const normalizedStyle = getNormalizedStyle(
				{ ...styles, ...duplicateStyleValues },
				defaultStyles
			);

			const blocksUpdate = buildBlocksUpdateForStyle(
				blockTypesToRegister,
				duplicateStyle.name,
				normalizedStyle
			);

			const blockeraMetaData = buildDuplicateStyleMetaData(
				getBlockeraGlobalStylesMetaData(),
				blockName,
				duplicateStyle,
				blockTypesToRegister
			);

			setBlockeraGlobalStylesMetaData(blockeraMetaData);

			setGlobalStyles(
				mergeObject(globalStyles, {
					blockeraMetaData,
					blocks: blocksUpdate,
				})
			);

			setIsOpenContextMenu(false);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[styles, blockStyles, getStyleVariationBlocks, setStyleVariationBlocks]
	);

	const handleOnClearAllCustomizations = (currentStyle: Object) => {
		const newGlobalStyles = removeStyleVariationFromGlobalStyles(
			globalStyles,
			blockName,
			currentStyle
		);

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
		const updatedMetaData = mergeObject(
			blockeraMetaData,
			buildVariationMetaDataUpdate(blockName, currentStyle.name, {
				status,
				...currentStyle,
			})
		);

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

			if (!inGlobalStylesPanel) {
				setCurrentActiveStyle(getDefaultStyle(blockStyles));
				handleOnChangeAttributes('className', '', {
					shouldUpdateClassName: false,
					ref: {
						current: {
							action: 'disable-style',
						},
					},
				});
			}
		}
	};

	const handleOnDelete = (currentStyleName: string) => {
		setGlobalStyles(
			mergeObject(
				globalStyles,
				{
					blocks: {
						[blockName]: {
							variations: {
								[currentStyleName]: undefined,
							},
						},
					},
				},
				{
					forceUpdated: [currentStyleName],
					deletedProps: [currentStyleName],
				}
			)
		);

		const newBlockStyles = blockStyles.filter(
			(style) => style.name !== currentStyleName
		);

		setBlockStyles(newBlockStyles);

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

		deleteStyleVariationBlocks(currentStyleName, true, blockName);

		const newCounter = counter - 1;
		counterMap[blockName] = newCounter;
		setCounter(newCounter);

		setCurrentBlockStyleVariation(undefined);
		// If is not in global styles panel, set the default style as active style.
		if (!inGlobalStylesPanel) {
			const defaultStyle = getDefaultStyle(newBlockStyles);

			setCurrentActiveStyle(defaultStyle, 'click');
			onSelectStylePreview(defaultStyle);

			handleOnChangeAttributes('className', '', {
				shouldUpdateClassName: false,
				ref: {
					current: {
						action: 'delete-style',
					},
				},
			});
		}
	};

	/**
	 * Save all user customization into the current selected block style variation.
	 * It's working on selected block settings to assign this settings,
	 * as a global style for this block based on selected style variation.
	 * Triggers save of all dirty entities (global styles, current post, etc.) to persist to database.
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
		setGlobalBlockStyles(
			blockName,
			currentBlockStyleVariation?.name || 'default',
			currentStyleValue
		);

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

		setTimeout(async () => {
			await saveAllDirtyEntities();
		}, 1000);
	};

	const handleOnDetachStyle = (currentStyle: Object) => {
		setCurrentActiveStyle(getDefaultStyle(blockStyles), 'detach');

		const { getSelectedBlock } = select(blockEditorStore);
		const selectedBlock = getSelectedBlock();

		const className = generateUniqueClassName(
			selectedBlock.clientId,
			selectedBlock?.attributes?.className || ''
		);

		const { baseValues, userValues } = getStyleValuesFromSources(
			base,
			globalStyles,
			blockName,
			currentStyle
		);
		const newAttributes = mergeObject(
			mergeObject(selectedBlock.attributes, baseValues),
			userValues
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

/**
 * Save all dirty entities (global styles, current post, etc.) to persist to database.
 * Uses saveEditedEntityRecord - works in both site editor and post editor.
 * Uses savePost - works in post editor.
 * Saves in sequence, so the post is saved after all other entities are saved.
 *
 * @return {Promise<void>}
 */
const saveAllDirtyEntities = async (): Promise<void> => {
	// Save all dirty entities (global styles, current post, etc.) to persist to database.
	try {
		const { savePost } = dispatch(editorStore);
		const { saveEditedEntityRecord } = dispatch(coreStore);
		const dirtyRecords =
			select(coreStore).__experimentalGetDirtyEntityRecords?.() || [];

		const entitiesToSave = dirtyRecords.filter(
			(record) => !(record.kind === 'root' && record.name === 'site')
		);

		if (entitiesToSave.length > 0) {
			await Promise.all(
				entitiesToSave.map((record, index): Promise<void> => {
					let promiseResponse = saveEditedEntityRecord(
						record.kind,
						record.name,
						record.key
					);

					if (index === entitiesToSave.length - 1) {
						promiseResponse = savePost();
					}

					return promiseResponse;
				})
			);
		}
	} catch {
		// Error saving - WordPress will show error notification
	}
};
