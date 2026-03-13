// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { classNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { NavItemBackButton } from './nav-item-back-button';

export const Borders = ({
	backLabel,
	closeCallback,
}: {
	backLabel: string,
	closeCallback?: () => void,
}): MixedElement => {
	return (
		<div className={classNames('blockera-navigation-panel')}>
			<NavItemBackButton
				backLabel={backLabel}
				closeCallback={closeCallback}
			/>
		</div>
	);
};
