// @flow
/**
 * External dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import { isFunction } from '@blockera/utils';

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
	...props
}: InnerInputControlProps): MixedElement {
	const [isValidValue, setIsValidValue] = useState(true);

	// validator checking
	useEffect(() => {
		if (!validator) {
			return;
		}

		let isValid = false;

		if (isFunction(validator)) {
			isValid = validator(value);
		}

		// Update isValidValue based on the result of validation
		setIsValidValue(isValid);
	}, [value]); // eslint-disable-line

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
