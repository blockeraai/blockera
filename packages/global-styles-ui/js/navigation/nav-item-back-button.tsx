/**
 * External dependencies
 */
import type { ReactElement } from 'react';
import { Navigator } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { PoweredBy } from '@blockera/controls';
import { Icon } from '@blockera/icons';
import { classNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import './style.scss';

export const NavItemBackButton = ({
	backLabel,
	closeCallback,
	showBranding = true,
}: {
	backLabel: string;
	showBranding?: boolean;
	closeCallback?: () => void;
}): ReactElement => {
	return (
		<div className={classNames('blockera-back-navigation')}>
			<Navigator.BackButton
				onClick={closeCallback}
				icon={<Icon icon="chevron-left" library="wp" />}
			>
				{backLabel}
			</Navigator.BackButton>

			{showBranding && (
				<PoweredBy
					linkTabIndex={-1}
					style={{
						position: 'absolute',
						right: '14px',
						top: '50%',
						transform: 'translateY(-50%)',
					}}
				/>
			)}
		</div>
	);
};
