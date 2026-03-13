// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { Navigator } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { extensionClassNames } from '@blockera/classnames';

export const NavItemBackButton = ({
	backLabel,
	closeCallback,
}: {
	backLabel: string,
	closeCallback?: () => void,
}): MixedElement => {
	return (
		<div className={extensionClassNames('back-navigation')}>
			<Navigator.BackButton
				onClick={closeCallback}
				icon={<Icon icon="chevron-left" library="wp" />}
			>
				{backLabel}
			</Navigator.BackButton>
		</div>
	);
};
