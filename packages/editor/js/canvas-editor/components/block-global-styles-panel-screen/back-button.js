// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { Flex, Button } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { Icon } from '@blockera/icons';

export const BackButton = (): MixedElement => {
	return (
		<Flex alignItems="center" className="blockera-back-button-wrapper">
			<Button
				className="blockera-back-button"
				onClick={() => {
					document
						.querySelector(
							'button.components-navigator-back-button'
						)
						?.click();
				}}
			>
				<Icon icon="chevron-left" size={20} library="wp" />
			</Button>
			<h2>{__('Back', 'blockera')}</h2>
		</Flex>
	);
};
