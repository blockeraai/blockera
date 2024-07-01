// @flow

/**
 * External dependencies
 */
import {
	SelectControl as WPSelectControl,
	CustomSelectControl as WPCustomSelectControl,
} from '@wordpress/components';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { controlClassNames } from '@blockera/classnames';
import type { TSelectControlProps } from './types';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import { useControlContext } from '../../context';
import { renderSelectNativeOption, prepareSelectCustomOptions } from './utils';

const SelectControl = ({
	type = 'native',
	options,
	customMenuPosition = 'bottom',
	customHideInputIcon = false,
	customHideInputLabel = false,
	customHideInputCaret = false,
	customInputCenterContent = false,
	noBorder = false,
	multiple = false,
	//
	id,
	label = '',
	labelPopoverTitle,
	labelDescription,
	repeaterItem,
	singularId,
	columns,
	defaultValue = '',
	onChange,
	field = 'select',
	//
	className,
}: TSelectControlProps): MixedElement => {
	const {
		value,
		setValue,
		attribute,
		blockName,
		resetToDefault,
		getControlPath,
	} = useControlContext({
		id,
		onChange,
		defaultValue,
	});

	if (type === 'custom') options = prepareSelectCustomOptions(options);

	const labelProps = {
		value,
		singularId,
		attribute,
		blockName,
		label,
		labelPopoverTitle,
		labelDescription,
		repeaterItem,
		defaultValue,
		resetToDefault,
		mode: 'advanced',
		path: getControlPath(attribute, id),
	};

	return (
		<BaseControl
			columns={columns}
			controlName={field}
			className={className}
			{...labelProps}
		>
			{type === 'native' && (
				<WPSelectControl
					className={controlClassNames(
						'select',
						'native',
						noBorder && 'no-border',
						className
					)}
					value={value}
					onChange={setValue}
					multiple={multiple}
					__nextHasNoMarginBottom
				>
					{options?.map(renderSelectNativeOption)}
				</WPSelectControl>
			)}

			{type === 'custom' && (
				<WPCustomSelectControl
					hideLabelFromVision={true}
					className={controlClassNames(
						'select',
						'custom',
						'menu-position-' + (customMenuPosition || null),
						noBorder && 'no-border',
						customHideInputIcon && 'input-hide-icon',
						customHideInputLabel && 'input-hide-label',
						customHideInputCaret && 'input-hide-caret',
						customInputCenterContent && 'input-align-center',
						className
					)}
					value={options.find((option) => option.key === value)}
					onChange={({ selectedItem }) => {
						setValue(selectedItem.key);
					}}
					options={options}
				/>
			)}
		</BaseControl>
	);
};

export default SelectControl;
