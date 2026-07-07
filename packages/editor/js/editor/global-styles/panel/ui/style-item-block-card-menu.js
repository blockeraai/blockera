// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { useState, useMemo, useEffect, useRef } from '@wordpress/element';
import { getBlockType } from '@wordpress/blocks';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { isEquals } from '@blockera/utils';
import { Flex, Tooltip } from '@blockera/controls';
import { classNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { StyleItemMenu } from './style-item-menu';
import { useBlockStyleItem } from './use-block-style-item';
import { useUserCan } from '../../../../hooks/use-user-can';
import { STORE_NAME as BLOCKERA_EDITOR_STORE } from '../../../../store/constants';
import {
	useGlobalStylesPanelContext,
	useBlockStylesPickerContext,
	StyleItemMenuContextProvider,
} from '../context';
import { VARIATION_SURFACE_SIZE } from '../variation-surfaces';

export const StyleItemBlockCardMenu = ({
	style,
}: {
	style: Object,
}): MixedElement | null => {
	const {
		blockName,
		counter,
		counterMap,
		setCounter,
		blockStyles,
		setBlockStyles,
		setCurrentActiveStyle,
		handlePromotionPopover,
		onSelectStylePreview,
		variationSurface: pickerVariationSurface,
	} = useBlockStylesPickerContext();
	const {
		defaultStyles,
		getStyle = () => ({}),
		getStyleVariationBlocks,
		deleteStyleVariationBlocks,
		setStyleVariationBlocks,
		currentBlockStyleVariation,
		setCurrentBlockStyleVariation,
		setStyle: setStyleData = () => {},
		variationSurface: panelVariationSurface,
	} = useGlobalStylesPanelContext();

	const variationSurface =
		pickerVariationSurface !== undefined &&
		pickerVariationSurface !== null &&
		pickerVariationSurface !== ''
			? pickerVariationSurface
			: panelVariationSurface;

	const isSizeVariationUi = variationSurface === VARIATION_SURFACE_SIZE;

	const initializedCachedStyle = useSelect(
		(select) => {
			const storeSelect = select(BLOCKERA_EDITOR_STORE);
			if (!storeSelect) {
				return {};
			}

			const metaData =
				storeSelect.getBlockeraGlobalStylesMetaData?.() ?? {};
			const variations = metaData?.blocks?.[blockName]?.variations || {};

			if (Object.keys(variations).length > 0) {
				for (const variation in variations) {
					if (variations[variation]?.refId === style.name) {
						return variations[variation];
					}
					if (variation === style.name) {
						return variations[variation];
					}
				}
			}

			return {};
		},
		[blockName, style.name]
	);

	const [cachedStyle, setCachedStyle] = useState(initializedCachedStyle);

	useEffect(() => {
		if (!isEquals(cachedStyle, initializedCachedStyle)) {
			setCachedStyle(initializedCachedStyle);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initializedCachedStyle]);

	const buttonText = useMemo(() => {
		return (
			cachedStyle?.label ||
			style.label ||
			style.name ||
			__('Default', 'blockera')
		);
	}, [cachedStyle, style]);

	const [isOpenContextMenu, setIsOpenContextMenu] = useState(false);
	const [isOpenRenameModal, setIsOpenRenameModal] = useState(false);
	const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
	const [isOpenDuplicateModal, setIsOpenDuplicateModal] = useState(false);
	const [isOpenUsageForMultipleBlocks, setIsOpenUsageForMultipleBlocks] =
		useState(false);

	const blockCardContextMenuAnchorRef = useRef(null);

	const {
		handleOnEnable,
		handleOnDelete,
		handleOnRename,
		handleOnDuplicate,
		handleOnUsageForMultipleBlocks,
		handleOnSaveUsageForMultipleBlocks,
		isConfirmedChangeID,
		setIsConfirmedChangeID,
	} = useBlockStyleItem({
		style,
		counter,
		blockName,
		counterMap,
		setCounter,
		blockStyles,
		cachedStyle,
		defaultStyles,
		setBlockStyles,
		setCachedStyle,
		styles: getStyle(),
		inGlobalStylesPanel: true,
		onSelectStylePreview,
		setIsOpenContextMenu,
		setCurrentActiveStyle,
		setStyles: setStyleData,
		setStyleVariationBlocks,
		getStyleVariationBlocks,
		deleteStyleVariationBlocks,
		currentBlockStyleVariation,
		setCurrentBlockStyleVariation,
		skipBlockStyleRegistry: isSizeVariationUi,
		variationSurface,
	});

	const isUserCanSaveCustomizations = useUserCan('root', 'globalStyles');

	if (!isUserCanSaveCustomizations) {
		return null;
	}

	return (
		<Flex alignItems={'center'} gap={0}>
			{false === cachedStyle?.status && (
				<Icon
					icon="eye-hide"
					iconSize="20"
					style={{
						color: '#e20b0b',
						cursor: 'initial',
					}}
				/>
			)}

			<Tooltip
				text={
					isSizeVariationUi
						? __('Size Variation Settings', 'blockera')
						: __('Style Variation Settings', 'blockera')
				}
			>
				<span
					ref={blockCardContextMenuAnchorRef}
					className={classNames(
						'context-menu-trigger',
						'block-card-context-menu-anchor',
						'block-card__settings-menu'
					)}
					data-test={`open-${style.name}-block-card-contextmenu`}
					data-anchor="block-card-context-menu"
					onClick={() => {
						setIsOpenContextMenu(true);
					}}
				>
					<Icon iconSize="24" icon="more-vertical" />
				</span>
			</Tooltip>

			<StyleItemMenuContextProvider
				value={{
					anchorRef: blockCardContextMenuAnchorRef,
					blockTitle: getBlockType(blockName).title,
					style,
					counter,
					handlePromotionPopover,
					isOpenDeleteModal,
					setIsOpenDeleteModal,
					isOpenDuplicateModal,
					setIsOpenDuplicateModal,
					blockName,
					setCounter,
					buttonText,
					handleOnRename,
					handleOnDuplicate,
					handleOnEnable,
					handleOnDelete,
					handleOnUsageForMultipleBlocks,
					handleOnSaveUsageForMultipleBlocks,
					isConfirmedChangeID,
					setIsOpenUsageForMultipleBlocks,
					isOpenUsageForMultipleBlocks,
					setIsConfirmedChangeID,
					cachedStyle,
					isOpenRenameModal,
					setIsOpenRenameModal,
					isOpenContextMenu,
					setIsOpenContextMenu,
					setCurrentBlockStyleVariation,
					blockStyles,
					variationAllowsMultipleBlocks:
						variationSurface !== VARIATION_SURFACE_SIZE,
				}}
			>
				<StyleItemMenu />
			</StyleItemMenuContextProvider>
		</Flex>
	);
};
