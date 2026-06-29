// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useMemo, useState, useEffect, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	DropZone,
	ToolbarButton,
	ToolbarGroup,
	Popover,
} from '@wordpress/components';
import {
	BlockControls,
	LinkControl,
	useBlockProps,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { displayShortcut } from '@wordpress/keycodes';
import { link, linkOff } from '@wordpress/icons';

/**
 * Blockera dependencies
 */
import {
	getUpdatedCoreIconLinkAttributes,
	NEW_TAB_TARGET,
} from '@blockera/blocks-core/js/libs/wordpress/icon/compatibility/link-attributes';
import { IconPickerModalProvider } from '@blockera/controls/js/libs/icon-control/icon-picker-modal-provider';
import { useIconPickerModal } from '@blockera/controls/js/libs/icon-control/hooks/use-icon-picker-modal';
import { useIconPreviewFileDrop } from '@blockera/controls/js/libs/icon-control/hooks/use-icon-preview-file-drop';
import IconPickerModal from '@blockera/controls/js/libs/icon-control/components/icon-picker/icon-picker-modal';
import CustomIconUploadUpgradePrompt from '@blockera/controls/js/libs/icon-control/components/icon-picker/custom-icon-upload-upgrade-prompt';

/**
 * Internal dependencies
 */
import { getBlockeraIconValue } from './icon-attribute-utils';
import { commitCoreIconPickerSelection } from './core-icon-picker-commit';

const LINK_SETTINGS = [
	...LinkControl.DEFAULT_LINK_SETTINGS,
	{
		id: 'nofollow',
		title: __('Mark as nofollow', 'blockera'),
	},
];

type Props = {
	attributes: Object,
	setAttributes: (Object) => void,
	clientId: string,
	isSelected?: boolean,
	hasIcon?: boolean,
	ariaLabel?: string,
	children: MixedElement,
};

/**
 * Editor link wrapper — mirrors core/image disabled anchor in the canvas.
 */
const CoreIconLinkWrapper = ({
	href,
	linkTarget,
	children,
	isInsideNavigation,
}: {
	href?: string,
	linkTarget?: string,
	children: MixedElement,
	isInsideNavigation: boolean,
}): MixedElement => {
	if (!href) {
		return children;
	}

	return (
		<a
			href={href}
			target={linkTarget || undefined}
			className={
				isInsideNavigation
					? 'wp-block-navigation-item__content'
					: undefined
			}
			onClick={(event) => event.preventDefault()}
			aria-disabled
			style={{
				pointerEvents: 'none',
				cursor: 'default',
				display: 'inline',
			}}
		>
			{children}
		</a>
	);
};

export const CoreIconBlockToolbar = ({
	attributes,
	setAttributes,
	clientId,
	isSelected = false,
	hasIcon = false,
	ariaLabel,
	children,
}: Props): MixedElement => {
	const { href = '', linkTarget, rel = '' } = attributes;
	const [isEditingURL, setIsEditingURL] = useState(false);
	const [popoverAnchor, setPopoverAnchor] = useState(null);

	const iconValue = useMemo(
		() => getBlockeraIconValue(attributes),
		[attributes]
	);

	const handlePickerCommit = useCallback(
		(nextIcon) => {
			commitCoreIconPickerSelection(attributes, nextIcon, setAttributes);
		},
		[attributes, setAttributes]
	);

	const {
		isOpenModal,
		modalInitialTab,
		openModal,
		closeModal,
		iconContextValue,
		parseMediaForDraft,
		handleUseCustomIcon,
		clearSelectedCustomIcon,
	} = useIconPickerModal({
		id: `core-icon-toolbar-${clientId}`,
		value: iconValue,
		onCommit: handlePickerCommit,
	});

	const {
		handlePreviewFilesDrop,
		isUploadUpgradeOpen,
		closeUploadUpgradePrompt,
	} = useIconPreviewFileDrop({
		onCommitSvg: handleUseCustomIcon,
	});

	const isInsideNavigation = useSelect(
		(select) => {
			const { getBlockParentsByBlockName } = select('core/block-editor');

			return (
				getBlockParentsByBlockName(clientId, 'core/navigation', true)
					?.length > 0
			);
		},
		[clientId]
	);

	const isHrefSet = !!href;
	const opensInNewTab = linkTarget === NEW_TAB_TARGET;
	const nofollow = rel?.includes('nofollow');

	const linkValue = useMemo(
		() => ({
			url: href,
			opensInNewTab,
			nofollow,
		}),
		[href, opensInNewTab, nofollow]
	);

	useEffect(() => {
		if (!isSelected) {
			setIsEditingURL(false);
		}
	}, [isSelected]);

	const unlink = () => {
		setAttributes({
			href: undefined,
			linkTarget: undefined,
			rel: undefined,
		});
		setIsEditingURL(false);
	};

	const blockProps = useBlockProps({
		ref: setPopoverAnchor,
		...(ariaLabel ? { 'aria-label': ariaLabel, role: 'img' } : {}),
	});

	return (
		<>
			<BlockControls group="default">
				<ToolbarGroup>
					<ToolbarButton onClick={() => openModal()}>
						{hasIcon
							? __('Replace', 'blockera')
							: __('Choose icon', 'blockera')}
					</ToolbarButton>
				</ToolbarGroup>
			</BlockControls>
			<BlockControls group="other">
				<ToolbarGroup>
					<ToolbarButton
						name="link"
						icon={!isHrefSet ? link : linkOff}
						title={
							!isHrefSet
								? __('Link', 'blockera')
								: __('Unlink', 'blockera')
						}
						shortcut={
							!isHrefSet
								? displayShortcut.primary('k')
								: displayShortcut.primaryShift('k')
						}
						onClick={
							!isHrefSet ? () => setIsEditingURL(true) : unlink
						}
						isActive={isHrefSet}
					/>
				</ToolbarGroup>
			</BlockControls>
			{isOpenModal && (
				<IconPickerModalProvider iconContextValue={iconContextValue}>
					<IconPickerModal
						initialActiveTab={modalInitialTab}
						onClose={closeModal}
						onParseMediaForDraft={parseMediaForDraft}
						onUseCustomIcon={handleUseCustomIcon}
						onClearSelectedIcon={clearSelectedCustomIcon}
					/>
				</IconPickerModalProvider>
			)}
			{isSelected && (isEditingURL || isHrefSet) && (
				<Popover
					placement="bottom"
					onClose={() => setIsEditingURL(false)}
					anchor={popoverAnchor}
					focusOnMount={isEditingURL ? 'firstElement' : false}
					__unstableSlotName="__unstable-block-tools-after"
					shift
				>
					<LinkControl
						value={linkValue}
						forceIsEditingLink={isEditingURL}
						settings={LINK_SETTINGS}
						onChange={({
							url: newURL,
							opensInNewTab: newOpensInNewTab,
							nofollow: newNofollow,
						}) =>
							setAttributes(
								getUpdatedCoreIconLinkAttributes({
									rel,
									href: newURL,
									opensInNewTab: newOpensInNewTab,
									nofollow: newNofollow,
								})
							)
						}
						onRemove={unlink}
					/>
				</Popover>
			)}
			<div {...blockProps}>
				<DropZone onFilesDrop={handlePreviewFilesDrop} />

				<CustomIconUploadUpgradePrompt
					isOpen={isUploadUpgradeOpen}
					onClose={closeUploadUpgradePrompt}
				/>

				<CoreIconLinkWrapper
					href={href}
					linkTarget={linkTarget}
					isInsideNavigation={isInsideNavigation}
				>
					{children}
				</CoreIconLinkWrapper>
			</div>
		</>
	);
};

/** @deprecated Use CoreIconBlockToolbar */
export const CoreIconLinkToolbar = CoreIconBlockToolbar;
