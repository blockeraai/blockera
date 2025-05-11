// @flow
/**
 * External dependencies
 */
import { useCallback, type MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { isUndefined } from '@blockera/utils';
import { controlClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { BaseControl, Tooltip } from '../index';
import { useControlContext } from '../../context';
import type { ToggleSelectControlProps } from './types';

export default function ToggleSelectControl({
	isDeselectable = false,
	options,
	//
	id,
	label = '',
	labelDescription,
	labelPopoverTitle,
	columns,
	defaultValue = '',
	onChange = () => {},
	field = 'toggle-select',
	singularId,
	repeaterItem,
	//
	className,
	children,
	...props
}: ToggleSelectControlProps): MixedElement {
	const {
		value,
		setValue,
		attribute,
		blockName,
		getControlPath,
		resetToDefault,
	} = useControlContext({
		id,
		onChange,
		defaultValue,
		valueCleanup,
	});

	function valueCleanup(value: any) {
		return isUndefined(value) ? '' : value;
	}

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Tab') {
				e.preventDefault();
				const currentIndex = options.findIndex(
					(option) => option.value === value
				);
				const nextIndex = e.shiftKey
					? (currentIndex - 1 + options.length) % options.length
					: (currentIndex + 1) % options.length;
				setValue(options[nextIndex].value);
			}
		},
		[options, value, setValue]
	);

	const handleOptionClick = useCallback(
		(optionValue: string) => {
			if (isDeselectable && value === optionValue) {
				setValue(undefined);
			} else {
				setValue(optionValue);
			}
		},
		[value, isDeselectable, setValue]
	);

	return (
		<BaseControl
			columns={columns}
			controlName={field}
			className={className}
			{...{
				value,
				singularId,
				attribute,
				blockName,
				label,
				labelDescription,
				labelPopoverTitle,
				defaultValue,
				repeaterItem,
				resetToDefault,
				mode: 'advanced',
				path: getControlPath(attribute, id),
			}}
		>
			<div
				className={controlClassNames('toggle-select', className)}
				role="radiogroup"
				onKeyDown={handleKeyDown}
				tabIndex={0}
				{...props}
			>
				{options?.map((item) => (
					<Tooltip
						key={item.value}
						text={item['aria-label'] || item.label}
					>
						<button
							className={controlClassNames(
								'toggle-select-option',
								{
									'is-selected': value === item.value,
								}
							)}
							role="radio"
							aria-label={item['aria-label'] || item.label}
							disabled={item.disabled}
							onClick={() => handleOptionClick(item.value)}
							value={item.value}
							{...(isDeselectable
								? {
										'aria-pressed': value === item.value,
								  }
								: {
										'aria-checked': value === item.value,
								  })}
						>
							{!isUndefined(item.icon) ? (
								<span className="toggle-select-option-icon">
									{item.icon}
								</span>
							) : (
								<span className="toggle-select-option-label">
									{item.label}
								</span>
							)}
						</button>
					</Tooltip>
				))}
			</div>
			{children}
		</BaseControl>
	);
}
