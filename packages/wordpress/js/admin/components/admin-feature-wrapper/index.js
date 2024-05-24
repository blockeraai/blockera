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
	config: { status, parent, isActiveOnFree, isParentActive = true },
	children,
	...props
}: {
	children: any,
	config: FeatureConfig,
	/**
	 * The method of notice displaying
	 */
	showText?: 'on-hover' | 'always',
}): MixedElement => {
	if (!status) {
		return <></>;
	}

	const { getEntity } = select('blockera-core/data');
	const blockera = getEntity('blockera');

	const isLocked = /\w+-[orp]+/i.exec(blockera?.locked || '');

	if (!Array.isArray(isLocked) && !isActiveOnFree) {
		return (
			<FeatureWrapper type="free" showText="always" {...props}>
				{children}
			</FeatureWrapper>
		);
	}

	if (!isParentActive) {
		return (
			<FeatureWrapper
				typeName={parent}
				type="parent-inactive"
				showText="always"
				{...props}
			>
				{children}
			</FeatureWrapper>
		);
	}

	return <>{children}</>;
};
