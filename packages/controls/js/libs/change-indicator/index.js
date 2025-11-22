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
	primaryColor = '#007cba',
	statesColor = '#d47c14',
	size = '5',
	outlineSize = '1.5',
	isAnimated = false,
	className,
	style,
	...props
}: IndicatorComponentProps): MixedElement {
	if (!isChanged && !isChangedOnStates) {
		return <></>;
	}

	return (
		<div
			className={componentClassNames('change-indicator', className)}
			data-test="change-indicator"
			style={style}
			{...props}
		>
			{isChanged && (
				<span
					className={componentInnerClassNames(
						'indicator',
						'indicator-primary',
						isAnimated && 'is-animated'
					)}
					data-test="primary-change-indicator"
					data-color={primaryColor}
					style={{
						'--indicator-size': size + 'px',
						'--indicator-color': primaryColor,
						'--indicator-outline-size': outlineSize + 'px',
					}}
				></span>
			)}

			{isChangedOnStates && (
				<span
					className={componentInnerClassNames(
						'indicator',
						'indicator-states',
						isAnimated && 'is-animated'
					)}
					data-test="states-change-indicator"
					data-color={statesColor}
					style={{
						'--indicator-size': size + 'px',
						'--indicator-color': statesColor,
						'--indicator-outline-size': outlineSize + 'px',
					}}
				></span>
			)}
		</div>
	);
}
