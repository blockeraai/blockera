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
import { classNames, extensionClassNames } from '@blockera/classnames';

export const Spacing = ({
	backLabel,
	closeCallback,
}: {
	backLabel: string,
	closeCallback?: () => void,
}): MixedElement => {
	return (
		<div className={classNames('blockera-navigation-panel')}>
			<div className={extensionClassNames('back-navigation')}>
				<Navigator.BackButton
					onClick={closeCallback}
					icon={<Icon icon="chevron-left" library="wp" />}
				>
					{backLabel}
				</Navigator.BackButton>
			</div>
		</div>
	);
};
