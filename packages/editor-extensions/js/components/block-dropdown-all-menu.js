// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { check } from '@wordpress/icons';
import type { MixedElement } from 'react';
import { dispatch } from '@wordpress/data';
import { DropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import { More } from '../libs/settings/icons';

export const BlockDropdownAllMenu = ({
	isActive,
	setActive,
}: {
	isActive: boolean,
	setActive: (isActive: boolean) => void,
}): MixedElement => {
	const { setBlockExtensionsStatus } = dispatch('blockera-core/extensions');

	console.log('isActive', isActive);
	return (
		<DropdownMenu
			icon={() => <More className={'blockera-disable'} />}
			label=" Block Settings"
			popoverProps={{
				offset: 20,
				focusOnMount: true,
				placement: 'bottom-end',
			}}
		>
			{({ onClose }) => {
				return (
					<MenuGroup label={__('Block Settings', 'blockera')}>
						<MenuItem
							icon={isActive ? check : ''}
							onClick={() => {
								setBlockExtensionsStatus(!isActive);
								setActive(!isActive);
								onClose();
							}}
							className={classNames({
								'blockera-block-menu-item': true,
								'blockera-block-menu-item-selected': isActive,
							})}
						>
							{__('Blockera Block', 'blockera')}
						</MenuItem>

						<MenuItem
							icon={isActive ? '' : check}
							onClick={() => {
								setBlockExtensionsStatus(!isActive);
								setActive(!isActive);
								onClose();
							}}
							className={classNames({
								'blockera-block-menu-item': true,
								'blockera-block-menu-item-selected': !isActive,
							})}
						>
							{__('Gutenberg Block', 'blockera')}
						</MenuItem>
					</MenuGroup>
				);
			}}
		</DropdownMenu>
	);
};
