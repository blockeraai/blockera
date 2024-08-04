// @flow
/**
 * External dependencies
 */
import {
	__experimentalToggleGroupControl as WPToggleGroupControl,
	__experimentalToggleGroupControlOption as WPToggleGroupControlOption,
	__experimentalToggleGroupControlOptionIcon as WPToggleGroupControlOptionIcon,
} from '@wordpress/components';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { isUndefined } from '@blockera/utils';
import { controlClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { BaseControl } from '../index';
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
		// WPToggleGroupControl returns undefined while deselecting
		return isUndefined(value) ? '' : value;
	}

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
			<div className={controlClassNames('toggle-select', className)}>
				<WPToggleGroupControl
					className={controlClassNames(
						'toggle-select-inner',
						className
					)}
					value={value}
					onChange={setValue}
					label={undefined}
					hideLabelFromVision={true}
					isBlock={true}
					isDeselectable={isDeselectable}
					__nextHasNoMarginBottom={false}
					{...props}
				>
					{options?.map((item) => {
						if (!isUndefined(item.icon)) {
							return (
								<WPToggleGroupControlOptionIcon
									{...item}
									key={item.value}
								/>
							);
						}

						return (
							<WPToggleGroupControlOption
								{...item}
								key={item.value}
							/>
						);
					})}
				</WPToggleGroupControl>
			</div>
			{children}
		</BaseControl>
	);
}
