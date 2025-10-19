// @flow

/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { check } from '@wordpress/icons';
import type { MixedElement } from 'react';
import { DropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { Flex, Tooltip, DynamicHtmlFormatter } from '@blockera/controls';
import { Icon } from '@blockera/icons';
import { classNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { useBlockSections } from '../../../components/block-app';

export const BlockCardSettings = ({
	blockName,
	activeBlockVariation,
	isActive = true,
	setActive = () => {},
	actionsMenu = true,
	poweredBy = true,
}: {
	blockName: string,
	activeBlockVariation: string,
	isActive: boolean,
	setActive: (isActive: boolean) => void,
	actionsMenu: boolean,
	poweredBy: boolean,
}): MixedElement => {
	const {
		blockSections: { expandAll, collapseAll, focusMode },
		updateBlockSections,
	} = useBlockSections();

	let text = '';

	if (poweredBy) {
		if (isActive) {
			if (
				blockName.startsWith('blockera/') ||
				activeBlockVariation.startsWith('blockera/')
			) {
				text = sprintf(
					// translators: %s is the brand name (Required)
					__('Powered by %s', 'blockera'),
					'{brand-name}'
				);

				// For backward brand name to prevent removing it
				if (!text.includes('{brand-name}')) {
					text = 'Powered by {brand-name}';
				}
			} else {
				text = sprintf(
					// translators: %s is the brand name (Required)
					__('Empowered by %s', 'blockera'),
					'{brand-name}'
				);

				// For backward brand name to prevent removing it
				if (!text.includes('{brand-name}')) {
					text = 'Empowered by {brand-name}';
				}
			}

			text = DynamicHtmlFormatter({
				text,
				replacements: {
					'brand-name': (
						<Flex direction="row" alignItems="center" gap="8px">
							<Icon
								icon="blockera"
								library="blockera"
								iconSize="18"
							/>
							Blockera Site Builder
						</Flex>
					),
				},
			});
		} else {
			text = sprintf(
				// translators: %s is WordPress name (Required)
				__('%s Basic Core Block', 'blockera'),
				'{brand-name}'
			);

			// For backward brand name to prevent removing it
			if (!text.includes('{brand-name}')) {
				text = '{brand-name} Basic Core Block';
			}

			text = DynamicHtmlFormatter({
				text,
				replacements: {
					'brand-name': (
						<Icon icon="wordpress" library="wp" iconSize="18" />
					),
				},
			});
		}
	}

	return (
		<div className={'blockera-dropdown-menu'}>
			{actionsMenu && (
				<DropdownMenu
					icon={<Icon icon="more-vertical" iconSize="24" />}
					label={__('Block Settings', 'blockera')}
					popoverProps={{
						offset: 20,
						focusOnMount: true,
						placement: 'bottom-end',
					}}
				>
					{({ onClose }) => {
						return (
							<>
								<MenuGroup
									label={__('Block Settings', 'blockera')}
								>
									<MenuItem
										data-test={'advanced-mode-block'}
										icon={isActive ? check : ''}
										onClick={() => {
											setActive(!isActive);
											onClose();
										}}
										className={classNames({
											'blockera-block-menu-item': true,
											'blockera-block-menu-item-selected':
												isActive,
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
										data-test={'basic-mode-block'}
										icon={isActive ? '' : check}
										onClick={() => {
											setActive(!isActive);
											onClose();
										}}
										className={classNames({
											'blockera-block-menu-item': true,
											'blockera-block-menu-item-selected':
												!isActive,
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

								{isActive && (
									<MenuGroup
										label={__('Block Sections', 'blockera')}
									>
										<MenuItem
											data-test={'Expand All'}
											icon={expandAll ? check : ''}
											onClick={() => {
												if (focusMode) {
													return;
												}
												updateBlockSections({
													focusMode: false,
													collapseAll: false,
													defaultMode: false,
													expandAll: !expandAll,
												});
											}}
											className={classNames({
												'blockera-block-menu-item': true,
												'blockera-block-menu-item-selected':
													expandAll,
												'blockera-not-allowed':
													focusMode,
											})}
										>
											<Flex
												alignItems="center"
												gap="10px"
											>
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
												if (focusMode) {
													return;
												}

												updateBlockSections({
													expandAll: false,
													focusMode: false,
													defaultMode: false,
													collapseAll: !collapseAll,
												});
											}}
											className={classNames({
												'blockera-block-menu-item': true,
												'blockera-block-menu-item-selected':
													collapseAll,
												'blockera-not-allowed':
													focusMode,
											})}
										>
											<Flex
												alignItems="center"
												gap="10px"
											>
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
												if (focusMode) {
													return updateBlockSections({
														expandAll: false,
														focusMode: false,
														defaultMode: true,
														collapseAll: false,
													});
												}

												updateBlockSections({
													expandAll: false,
													collapseAll: false,
													defaultMode: false,
													focusMode: !focusMode,
												});
											}}
											className={classNames({
												'blockera-block-menu-item': true,
												'blockera-block-menu-item-selected':
													focusMode,
											})}
										>
											<Flex
												alignItems="center"
												gap="10px"
											>
												<Icon
													library="ui"
													icon="focus-mode"
													iconSize="18"
												/>
												{__('Focus Mode', 'blockera')}
											</Flex>
										</MenuItem>
									</MenuGroup>
								)}
							</>
						);
					}}
				</DropdownMenu>
			)}

			{isActive && poweredBy && (
				<Tooltip
					text={
						<Flex direction="row" alignItems="center" gap="8px">
							{text}
						</Flex>
					}
					style={{
						'--tooltip-bg': '#0051e7',
					}}
					delay={200}
				>
					<a
						href="https://blockera.ai/products/site-builder/?utm_source=block-section-powered-by&utm_medium=referral&utm_campaign=powered-by&utm_content=cta-link"
						target="_blank"
						rel="noopener noreferrer"
						className="blockera-powered-by-icon"
						style={{
							'--blockera-controls-primary-color': '#0051e7',
						}}
					>
						<Icon
							library="blockera"
							icon="blockera"
							iconSize={18}
						/>
					</a>
				</Tooltip>
			)}

			{!isActive && poweredBy && (
				<Tooltip
					text={
						<Flex direction="row" alignItems="center" gap="8px">
							{text}
						</Flex>
					}
					style={{
						'--tooltip-bg': '#007cba',
					}}
					delay={200}
				>
					<a
						href="https://blockera.ai/products/site-builder/?utm_source=block-section-powered-by&utm_medium=referral&utm_campaign=powered-by&utm_content=cta-link"
						target="_blank"
						rel="noopener noreferrer"
						className="blockera-powered-by-icon"
						style={{
							'--blockera-controls-primary-color': '#007cba',
						}}
					>
						<Icon library="wp" icon="wordpress" iconSize={18} />
					</a>
				</Tooltip>
			)}
		</div>
	);
};
