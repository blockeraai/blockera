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
	config,
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
	const feature = {
		onNative: false,
		...config,
	};

	if (!feature?.status) {
		return <></>;
	}

	if (!feature?.onNative) {
		return (
			<FeatureWrapper type="native" showText="always" {...props}>
				{children}
			</FeatureWrapper>
		);
	}

	if (!feature?.isParentActive) {
		return (
			<FeatureWrapper
				typeName={feature?.parent}
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
