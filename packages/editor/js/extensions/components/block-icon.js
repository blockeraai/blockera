// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { BlockIcon as WPBlockIcon } from '@wordpress/block-editor';

/**
 * Blockera dependencies
 */
import { getPascalCase } from '@blockera/utils';
import { Icon } from '@blockera/icons';

export const BlockIcon = ({
	name,
	defaultIcon,
}: {
	name: string,
	defaultIcon: Object,
}): MixedElement => {
	const normalizedName = name.replace('core/', '').replace('-', ' ');
	const capitalizedName = getPascalCase(normalizedName);
	const ariaLabel: string = `${capitalizedName} Block Icon`;

	return (
		<>
			<Icon
				library="blockera"
				icon="blockera"
				iconSize="16"
				className={'blockera-block-icon'}
				data-test={ariaLabel}
				aria-label={ariaLabel}
			/>

			<WPBlockIcon icon={defaultIcon} />
		</>
	);
};
