// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __experimentalHStack as Hstack } from '@wordpress/components';

/**
 * Blockera dependencies
 */

import type { HeaderProps } from '../';

export const Header = ({
	name,
	icon,
	version,
	children,
}: HeaderProps): MixedElement => {
	return (
		<Hstack
			className={'blockera-settings-header'}
			justifyContent={'space-between'}
		>
			<h1 className={'blockera-settings-heading'}>
				{icon}

				{name}

				<span className={'blockera-settings-header-version'}>
					{version}
				</span>
			</h1>
			{children}
		</Hstack>
	);
};
