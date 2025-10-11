// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { dispatch } from '@wordpress/data';
import { useState, useMemo, useEffect } from '@wordpress/element';
import {
	Fill,
	__experimentalTruncate as Truncate,
	__experimentalDivider as Divider,
} from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { isEquals } from '@blockera/utils';
import { Flex, Button, Popover } from '@blockera/controls';
import {
	classNames,
	controlInnerClassNames,
	componentInnerClassNames,
} from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { getDefaultStyle } from '../utils';
import { RenameModal } from './rename-modal';
import { useBlockStyleItem } from './use-block-style-item';
import { useGlobalStylesPanelContext } from '../../../../../canvas-editor/components/block-global-styles-panel-screen/context';

export const StyleItem = ({
	style,
	blockName,
	activeStyle,
	blockStyles,
	setBlockStyles,
	styleItemHandler,
	onSelectStylePreview,
	setCurrentActiveStyle,
	setCurrentPreviewStyle,
	inGlobalStylesPanel = false,
}: {
	style: Object,
	blockName: string,
	activeStyle: Object,
	blockStyles: Array<Object>,
	setBlockStyles: (styles: Array<Object>) => void,
	inGlobalStylesPanel: boolean,
	styleItemHandler: (style: Object) => void,
	onSelectStylePreview: (style: Object) => void,
	setCurrentActiveStyle: (style: Object) => void,
	setCurrentPreviewStyle: (style: Object) => void,
}): MixedElement => {
	const {
		style: styleData,
		setStyle: setStyleData,
		currentBlockStyleVariation,
		setCurrentBlockStyleVariation,
	} = useGlobalStylesPanelContext() || {
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
	const {
		handleOnEnable,
		handleOnDelete,
		handleOnRename,
		isOpenRenameModal,
		handleOnDuplicate,
		isConfirmedChangeID,
		handleOnDetachStyle,
		setIsOpenRenameModal,
		setIsConfirmedChangeID,
		handleOnSaveCustomizations,
		handleOnClearAllCustomizations,
	} = useBlockStyleItem({
		blockName,
		blockStyles,
		cachedStyle,
		setBlockStyles,
		setCachedStyle,
		styles: styleData,
		setIsOpenContextMenu,
		setCurrentActiveStyle,
		setStyles: setStyleData,
		currentBlockStyleVariation,
		setCurrentBlockStyleVariation,
	});

	const isActive: boolean = activeStyle.name === style.name;
	const defaultStyle = getDefaultStyle(blockStyles);

	return (
		<>
			<Button
				className={classNames('block-editor-block-styles__item', {
					'is-active': isActive,
					'action-disabled': false === cachedStyle?.status,
				})}
				key={style.name}
				variant="secondary"
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
					// Skip click if style is disabled.
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
				aria-current={activeStyle.name === style.name}
				size="input"
				data-test={`style-${style.name}`}
			>
				<Flex
					alignItems={'center'}
					justifyContent={'space-between'}
					className="block-editor-block-styles__item-text"
				>
					<Truncate numberOfLines={1}>{buttonText}</Truncate>
					<Flex gap={2} alignItems={'center'}>
						{defaultStyle &&
							style.isDefault &&
							buttonText !== defaultStyle.name && (
								<Truncate numberOfLines={1}>
									{__('Default', 'blockera')}
								</Truncate>
							)}
						{false === cachedStyle?.status && (
							<Icon icon="eye-hide" iconSize="20" />
						)}
						{style.icon && (
							<Icon
								icon={style.icon.name}
								library={style.icon.library}
								iconSize="20"
							/>
						)}
						<Icon
							icon="more-vertical"
							iconSize="20"
							onClick={() => setIsOpenContextMenu(true)}
						/>
					</Flex>
				</Flex>
				{isOpenRenameModal && (
					<RenameModal
						style={style}
						buttonText={buttonText}
						handleOnRename={handleOnRename}
						isConfirmedChangeID={isConfirmedChangeID}
						setIsOpenRenameModal={setIsOpenRenameModal}
						setIsConfirmedChangeID={setIsConfirmedChangeID}
					/>
				)}
				{isOpenContextMenu && (
					<Popover
						title={''}
						offset={50}
						draggable={true}
						placement="left-start"
						className="variations-picker-popover"
						onClose={() => {
							setIsOpenContextMenu(false);
						}}
					>
						<Flex direction="column" gap={10}>
							<Flex
								justifyContent={'flex-start'}
								gap={8}
								alignItems={'center'}
								className={controlInnerClassNames('menu-item')}
								onClick={() => handleOnDuplicate(style)}
							>
								<Icon icon="duplicate" iconSize="24" />
								{__('Duplicate', 'blockera')}
							</Flex>
							<Flex
								justifyContent={'flex-start'}
								gap={8}
								alignItems={'center'}
								className={controlInnerClassNames('menu-item')}
								onClick={() =>
									handleOnClearAllCustomizations(style)
								}
							>
								<Icon
									icon="icon-circle-arrow-left"
									iconSize="24"
								/>
								{__('Clear all customizations', 'blockera')}
							</Flex>
							<Flex
								justifyContent={'space-between'}
								gap={8}
								alignItems={'center'}
								className={controlInnerClassNames('menu-item')}
								onClick={() => {
									setCurrentBlockStyleVariation(style);

									if (isOpenRenameModal) {
										return setIsOpenRenameModal(false);
									}

									setIsOpenRenameModal(true);
								}}
							>
								<Flex alignItems={'center'} gap={8}>
									<Icon icon="pen" iconSize="24" />
									{__('Rename', 'blockera')}
								</Flex>
								<code
									className={componentInnerClassNames(
										'rename-style'
									)}
								>{`ID: ${style.name}`}</code>
							</Flex>
							{!style.isDefault && <Divider />}
							{false === cachedStyle?.status &&
								!style?.isDefault && (
									<Flex
										justifyContent={'flex-start'}
										gap={8}
										alignItems={'center'}
										className={controlInnerClassNames(
											'menu-item'
										)}
										onClick={() =>
											handleOnEnable(true, style)
										}
									>
										<Icon icon="eye-show" iconSize="24" />
										{__('Enable', 'blockera')}
									</Flex>
								)}
							{!style?.isDefault &&
								(true === cachedStyle?.status ||
									!style.hasOwnProperty('status')) && (
									<Flex
										justifyContent={'flex-start'}
										gap={8}
										alignItems={'center'}
										className={controlInnerClassNames(
											'menu-item',
											{
												'is-disabled':
													!style?.isEnabled || false,
											}
										)}
										onClick={() =>
											handleOnEnable(false, style)
										}
									>
										<Icon icon="eye-hide" iconSize="24" />
										{__('Disable', 'blockera')}
									</Flex>
								)}
							{!style.isDefault && (
								<Flex
									justifyContent={'flex-start'}
									gap={8}
									alignItems={'center'}
									className={controlInnerClassNames(
										'menu-item',
										{
											'delete-style': true,
										}
									)}
									onClick={() => handleOnDelete(style.name)}
								>
									<Icon
										icon="icon-recycle-bin"
										iconSize="24"
									/>
									{__('Delete', 'blockera')}
								</Flex>
							)}
						</Flex>
					</Popover>
				)}
			</Button>

			{isActive && (
				<Fill name="block-inspector-style-actions">
					<Button
						className={classNames('action-save-customizations', {
							'action-disabled': false,
						})}
						variant="secondary"
						onClick={() => handleOnSaveCustomizations(style)}
						size="input"
						data-test={'save-customizations'}
					>
						{__('Save Customizations', 'blockera')}
					</Button>
					<Flex gap="8px" justifyContent="space-between">
						<Button
							className={classNames(
								'action-save-customizations',
								{
									'action-disabled': false,
									'block-styles-actions': true,
								}
							)}
							variant="secondary"
							onClick={() => handleOnDetachStyle(style)}
							size="input"
							data-test={'save-customizations'}
						>
							{__('Detach Style', 'blockera')}
						</Button>
						<Button
							className={classNames(
								'action-save-customizations',
								{
									'action-disabled': false,
									'block-styles-actions': true,
								}
							)}
							variant="secondary"
							onClick={() => handleOnDuplicate(style)}
							size="input"
							data-test={'save-customizations'}
						>
							{__('Duplicate', 'blockera')}
						</Button>
					</Flex>
				</Fill>
			)}
		</>
	);
};
