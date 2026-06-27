// @flow

/**
 * External dependencies
 */
import { applyFilters } from '@wordpress/hooks';
import { select, dispatch } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { useCallback, useState } from '@wordpress/element';
import { store as blockEditorStore } from '@wordpress/block-editor';
import {
	unregisterBlockStyle,
	registerBlockStyle,
	getBlockType,
} from '@wordpress/blocks';

/**
 * Blockera dependencies
 */
import { omit, mergeObject, cloneObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	getDefaultStyle,
	replaceActiveSizeVariation,
	BLOCK_SIZE_VARIATION_CLASS_PREFIX,
	sanitizeStyleVariationId,
} from '../utils';
import {
	getCalculatedNewStyle,
	isRootStyle,
	buildBlocksUpdateForStyle,
	buildDuplicateStyleMetaDataUpdate,
	getMergedNormalizedStyleFromSources,
	getStyleValuesFromSources,
	getBlockTypesForStyleFromStore,
	registerStyleForBlockTypes,
	unregisterStyleFromBlockTypes,
	setStyleVariationBlocksInStore,
	markStyleAsDeletedInMetaData,
	buildMetadataTransferForRenamedStyle,
	buildSaveCustomizationsEffectiveItems,
	sanitizeGlobalStylesNode,
} from './helpers';
import { getNormalizedStyle } from '../../context';
import { isBaseBreakpoint } from '../../../../header-ui/components';
import { getAttributesWithIds } from '../../../../../hooks/use-attributes';
import { useBlockContext } from '../../../../../extensions/components/block-context';
import { blockeraExtensionsBootstrap } from '../../../../../extensions/libs/bootstrap';
import { generateUniqueClassName } from '../../../../../extensions/components/registered-classnames';
import { isNormalStateOnBaseBreakpoint } from '../../../../../extensions/libs/block-card/block-states/helpers';
import {
	isInnerBlock,
	prepareBlockeraDefaultAttributesValues,
	getIgnoredAttributesForSchema,
} from '../../../../../extensions/components/utils';
import {
	type TUseBlockStyleItemProps,
	type TUseBlockStyleItemReturn,
} from './types';
import { setBlockDynamicStylesCount } from '../use-block-styles-counter';
import {
	applyBlockeraSetAttributesCompatibility,
	getCompatibleAttributes,
} from '../../../../../extensions/components/get-compatible-attributes';
import { VARIATION_SURFACE_STYLE } from '../../variation-surfaces';

export const useBlockStyleItem = ({
	style,
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
	// eslint-disable-next-line no-unused-vars -- Used via store for correct behavior outside panel
	setStyleVariationBlocks,
	// eslint-disable-next-line no-unused-vars -- Used via store for correct behavior outside panel
	getStyleVariationBlocks,
	currentBlockStyleVariation,
	deleteStyleVariationBlocks,
	setCurrentBlockStyleVariation,
	skipBlockStyleRegistry = false,
	variationSurface = VARIATION_SURFACE_STYLE,
}: TUseBlockStyleItemProps): TUseBlockStyleItemReturn => {
	const {
		setBlockStyles: setGlobalBlockStyles,
		setEditorSelectedBlockEvent,
		updateBlockeraGlobalStylesMetaData,
		mergeBlockeraGlobalStylesMetaData,
		setBlockeraGlobalStylesMetaData,
	} = dispatch('blockera/editor');
	const getBlockeraGlobalStylesMetaData =
		select('blockera/editor').getBlockeraGlobalStylesMetaData;
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
	const {
		args,
		isActive,
		getAttributes,
		availableAttributes,
		handleOnChangeAttributes,
	} = blockContextValue;

	/** @see ./handleOnRename.md for Cursor IDE instructions */
	const handleOnRename = useCallback(
		(
			newValue: { label: string, name: string },
			currentStyle: Object
		): void => {
			const blockeraMetaData = getBlockeraGlobalStylesMetaData();

			const editedStyle = {
				...currentStyle,
				...newValue,
			};

			// Only include fields we're updating - do NOT spread full style to avoid
			// overwriting other fields when style object lacks them.
			const getVariationUpdate = (newStyle: Object): Object => ({
				label: newStyle.label,
				name: newStyle.name,
				refId: newStyle.name,
				hasNewID: currentStyle?.name !== newStyle?.name,
			});

			let updatedMetaData;

			// Is user confirmed the change style name?
			if (isConfirmedChangeID) {
				editedStyle.name = sanitizeStyleVariationId(newValue.name);
				editedStyle.icon = {
					name: 'blockera',
					library: 'blockera',
				};

				// Rule 1.1: Create clone from merged config (baseConfig + userConfig)
				const normalizedStyle = getMergedNormalizedStyleFromSources(
					base,
					globalStyles,
					blockName,
					currentStyle,
					styles,
					defaultStyles,
					getNormalizedStyle
				);

				// Rule 1.2 & 1.3: Build blocks update (new style) and remove old variation
				const blockTypesToRegister = getBlockTypesForStyleFromStore(
					blockName,
					currentStyle.name
				);
				const blocksUpdate = buildBlocksUpdateForStyle(
					blockTypesToRegister,
					editedStyle.name,
					normalizedStyle
				);
				// Augment each block type to remove old variation key
				blockTypesToRegister.forEach((blockType) => {
					const blockVariations =
						blocksUpdate[blockType]?.variations || {};
					blocksUpdate[blockType] = {
						variations: {
							...blockVariations,
							[currentStyle.name]: undefined,
						},
					};
				});

				// Add new variation to metadata (preserve status; use blockTypesToRegister for enabledIn)
				const existingVariation =
					blockeraMetaData?.blocks?.[blockName]?.variations?.[
						currentStyle?.name
					] || {};
				const mergedVariation = mergeObject(existingVariation, {
					...editedStyle,
					index: blockStyles.findIndex(
						(s) => s.name === currentStyle?.name
					),
					...getVariationUpdate(editedStyle),
				});
				if (existingVariation.hasOwnProperty('status')) {
					mergedVariation.status = existingVariation.status;
				}

				// Rule 1.4: Mark previous style as deleted in metadata
				const metaDataWithDeleted = markStyleAsDeletedInMetaData(
					blockeraMetaData,
					blockName,
					currentStyle.name,
					currentStyle,
					base || {}
				);

				// Assign old style's metadata to new style (blocks + variations enabledIn/disabledIn)
				const metadataTransfer = buildMetadataTransferForRenamedStyle(
					blockeraMetaData,
					blockName,
					currentStyle,
					editedStyle,
					blockTypesToRegister,
					mergedVariation
				);
				updatedMetaData = mergeObject(
					metaDataWithDeleted,
					metadataTransfer
				);

				setBlockStyles([
					...blockStyles.filter((s) => s.name !== currentStyle?.name),
					editedStyle,
				]);

				setBlockeraGlobalStylesMetaData(updatedMetaData);

				setGlobalStyles(
					mergeObject(
						globalStyles,
						{
							blocks: blocksUpdate,
							blockeraMetaData: updatedMetaData,
						},
						{
							forceUpdated: [currentStyle.name],
							deletedProps: [currentStyle.name],
						}
					)
				);

				// Register new style name in block references in pervious style name.
				if (!skipBlockStyleRegistry) {
					registerStyleForBlockTypes(
						blockTypesToRegister,
						editedStyle
					);
					setStyleVariationBlocksInStore(
						editedStyle.name,
						blockTypesToRegister
					);

					setTimeout(() => {
						unregisterStyleFromBlockTypes(
							[blockName],
							currentStyle.name
						);
						setStyleVariationBlocksInStore(
							currentStyle.name,
							blockTypesToRegister.filter(
								(blockType) => blockType !== blockName
							)
						);
					}, 1);
				}
			} else {
				// Only update variation fields - merge with existing, don't override other customizations
				updateBlockeraGlobalStylesMetaData(
					blockName,
					currentStyle.name,
					getVariationUpdate(editedStyle)
				);
				updatedMetaData = getBlockeraGlobalStylesMetaData();

				setGlobalStyles({
					...globalStyles,
					blockeraMetaData: updatedMetaData,
				});
			}
		},
		[
			base,
			styles,
			blockName,
			blockStyles,
			globalStyles,
			defaultStyles,
			setBlockStyles,
			setGlobalStyles,
			isConfirmedChangeID,
			setBlockeraGlobalStylesMetaData,
			getBlockeraGlobalStylesMetaData,
			updateBlockeraGlobalStylesMetaData,
			skipBlockStyleRegistry,
		]
	);

	/** @see ./handleOnUsageForMultipleBlocks.md for Cursor IDE instructions */
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

	/** @see ./handleOnUsageForMultipleBlocks.md for Cursor IDE instructions */
	const handleOnSaveUsageForMultipleBlocks = useCallback(
		(params: {
			style: Object,
			action: string,
			enabledIn: Array<string>,
			disabledIn: Array<string>,
			blockType: ?string,
			newGlobalStyles: Object,
			validItems: Array<Object>,
			selectedBlockStyle: string,
		}) => {
			const {
				style: styleParam,
				action: actionParam,
				enabledIn,
				disabledIn,
				blockType: blockTypeParam,
				newGlobalStyles,
				validItems,
				selectedBlockStyle,
			} = params;

			setBlockeraGlobalStylesMetaData(newGlobalStyles.blockeraMetaData);

			if ('disable-all' === actionParam) {
				if (!skipBlockStyleRegistry) {
					deleteStyleVariationBlocks(styleParam.name, false);
					setStyleVariationBlocks(
						styleParam.name,
						enabledIn,
						'manual'
					);
					disabledIn.forEach((block: string) => {
						unregisterBlockStyle(block, styleParam.name);
						if (selectedBlockStyle === block) {
							handleOnUsageForMultipleBlocks(
								styleParam,
								'delete'
							);
						}
					});
				}
				setGlobalStyles(newGlobalStyles);
				return;
			}

			if ('enable-all' === actionParam) {
				if (!skipBlockStyleRegistry) {
					setStyleVariationBlocks(
						styleParam.name,
						enabledIn,
						'manual'
					);
					enabledIn.forEach((block: string) => {
						registerBlockStyle(block, styleParam);
						if (selectedBlockStyle === block) {
							handleOnUsageForMultipleBlocks(styleParam, 'add');
						}
					});
					validItems
						.filter((item) => !enabledIn.includes(item.name))
						.forEach((item) => {
							unregisterBlockStyle(item.name, styleParam.name);
							if (selectedBlockStyle === item.name) {
								handleOnUsageForMultipleBlocks(
									styleParam,
									'delete'
								);
							}
						});
				}
				setGlobalStyles(newGlobalStyles);
				return;
			}

			if (!skipBlockStyleRegistry) {
				if ('single-enable' === actionParam) {
					setStyleVariationBlocks(
						styleParam.name,
						enabledIn,
						'manual'
					);
					if (disabledIn?.length && blockTypeParam) {
						setTimeout(() => {
							deleteStyleVariationBlocks(
								styleParam.name,
								false,
								blockTypeParam,
								disabledIn
							);
						}, 5);
					}
				} else if ('single-disable' === actionParam && blockTypeParam) {
					deleteStyleVariationBlocks(
						styleParam.name,
						true,
						blockTypeParam
					);
					if (enabledIn?.length) {
						setTimeout(() => {
							setStyleVariationBlocks(
								styleParam.name,
								enabledIn,
								'manual'
							);
						}, 5);
					}
				}

				enabledIn.forEach((block: string) => {
					if (selectedBlockStyle === block) {
						handleOnUsageForMultipleBlocks(styleParam, 'add');
					}
					registerBlockStyle(block, styleParam);
				});

				disabledIn.forEach((block: string) => {
					if (selectedBlockStyle === block) {
						handleOnUsageForMultipleBlocks(styleParam, 'delete');
					}
					unregisterBlockStyle(block, styleParam.name);
				});
			}

			setGlobalStyles(newGlobalStyles);
		},
		[
			setBlockeraGlobalStylesMetaData,
			setGlobalStyles,
			setStyleVariationBlocks,
			deleteStyleVariationBlocks,
			handleOnUsageForMultipleBlocks,
			skipBlockStyleRegistry,
		]
	);

	/** @see ./handleOnDuplicate.md for Cursor IDE instructions */
	const handleOnDuplicate = useCallback(
		(
			currentStyle: Object,
			customValues?: { label: string, name: string }
		) => {
			const newCounter = counter + 1;
			setBlockDynamicStylesCount(
				counterMap,
				blockName,
				variationSurface,
				newCounter
			);
			setCounter(newCounter);

			const duplicateStyle = customValues
				? {
						name: sanitizeStyleVariationId(customValues.name),
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
			const blockTypesToRegister = isRootStyle(currentStyle)
				? [blockName]
				: getBlockTypesForStyleFromStore(blockName, currentStyle.name);
			if (!skipBlockStyleRegistry) {
				registerStyleForBlockTypes(
					blockTypesToRegister,
					duplicateStyle
				);
				setStyleVariationBlocksInStore(
					duplicateStyle.name,
					blockTypesToRegister
				);
			}

			setCurrentBlockStyleVariation(duplicateStyle);
			setCurrentActiveStyle(duplicateStyle);

			setBlockStyles([...blockStyles, duplicateStyle]);

			const normalizedStyle = sanitizeGlobalStylesNode(
				getMergedNormalizedStyleFromSources(
					base,
					globalStyles,
					blockName,
					currentStyle,
					styles,
					defaultStyles,
					getNormalizedStyle
				)
			);

			const blocksUpdate = buildBlocksUpdateForStyle(
				blockTypesToRegister,
				duplicateStyle.name,
				normalizedStyle
			);
			const metaDataUpdate = buildDuplicateStyleMetaDataUpdate(
				blockName,
				duplicateStyle,
				blockTypesToRegister
			);
			mergeBlockeraGlobalStylesMetaData(metaDataUpdate);

			const blockeraMetaData = getBlockeraGlobalStylesMetaData();
			setGlobalStyles(
				mergeObject(globalStyles, {
					blockeraMetaData,
					blocks: blocksUpdate,
				})
			);

			setIsOpenContextMenu(false);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[styles, blockStyles]
	);

	/** @see ./handleOnEnable.md for Cursor IDE instructions */
	const handleOnEnable = (status: boolean, currentStyle: Object) => {
		const blockeraMetaData = getBlockeraGlobalStylesMetaData();
		const existingVariation =
			blockeraMetaData?.blocks?.[blockName]?.variations?.[
				currentStyle.name
			];

		// When variation doesn't exist in metadata, include currentStyle details
		// to avoid storing incomplete { variationName: { status } } only
		const variationData =
			existingVariation && Object.keys(existingVariation).length > 0
				? { status }
				: {
						...currentStyle,
						status,
					};

		updateBlockeraGlobalStylesMetaData(
			blockName,
			currentStyle.name,
			variationData
		);

		const updatedMetaData = getBlockeraGlobalStylesMetaData();

		setGlobalStyles({
			...globalStyles,
			blockeraMetaData: updatedMetaData,
		});

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

	/** @see ./handleOnDelete.md for Cursor IDE instructions */
	const handleOnDelete = (currentStyleName: string) => {
		const currentStyle = blockStyles.find(
			(s) => s.name === currentStyleName
		);
		const blockeraMetaData = getBlockeraGlobalStylesMetaData();
		const updatedMetaData = markStyleAsDeletedInMetaData(
			blockeraMetaData,
			blockName,
			currentStyleName,
			currentStyle || style,
			base || {}
		);

		setBlockeraGlobalStylesMetaData(updatedMetaData);

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
					blockeraMetaData: updatedMetaData,
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

		if (!skipBlockStyleRegistry) {
			unregisterBlockStyle(blockName, currentStyleName);
		}

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

		if (!skipBlockStyleRegistry) {
			deleteStyleVariationBlocks(currentStyleName, true, blockName);
		}

		const newCounter = counter - 1;
		setBlockDynamicStylesCount(
			counterMap,
			blockName,
			variationSurface,
			newCounter
		);
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

	/** @see ./handleOnSaveCustomizations.md for Cursor IDE instructions */
	const handleOnSaveCustomizations = (
		currentStyle: Object,
		_defaultStyles: Object
	): void => {
		const { getSelectedBlock } = select(blockEditorStore);
		const selectedBlock = getSelectedBlock();
		const attributes = selectedBlock.attributes;

		let styleAttributes = applyFilters(
			'blockera.blockEdit.attributes',
			mergeObject(
				{ ...attributes },
				prepareBlockeraDefaultAttributesValues(_defaultStyles)
			),
			args
		);

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
		const blockeraStyleValue = getNormalizedStyle(
			styleAttributes,
			_defaultStyles
		);

		// Run wp compatibility.
		blockeraExtensionsBootstrap();

		const setAttributesBlockDetail = {
			blockId: blockName,
			clientId: selectedBlock.clientId,
			innerBlocks: blockContextValue.additional.innerBlocks,
			currentBlock: blockContextValue.currentBlock,
			blockVariations: blockContextValue.blockVariations,
			defaultAttributes: blockContextValue.defaultAttributes,
			currentState: isInnerBlock(blockContextValue.currentBlock)
				? blockContextValue.currentInnerBlockState
				: blockContextValue.currentState,
			currentBreakpoint: blockContextValue.currentBreakpoint,
			activeBlockVariation: blockContextValue.activeBlockVariation,
			getActiveBlockVariation: blockContextValue.getActiveBlockVariation,
			currentInnerBlockState: blockContextValue.currentInnerBlockState,
			isNormalState: blockContextValue.isNormalState,
			isMasterBlock: !isInnerBlock(blockContextValue.currentBlock),
			isBaseBreakpoint: isBaseBreakpoint(
				blockContextValue.currentBreakpoint
			),
			isMasterNormalState: isNormalStateOnBaseBreakpoint(
				blockContextValue.currentState,
				blockContextValue.currentBreakpoint
			),
			insideBlockInspector: false,
			editorSelectedBlockEvent: 'save-customizations',
		};

		const currentStyleValue = mergeObject(
			blockeraStyleValue,
			applyBlockeraSetAttributesCompatibility({
				blockeraKeys: blockeraStyleValue,
				getBlockeraValueForKey: (featureId) =>
					blockeraStyleValue[featureId]?.value ||
					blockeraStyleValue[featureId],
				getAttributes,
				blockDetail: setAttributesBlockDetail,
				controlRef: {
					action: 'normal',
					reset: false,
				},
			})
		);

		// Skip while not exists any changesets.
		if (!Object.keys(currentStyleValue).length) {
			return;
		}

		const sanitizedStyleValue = sanitizeGlobalStylesNode(currentStyleValue);

		// Cloned globalStyles object.
		let _globalStyles = cloneObject(globalStyles);

		if (isRootStyle(currentStyle)) {
			_globalStyles = mergeObject(_globalStyles, {
				blocks: {
					..._globalStyles?.blocks,
					[blockName]: sanitizedStyleValue,
				},
			});
		} else {
			_globalStyles = mergeObject(_globalStyles, {
				blocks: {
					..._globalStyles?.blocks,
					[blockName]: {
						variations: {
							[currentStyle.name]: sanitizedStyleValue,
						},
					},
				},
			});
		}

		setGlobalStyles(_globalStyles);
		setGlobalBlockStyles(
			blockName,
			currentBlockStyleVariation?.name || currentStyle?.name || 'default',
			sanitizedStyleValue
		);

		const defaultValue = buildSaveCustomizationsEffectiveItems({
			blockName,
			defaultStyles: _defaultStyles,
			blockAttributesSchema: getBlockType(blockName)?.attributes || {},
			getAttributes,
			blockContextValue,
			selectedBlock,
		});

		// Set the editor selected block event to save customizations.
		setEditorSelectedBlockEvent('save-customizations');

		const variationClassPrefix = skipBlockStyleRegistry
			? BLOCK_SIZE_VARIATION_CLASS_PREFIX
			: 'is-style-';

		handleOnChangeAttributes(
			'className',
			`${variationClassPrefix}${currentStyle.name}`,
			{
				effectiveItems: defaultValue,
				shouldUpdateClassName: false,
				ref: {
					current: {
						action: 'save-customizations',
					},
				},
			}
		);

		setCurrentActiveStyle(currentStyle, 'save-customizations');
	};

	/** @see ./handleOnDetachStyle.md for Cursor IDE instructions */
	const handleOnDetachStyle = (currentStyle: Object) => {
		setCurrentActiveStyle(getDefaultStyle(blockStyles), 'detach');

		// Run wp compatibility.
		blockeraExtensionsBootstrap();

		const { getSelectedBlock } = select(blockEditorStore);
		const selectedBlock = getSelectedBlock();

		let sourceClassName = selectedBlock?.attributes?.className || '';

		if (skipBlockStyleRegistry) {
			sourceClassName = replaceActiveSizeVariation(
				sourceClassName,
				currentStyle,
				null,
				'detach'
			);
		}

		const className = generateUniqueClassName(
			selectedBlock.clientId,
			sourceClassName
		);

		const { baseValues, userValues } = getStyleValuesFromSources(
			base,
			globalStyles,
			blockName,
			currentStyle
		);
		const mergedAttributes = mergeObject(
			mergeObject(selectedBlock.attributes, baseValues),
			userValues
		);
		const attributesSchema = getBlockType(blockName)?.attributes || {};
		const ignoredAttributes =
			getIgnoredAttributesForSchema(attributesSchema);
		const newAttributes = omit(mergedAttributes, ignoredAttributes);

		// Set the editor selected block event to detach style.
		setEditorSelectedBlockEvent('detach-style');

		const compatibleAttributes = getCompatibleAttributes({
			args: {
				...args,
				insideBlockInspector: false,
			},
			isActive,
			availableAttributes,
			attributes: cloneObject(newAttributes),
			defaultAttributes: getBlockType(blockName).attributes,
		});

		handleOnChangeAttributes('className', `blockera-block ${className}`, {
			effectiveItems: getAttributesWithIds(
				compatibleAttributes,
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
		handleOnSaveUsageForMultipleBlocks,
	};
};
