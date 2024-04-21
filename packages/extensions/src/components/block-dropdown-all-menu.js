// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { check } from '@wordpress/icons';
import type { MixedElement } from 'react';
import { dispatch } from '@wordpress/data';
import { DropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { More } from '../libs/settings/icons';
import { NoticeControl } from '@blockera/controls';
import classNames from 'classnames';

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
			label=" Block Settings"
			popoverProps={{
				offset: 20,
				focusOnMount: true,
				placement: 'bottom-end',
			}}
		>
			{({ onClose }) => {
				return (
					<MenuGroup label={__('Block Settings', 'blockera-core')}>
						<MenuItem
							icon={isActive ? '' : check}
							onClick={() => {
								setBlockExtensionsStatus(!isActive);
								setActive(!isActive);
								onClose();
							}}
							className={classNames({
								'blockera-block-menu-item': isActive,
								'blockera-block-menu-item-selected': !isActive,
							})}
						>
							<span>
								{(!isActive
									? __('Disabled', 'blockera-core')
									: __('Disable', 'blockera-core')) +
									__(' ', 'blockera-core')}
							</span>
							{isActive && (
								<NoticeControl
									type={'warning'}
									style={{ marginTop: '20px' }}
								>
									{__(
										'If you click on "Disable ", cleaning all  attributes from current block. Double-check and ensure this is intentional.',
										'blockera-core'
									)}
								</NoticeControl>
							)}
						</MenuItem>
						<MenuItem
							icon={isActive ? check : ''}
							onClick={() => {
								setBlockExtensionsStatus(!isActive);
								setActive(!isActive);
								onClose();
							}}
							className={classNames({
								'blockera-block-menu-item-selected': isActive,
							})}
						>
							<span>
								{(isActive
									? __('Enabled', 'blockera-core')
									: __('Enable', 'blockera-core')) +
									__(' ', 'blockera-core')}
							</span>
						</MenuItem>
					</MenuGroup>
				);
			}}
		</DropdownMenu>
	);
};
