// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { dispatch } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import { useState, useMemo, useEffect } from '@wordpress/element';
import {
	Fill,
	__experimentalTruncate as Truncate,
} from '@wordpress/components';
import { getBlockType } from '@wordpress/blocks';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { isEquals } from '@blockera/utils';
import { Flex, Button, ChangeIndicator, Tooltip } from '@blockera/controls';
import { classNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { getDefaultStyle } from '../utils';
import { StyleItemMenu } from './style-item-menu';
import { useBlockStyleItem } from './use-block-style-item';
import { useUserCan } from '../../../../../hooks/use-user-can';
import { useGlobalStylesPanelContext } from '../../../../../canvas-editor/components/block-global-styles-panel-screen/context';

export const StyleItem = ({
	style,
	counter,
	blockName,
	setCounter,
	activeStyle,
	blockStyles,
	hasChangesets,
	setBlockStyles,
	styleItemHandler,
	onSelectStylePreview,
	setCurrentActiveStyle,
	setCurrentPreviewStyle,
	inGlobalStylesPanel = false,
}: {
	style: Object,
	counter: number,
	blockName: string,
	activeStyle: Object,
	hasChangesets?: boolean,
	blockStyles: Array<Object>,
	inGlobalStylesPanel: boolean,
	setCounter: (counter: number) => void,
	styleItemHandler: (style: Object) => void,
	onSelectStylePreview: (style: Object) => void,
	setCurrentActiveStyle: (style: Object) => void,
	setBlockStyles: (styles: Array<Object>) => void,
	setCurrentPreviewStyle: (style: Object) => void,
}): MixedElement => {
	const {
		getStyle = () => ({}),
		getStyleVariationBlocks,
		currentBlockStyleVariation,
		setCurrentBlockStyleVariation,
		setStyle: setStyleData = () => {},
	} = useGlobalStylesPanelContext() || {
		getStyleVariationBlocks: () => [],
		currentBlockStyleVariation: undefined,
		setCurrentBlockStyleVariation: () => {},
	};
	const { blockeraGlobalStylesMetaData } = window;
	const initializedCachedStyle = useMemo(() => {
		const variations =
			blockeraGlobalStylesMetaData?.blocks?.[blockName]?.variations || {};

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
	}, [blockeraGlobalStylesMetaData, blockName, style]);

	const [cachedStyle, setCachedStyle] = useState(initializedCachedStyle);

	useEffect(() => {
		if (!isEquals(cachedStyle, initializedCachedStyle)) {
			setCachedStyle(initializedCachedStyle);
		}
	}, [cachedStyle, initializedCachedStyle]);

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
	const [isOpenUsageForMultipleBlocks, setIsOpenUsageForMultipleBlocks] =
		useState(false);
	const [isOpenBlockCardContextMenu, setIsOpenBlockCardContextMenu] =
		useState(false);
	const [isOpenBlockCardRenameModal, setIsOpenBlockCardRenameModal] =
		useState(false);

	const {
		handleOnEnable,
		handleOnDelete,
		handleOnRename,
		handleOnDuplicate,
		handleOnDetachStyle,
		isConfirmedChangeID,
		setIsConfirmedChangeID,
		handleOnUsageForMultipleBlocks,
		handleOnSaveCustomizations,
		handleOnClearAllCustomizations,
	} = useBlockStyleItem({
		blockName,
		blockStyles,
		cachedStyle,
		setBlockStyles,
		setCachedStyle,
		styles: getStyle(),
		setIsOpenContextMenu,
		setCurrentActiveStyle,
		setStyles: setStyleData,
		currentBlockStyleVariation,
		setCurrentBlockStyleVariation,
	});

	const isUserCanSaveCustomizations = useUserCan('root', 'globalStyles');

	const isActive: boolean = activeStyle.name === style.name;

	const defaultStyle = getDefaultStyle(blockStyles);

	const activeInBlocks = getStyleVariationBlocks(style.name);

	return (
		<>
			<div
				role="button"
				tabIndex={0}
				className={classNames(
					'block-editor-block-styles__item__button',
					{
						'is-active':
							inGlobalStylesPanel && !currentBlockStyleVariation
								? false
								: isActive,
						'is-focus': isOpenBlockCardContextMenu,
						'is-enabled':
							!cachedStyle?.hasOwnProperty('status') ||
							true === cachedStyle?.status,
					}
				)}
				key={style.name}
				label={
					style?.isDefault && style?.name !== 'default'
						? buttonText + ` (${__('Default', 'blockera')})`
						: ''
				}
				onMouseEnter={() => {
					// Skip mouse enter if style is disabled.
					if (false === cachedStyle?.status || isOpenContextMenu) {
						return;
					}

					// Skip mouse enter if rendered inside global styles panel.
					if (inGlobalStylesPanel) {
						return;
					}

					styleItemHandler(style);
				}}
				onFocus={() => {
					// Skip focus if style is disabled.
					if (false === cachedStyle?.status || isOpenContextMenu) {
						return;
					}

					// Skip focus if rendered inside global styles panel.
					if (inGlobalStylesPanel) {
						return;
					}

					styleItemHandler(style);
				}}
				onMouseLeave={() => {
					// Skip mouse leave if style is disabled.
					if (false === cachedStyle?.status || isOpenContextMenu) {
						return;
					}

					// Skip mouse leave if rendered inside global styles panel.
					if (inGlobalStylesPanel) {
						return;
					}

					styleItemHandler(null);
				}}
				onBlur={() => {
					// Skip blur if style is disabled.
					if (false === cachedStyle?.status || isOpenContextMenu) {
						return;
					}

					// Skip blur if rendered inside global styles panel.
					if (inGlobalStylesPanel) {
						return;
					}

					setCurrentPreviewStyle(null);
					styleItemHandler(null);
				}}
				onClick={(event) => {
					// Skip blur if style is disabled.
					if (false === cachedStyle?.status) {
						return;
					}

					// Skip click on actions opener element.
					if (
						!event.target.innerText ||
						-1 === event.target.innerText.indexOf(style.label)
					) {
						return;
					}

					if (inGlobalStylesPanel) {
						// Navigate to the block style variation customization panel when clicked in global styles context.

						const { setSelectedBlockStyleVariation } =
							dispatch('blockera/editor');

						setSelectedBlockStyleVariation(style);
						setCurrentActiveStyle(style);
						return setCurrentBlockStyleVariation(style);
					}

					onSelectStylePreview(style);
				}}
				onKeyDown={(event) => {
					// Handle Enter key press
					if (event.key !== 'Enter') {
						return;
					}

					if (inGlobalStylesPanel) {
						// Navigate to the block style variation customization panel when Enter is pressed in global styles context.

						const { setSelectedBlockStyleVariation } =
							dispatch('blockera/editor');

						setSelectedBlockStyleVariation(style);
						setCurrentActiveStyle(style);
						return setCurrentBlockStyleVariation(style);
					}

					onSelectStylePreview(style);
				}}
				aria-current={isActive}
				data-test={`style-${style.name}`}
			>
				<Flex
					alignItems={'center'}
					justifyContent={'flex-start'}
					className="block-editor-block-styles__item-text"
					gap={2}
				>
					<Truncate numberOfLines={1}>{buttonText}</Truncate>

					{!inGlobalStylesPanel && isActive && (
						<Icon icon="check" library="wp" iconSize="20" />
					)}

					<Flex
						gap={4}
						alignItems={'center'}
						style={{ marginLeft: 'auto' }}
					>
						{defaultStyle && style.isDefault && (
							<Tooltip
								text={__(
									'Default style variation used globally for all blocks',
									'blockera'
								)}
							>
								<Icon
									icon="asterisk"
									iconSize="16"
									style={{
										opacity: '0.4',
									}}
								/>
							</Tooltip>
						)}

						{false === cachedStyle?.status && (
							<Tooltip
								text={__(
									'This style variation is disabled',
									'blockera'
								)}
								style={{
									'--tooltip-bg': !isActive
										? '#e20b0b'
										: '#000000',
								}}
							>
								<Icon
									icon="eye-hide"
									iconSize="20"
									style={{
										color: !isActive
											? '#e20b0b'
											: 'currentColor',
									}}
								/>
							</Tooltip>
						)}

						{!style?.isDefault && activeInBlocks.length > 0 && (
							<Flex
								gap={0}
								direction="row"
								style={{ position: 'relative' }}
							>
								{activeInBlocks
									.slice(0, 3)
									.map((block, index) => {
										const { icon, title } =
											getBlockType(block);

										return (
											<Tooltip
												key={`${block}-${index}`}
												text={sprintf(
													/* translators: $1%s is a block title. */
													__(
														'This style variation is used in the “%1$s” block',
														'blockera'
													),
													title
												)}
												style={{
													'--tooltip-bg': !isActive
														? '#e20b0b'
														: '#000000',
												}}
											>
												<div
													className="circle-multiple-blocks"
													style={{
														marginRight: '4px',
													}}
												>
													{icon.src}
												</div>
											</Tooltip>
										);
									})}
								<div className="circle-multiple-blocks">
									{activeInBlocks.length}
								</div>
							</Flex>
						)}

						{style.icon && (
							<Tooltip
								text={
									style.icon.name === 'blockera'
										? __(
												'Style variation added or customized by Blockera',
												'blockera'
										  )
										: __(
												'Style variation from theme or block editor',
												'blockera'
										  )
								}
							>
								<Icon
									icon={style.icon.name}
									library={style.icon.library}
									iconSize="16"
									style={{
										opacity: '0.4',
										'margin-right': '-4px',
										position: 'relative',
										'z-index': '10',
									}}
								/>
							</Tooltip>
						)}

						<span
							className="context-menu-trigger"
							data-test={`open-${style.name}-contextmenu`}
						>
							<Icon
								icon="more-vertical"
								iconSize="20"
								onClick={() => setIsOpenContextMenu(true)}
								style={{
									opacity: '0.4',
								}}
							/>
						</span>
					</Flex>
				</Flex>

				<StyleItemMenu
					style={style}
					counter={counter}
					isOpenDeleteModal={isOpenDeleteModal}
					setIsOpenDeleteModal={setIsOpenDeleteModal}
					blockName={blockName}
					setCounter={setCounter}
					buttonText={buttonText}
					handleOnRename={handleOnRename}
					handleOnDuplicate={handleOnDuplicate}
					handleOnClearAllCustomizations={
						handleOnClearAllCustomizations
					}
					handleOnEnable={handleOnEnable}
					handleOnDelete={handleOnDelete}
					handleOnUsageForMultipleBlocks={
						handleOnUsageForMultipleBlocks
					}
					isConfirmedChangeID={isConfirmedChangeID}
					setIsOpenUsageForMultipleBlocks={
						setIsOpenUsageForMultipleBlocks
					}
					isOpenUsageForMultipleBlocks={isOpenUsageForMultipleBlocks}
					setIsConfirmedChangeID={setIsConfirmedChangeID}
					cachedStyle={cachedStyle}
					isOpenRenameModal={isOpenRenameModal}
					setIsOpenRenameModal={setIsOpenRenameModal}
					isOpenContextMenu={isOpenContextMenu}
					setIsOpenContextMenu={setIsOpenContextMenu}
					setCurrentBlockStyleVariation={
						setCurrentBlockStyleVariation
					}
				/>
			</div>

			{isActive && (
				<Fill name="block-inspector-style-actions">
					<Button
						disabled={
							false === cachedStyle?.status ||
							!hasChangesets ||
							!isUserCanSaveCustomizations
						}
						className={classNames('action-save-customizations', {
							'action-disabled': false,
						})}
						variant="tertiary"
						onClick={() => handleOnSaveCustomizations(style)}
						size="input"
						data-test={'save-customizations'}
						style={{
							gap: '4px',
							padding: '2px 0',
							'letter-spacing': '-0.2px',
						}}
					>
						<Icon icon="save" iconSize="18" />

						{__('Save Changes to Style Variation', 'blockera')}

						{hasChangesets && (
							<ChangeIndicator
								isChanged={hasChangesets}
								isAnimated={true}
								primaryColor={'#1ca120'}
								size={'5'}
							/>
						)}
					</Button>

					<Flex gap="8px" justifyContent="space-between">
						<Button
							disabled={false === cachedStyle?.status}
							className={classNames(
								'action-save-customizations',
								{
									'action-disabled': false,
									'block-styles-actions': true,
								}
							)}
							variant="tertiary"
							onClick={() => handleOnDetachStyle(style)}
							size="input"
							data-test={'save-customizations'}
							style={{
								gap: '2px',
								padding: '2px 0',
								'letter-spacing': '-0.2px',
							}}
						>
							<Icon icon="unlink" iconSize="18" />

							{__('Detach Style', 'blockera')}
						</Button>

						<Button
							disabled={!isUserCanSaveCustomizations}
							className={classNames(
								'action-save-customizations',
								{
									'action-disabled': false,
									'block-styles-actions': true,
								}
							)}
							variant="tertiary"
							onClick={() => handleOnDuplicate(style)}
							size="input"
							data-test={'save-customizations'}
							style={{
								gap: '2px',
								padding: '2px 0',
								'letter-spacing': '-0.2px',
							}}
						>
							<Icon icon="clone" iconSize="18" />

							{__('Duplicate', 'blockera')}
						</Button>
					</Flex>
				</Fill>
			)}

			<Fill
				name={`blockera-style-variation-block-card-menu-${style.name}`}
			>
				{isUserCanSaveCustomizations && (
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

						<span
							className="context-menu-trigger"
							data-test={`open-${style.name}-contextmenu`}
						>
							<Icon
								iconSize="20"
								icon="more-vertical"
								onClick={() => setIsOpenContextMenu(true)}
							/>
						</span>

						<StyleItemMenu
							style={style}
							counter={counter}
							isOpenDeleteModal={isOpenDeleteModal}
							setIsOpenDeleteModal={setIsOpenDeleteModal}
							blockName={blockName}
							setCounter={setCounter}
							buttonText={buttonText}
							handleOnRename={handleOnRename}
							handleOnDuplicate={handleOnDuplicate}
							handleOnClearAllCustomizations={
								handleOnClearAllCustomizations
							}
							handleOnEnable={handleOnEnable}
							handleOnDelete={handleOnDelete}
							handleOnUsageForMultipleBlocks={
								handleOnUsageForMultipleBlocks
							}
							isConfirmedChangeID={isConfirmedChangeID}
							setIsOpenUsageForMultipleBlocks={
								setIsOpenUsageForMultipleBlocks
							}
							isOpenUsageForMultipleBlocks={
								isOpenUsageForMultipleBlocks
							}
							setIsConfirmedChangeID={setIsConfirmedChangeID}
							cachedStyle={cachedStyle}
							isOpenRenameModal={isOpenBlockCardRenameModal}
							setIsOpenRenameModal={setIsOpenBlockCardRenameModal}
							isOpenContextMenu={isOpenBlockCardContextMenu}
							setIsOpenContextMenu={setIsOpenBlockCardContextMenu}
							setCurrentBlockStyleVariation={
								setCurrentBlockStyleVariation
							}
						/>
					</Flex>
				)}
			</Fill>
		</>
	);
};
