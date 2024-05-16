// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useState, useEffect } from '@wordpress/element';
import { componentClassNames } from '@blockera/classnames';

export const Switch = ({
	label,
	value,
	onChange,
	className,
}: {
	label?: string,
	value: boolean,
	className?: string,
	onChange: (checked: boolean) => void,
}): MixedElement => {
	const [isChecked, setIsChecked] = useState(value);
	const handleChange = (e: Object): void => {
		setIsChecked(e.target.checked);

		onChange(e.target.checked);
	};
	const toggleChecked = (): void => {
		setIsChecked(!isChecked);

		onChange(!isChecked);
	};

	useEffect(() => {
		if (isChecked === value) {
			return;
		}

		setIsChecked(value);
		// eslint-disable-next-line
	}, [value]);

	return (
		<div className={componentClassNames('switch', className)}>
			<span>
				<input
					type="checkbox"
					id="toggleInput"
					checked={isChecked}
					onChange={handleChange}
				/>
				<button
					className="slider"
					type="button"
					onClick={toggleChecked}
				></button>
			</span>
			{/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
			<label htmlFor="toggleInput" onClick={toggleChecked}>
				{label}
			</label>
		</div>
	);
};
