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
					<MenuGroup label={__('Block Settings', 'blockera')}>
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
									? __('Disabled', 'blockera')
									: __('Disable', 'blockera')) +
									__(' ', 'blockera')}
							</span>
							{isActive && (
								<NoticeControl
									type={'warning'}
									style={{ marginTop: '20px' }}
								>
									{__(
										'If you click on "Disable ", cleaning all  attributes from current block. Double-check and ensure this is intentional.',
										'blockera'
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
									? __('Enabled', 'blockera')
									: __('Enable', 'blockera')) +
									__(' ', 'blockera')}
							</span>
						</MenuItem>
					</MenuGroup>
				);
			}}
		</DropdownMenu>
	);
};
