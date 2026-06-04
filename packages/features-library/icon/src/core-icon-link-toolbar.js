// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useMemo, useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ToolbarButton, Popover } from '@wordpress/components';
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

export const CoreIconLinkToolbar = ({
	attributes,
	setAttributes,
	clientId,
	isSelected = false,
	ariaLabel,
	children,
}: Props): MixedElement => {
	const { href = '', linkTarget, rel = '' } = attributes;
	const [isEditingURL, setIsEditingURL] = useState(false);
	const [popoverAnchor, setPopoverAnchor] = useState(null);

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

	const blockProps = useBlockProps(
		ariaLabel ? { 'aria-label': ariaLabel, role: 'img' } : undefined
	);

	return (
		<>
			<BlockControls group="block">
				<ToolbarButton
					ref={setPopoverAnchor}
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
					onClick={!isHrefSet ? () => setIsEditingURL(true) : unlink}
					isActive={isHrefSet}
				/>
			</BlockControls>
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
