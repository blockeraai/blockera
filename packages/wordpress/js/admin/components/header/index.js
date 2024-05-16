// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { __experimentalHStack as Hstack } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import Button from '@blockera/components/js/button/button';
import { BlockeraIcon } from '@blockera/components/js/icons/library-blockera/icon';

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
				<BlockeraIcon
					icon={icon}
					style={{
						top: '5px',
						position: 'relative',
						marginRight: '20px',
					}}
				/>
				{name}
				<span className={'blockera-settings-header-version'}>
					{version}
				</span>
			</h1>
			{children}
		</Hstack>
	);
};
