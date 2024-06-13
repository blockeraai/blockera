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
 * Blockera dependencies
 */
import { Flex } from '@blockera/controls';
import { Icon } from '@blockera/icons';

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

	return (
		<DropdownMenu
			icon={() => <More className={'blockera-disable'} />}
			label="Block Settings"
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
							data-test={'Blockera Block'}
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
							<Flex alignItems="center" gap="10px">
								<Icon
									library="blockera"
									icon="blockera"
									iconSize="18"
								/>
								{'Blockera ' + __('Block', 'blockera')}
							</Flex>
						</MenuItem>

						<MenuItem
							data-test={'Gutenberg Block'}
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
							<Flex alignItems="center" gap="10px">
								<Icon
									library="wp"
									icon="wordpress"
									iconSize="18"
								/>
								{__('WordPress Core Block', 'blockera')}
							</Flex>
						</MenuItem>
					</MenuGroup>
				);
			}}
		</DropdownMenu>
	);
};
