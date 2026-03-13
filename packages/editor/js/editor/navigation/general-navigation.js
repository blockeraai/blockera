// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { type MixedElement } from 'react';
import { Navigator } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { Flex } from '@blockera/controls';
import { extensionClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { NavItemWrapper } from './nav-item-wrapper';
import { navItemClassName } from './nav-item-classname';

export const GeneralNavigation = (): MixedElement => {
	return (
		<div className={extensionClassNames('navigation-category')}>
			<h2>
				<Flex alignItems="center" justifyContent="flex-start">
					<Icon icon="extension-general" iconSize={20} />
					{__('General', 'blockera')}
				</Flex>
			</h2>
			<NavItemWrapper
				className={navItemClassName({ 'navigation-item': true })}
			>
				<Navigator.Button
					id="layout-panel"
					path="/layout"
					onClick={() =>
						document.querySelector('button[id="/layout"]')?.click()
					}
					icon={<Icon icon="wp-layout" iconSize={20} />}
				>
					{__('Layout', 'blockera')}
				</Navigator.Button>
			</NavItemWrapper>
		</div>
	);
};
