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
import { NoticeControl } from '@publisher/controls';
import classNames from 'classnames';

export const BlockDropdownAllMenu = ({
	isActive,
	setActive,
}: {
	isActive: boolean,
	setActive: (isActive: boolean) => void,
}): MixedElement => {
	const { setBlockExtensionsStatus } = dispatch('publisher-core/extensions');

	return (
		<DropdownMenu
			icon={() => <More className={'publisher-disable'} />}
			label="Publisher Block Settings"
			popoverProps={{
				offset: 20,
				focusOnMount: true,
				placement: 'bottom-end',
			}}
		>
			{({ onClose }) => {
				return (
					<MenuGroup label={__('Block Settings', 'publisher-core')}>
						<MenuItem
							icon={isActive ? '' : check}
							onClick={() => {
								setBlockExtensionsStatus(!isActive);
								setActive(!isActive);
								onClose();
							}}
							className={classNames({
								'publisher-block-menu-item': isActive,
								'publisher-block-menu-item-selected': !isActive,
							})}
						>
							<span>
								{(!isActive
									? __('Disabled', 'publisher-core')
									: __('Disable', 'publisher-core')) +
									__(' Publisher', 'publisher-core')}
							</span>
							{isActive && (
								<NoticeControl
									type={'warning'}
									style={{ marginTop: '20px' }}
								>
									{__(
										'If you click on "Disable Publisher", cleaning all Publisher attributes from current block. Double-check and ensure this is intentional.',
										'publisher-core'
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
								'publisher-block-menu-item-selected': isActive,
							})}
						>
							<span>
								{(isActive
									? __('Enabled', 'publisher-core')
									: __('Enable', 'publisher-core')) +
									__(' Publisher', 'publisher-core')}
							</span>
						</MenuItem>
					</MenuGroup>
				);
			}}
		</DropdownMenu>
	);
};
