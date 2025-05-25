// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { type MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { FeatureWrapper } from '@blockera/controls';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from './types';

export const AdminFeatureWrapper = ({
	config: { status, parent, onNative, isParentActive = true },
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

	const { getEntity } = select('blockera/data');
	const blockera = getEntity('blockera');

	const isLocked = /\w+-[orp]+/i.exec(blockera?.locked || '');

	if (!Array.isArray(isLocked) && onNative) {
		return (
			<FeatureWrapper type="native" showText="always" {...props}>
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
