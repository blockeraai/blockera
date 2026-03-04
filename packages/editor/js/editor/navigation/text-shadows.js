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

export const TextShadows = ({
	backLabel,
}: {
	backLabel: string,
}): MixedElement => {
	return (
		<div className={classNames('blockera-navigation-panel')}>
			<NavigationMenu
				menu="text-shadows"
				parentMenu="root"
				className={extensionClassNames('back-navigation')}
				backButtonLabel={backLabel}
			/>
		</div>
	);
};
