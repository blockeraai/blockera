// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	componentClassNames,
	componentInnerClassNames,
} from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { IndicatorComponentProps } from './types';

export default function ChangeIndicator({
	isChanged = false,
	isChangedOnStates = false,
	className,
	...props
}: IndicatorComponentProps): MixedElement {
	if (!isChanged && !isChangedOnStates) {
		return <></>;
	}

	return (
		<div
			className={componentClassNames('change-indicator', className)}
			data-test="change-indicator"
			{...props}
		>
			{isChanged && (
				<span
					className={componentInnerClassNames(
						'indicator',
						'indicator-primary'
					)}
					data-test="primary-change-indicator"
				></span>
			)}

			{isChangedOnStates && (
				<span
					className={componentInnerClassNames(
						'indicator',
						'indicator-states'
					)}
					data-test="states-change-indicator"
				></span>
			)}
		</div>
	);
}
