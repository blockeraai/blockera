// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { InnerInputControlProps } from '../types';

export function OtherInput({
	value,
	setValue,
	type,
	noBorder,
	className,
	disabled,
	validator,
	actions,
	children,
	isValidValue,
	...props
}: InnerInputControlProps): MixedElement {
	return (
		<>
			<input
				value={value}
				disabled={disabled}
				className={controlClassNames(
					'input-tag',
					!isValidValue && 'invalid',
					noBorder && 'no-border',
					className
				)}
				type={type}
				{...props}
				onChange={(e) => setValue(e.target.value)}
			/>
			<div className={controlInnerClassNames('input-actions')}>
				{actions}
			</div>
			{children}
		</>
	);
}
