// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { type MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { FeatureWrapper } from '@blockera/components';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from './types';

export const AdminFeatureWrapper = ({
	config: { status, isActiveOnFree },
	children,
}: {
	children: any,
	config: FeatureConfig,
}): MixedElement => {
	if (!status) {
		return <></>;
	}

	const { getEntity } = select('blockera-core/data');
	const blockera = getEntity('blockera');

	const isLocked = /\w+-[orp]+/i.exec(blockera?.locked || '');

	if (!isLocked && !isActiveOnFree) {
		return <FeatureWrapper type="free">{children}</FeatureWrapper>;
	}

	return <>{children}</>;
};
