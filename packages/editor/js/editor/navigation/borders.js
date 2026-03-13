// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { Navigator } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { classNames, extensionClassNames } from '@blockera/classnames';

export const Borders = ({
	backLabel,
	closeCallback,
}: {
	backLabel: string,
	closeCallback?: () => void,
}): MixedElement => {
	return (
		<div className={classNames('blockera-navigation-panel')}>
			<div className={extensionClassNames('back-navigation')}>
				<Navigator.BackButton onClick={closeCallback}>
					{backLabel}
				</Navigator.BackButton>
			</div>
		</div>
	);
};
