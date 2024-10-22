// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { check } from '@wordpress/icons';
import type { MixedElement } from 'react';
import { DropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/controls';
import { Icon } from '@blockera/icons';
import { classNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { useBlockSections } from './block-app';

export const BlockDropdownAllMenu = ({
	setBlockMode,
	isBlockeraAdvancedMode,
}: {
	isBlockeraAdvancedMode: boolean,
	setBlockMode: (blockeraMode: 'advanced' | 'basic') => void,
}): MixedElement => {
	const { blockSections, updateBlockSections } = useBlockSections();
	const { expandAll, collapseAll, focusMode } = blockSections;

	return (
		<DropdownMenu
			icon={<Icon icon="more-vertical" iconSize="24" />}
			label="Block Settings"
			popoverProps={{
				offset: 20,
				focusOnMount: true,
				placement: 'bottom-end',
			}}
		>
			{({ onClose }) => {
				return (
					<>
						<MenuGroup label={__('Block Settings', 'blockera')}>
							<MenuItem
								data-test={'Blockera Block'}
								icon={isBlockeraAdvancedMode ? check : ''}
								onClick={() => {
									setBlockMode('advanced');
									onClose();
								}}
								className={classNames({
									'blockera-block-menu-item': true,
									'blockera-block-menu-item-selected':
										isBlockeraAdvancedMode,
								})}
							>
								<Flex alignItems="center" gap="10px">
									<Icon
										library="blockera"
										icon="blockera"
										iconSize="18"
									/>
									{__('Advanced Mode', 'blockera')}
								</Flex>
							</MenuItem>

							<MenuItem
								data-test={'Gutenberg Block'}
								icon={isBlockeraAdvancedMode ? '' : check}
								onClick={() => {
									setBlockMode('basic');
									onClose();
								}}
								className={classNames({
									'blockera-block-menu-item': true,
									'blockera-block-menu-item-selected':
										!isBlockeraAdvancedMode,
								})}
							>
								<Flex alignItems="center" gap="10px">
									<Icon
										library="wp"
										icon="wordpress"
										iconSize="18"
									/>
									{__('Basic Mode', 'blockera')}
								</Flex>
							</MenuItem>
						</MenuGroup>
						<MenuGroup label={__('Block Sections', 'blockera')}>
							<MenuItem
								data-test={'Expand All'}
								icon={expandAll ? check : ''}
								onClick={() => {
									updateBlockSections({
										focusMode: false,
										collapseAll: false,
										expandAll: !expandAll,
									});
									onClose();
								}}
								className={classNames({
									'blockera-block-menu-item': true,
									'blockera-block-menu-item-selected':
										expandAll,
								})}
							>
								<Flex alignItems="center" gap="10px">
									<Icon
										library="ui"
										icon="expand-all"
										iconSize="18"
									/>
									{__('Expand All', 'blockera')}
								</Flex>
							</MenuItem>
							<MenuItem
								data-test={'Collapse All'}
								icon={collapseAll ? check : ''}
								onClick={() => {
									updateBlockSections({
										expandAll: false,
										focusMode: false,
										collapseAll: !collapseAll,
									});
									onClose();
								}}
								className={classNames({
									'blockera-block-menu-item': true,
									'blockera-block-menu-item-selected':
										collapseAll,
								})}
							>
								<Flex alignItems="center" gap="10px">
									<Icon
										library="ui"
										icon="collapse-all"
										iconSize="18"
									/>
									{__('Collapse All', 'blockera')}
								</Flex>
							</MenuItem>
							<MenuItem
								data-test={'Focus Mode'}
								icon={focusMode ? check : ''}
								onClick={() => {
									updateBlockSections({
										expandAll: false,
										collapseAll: false,
										focusMode: !focusMode,
									});
									onClose();
								}}
								className={classNames({
									'blockera-block-menu-item': true,
									'blockera-block-menu-item-selected':
										focusMode,
								})}
							>
								<Flex alignItems="center" gap="10px">
									<Icon
										library="ui"
										icon="focus-mode"
										iconSize="18"
									/>
									{__('Focus Mode', 'blockera')}
								</Flex>
							</MenuItem>
						</MenuGroup>
					</>
				);
			}}
		</DropdownMenu>
	);
};
