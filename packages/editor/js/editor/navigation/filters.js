// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __experimentalNavigationMenu as NavigationMenu } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { classNames, extensionClassNames } from '@blockera/classnames';

export const Filters = ({ backLabel }: { backLabel: string }): MixedElement => {
	return (
		<div className={classNames('blockera-navigation-panel')}>
			<NavigationMenu
				menu="filters"
				parentMenu="root"
				className={extensionClassNames('back-navigation')}
				backButtonLabel={backLabel}
			/>
		</div>
	);
};
