// @flow
/**
 * External dependencies
 */
import { CheckboxControl as WPCheckboxControl } from '@wordpress/components';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { controlClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import { useControlContext } from '../../context';
import type { CheckboxControlProps } from './types';

export default function CheckboxControl({
	checkboxLabel,
	//
	id,
	label,
	labelPopoverTitle,
	labelDescription,
	repeaterItem,
	singularId,
	columns,
	defaultValue = false,
	onChange,
	field = 'checkbox',
	//
	className,
	...props
}: CheckboxControlProps): MixedElement {
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
			<WPCheckboxControl
				className={controlClassNames('checkbox', className)}
				checked={value}
				onChange={setValue}
				label={checkboxLabel}
				{...props}
				aria-checked={value}
			/>
		</BaseControl>
	);
}
