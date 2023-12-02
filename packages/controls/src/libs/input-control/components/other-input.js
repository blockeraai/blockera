// @flow
/**
 * External dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';
import { isFunction } from '@publisher/utils';

/**
 * Internal dependencies
 */
import type { TOtherInput } from '../types';

export function OtherInput({
	value,
	setValue,
	type,
	noBorder,
	className,
	disabled,
	validator,
	actions,
	...props
}: TOtherInput): MixedElement {
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
		</>
	);
}
