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
import { PoweredBy, getDefaultPoweredByText } from '@blockera/controls';

export const NavItemBackButton = ({
	backLabel,
	closeCallback,
	showBranding = true,
}: {
	backLabel: string,
	closeCallback?: () => void,
	showBranding?: boolean,
}): MixedElement => {
	return (
		<div className={extensionClassNames('back-navigation')}>
			<Navigator.BackButton
				onClick={closeCallback}
				icon={<Icon icon="chevron-left" library="wp" />}
			>
				{backLabel}
			</Navigator.BackButton>

			{showBranding && (
				<PoweredBy
					tooltipText={getDefaultPoweredByText({
						type: 'empowered-by',
						icon: 'blockera',
						iconLibrary: 'blockera',
						iconSize: 18,
					})}
					style={{
						position: 'absolute',
						right: '14px',
						top: '15px',
					}}
					linkTabIndex={-1}
				/>
			)}
		</div>
	);
};
